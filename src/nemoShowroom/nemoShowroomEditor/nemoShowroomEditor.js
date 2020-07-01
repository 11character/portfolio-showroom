import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import * as StaticVariable from '../common/staticVariable';
import Raycaster from '../common/raycaster';
import Options from './options';
import HistoryManager from './history-manager';
import AssetItem from '../common/assetItem';
import ItemLoader from '../common/itemLoader';
import Utils from '../../class/utils';
import CssRenderer from '../common/cssRenderer';
import AssetItemManager from './assetItemManager';
import TransformHistory from './transformHistory';

const Promise = window.Promise;

export default class NemoShowroomEditor {
    constructor (obj = {}) {
        const me  = this;

        me.options = new Options(obj);

        const winW = me.options.el.offsetWidth;
        const winH = me.options.el.offsetHeight;

        // ---
        me.itemLoader = new ItemLoader();

        // ---
        me.rootEl = Utils.createDivElement();

        // ---
        me.scene = new THREE.Scene();

        // ---
        me.light = new THREE.DirectionalLight();
        me.light.position.set(1, 1, 1);

        // ---
        me.camera = new THREE.PerspectiveCamera(45, winW / winH, StaticVariable.CAMERA_NEAR, StaticVariable.CAMERA_FAR);
        me.camera.position.copy(StaticVariable.CAMERA_ZERO_POSITION);
        me.camera.lookAt(StaticVariable.CAMERA_ZERO_LOOK_AT);

        // ---
        me.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, logarithmicDepthBuffer: true});
        me.renderer.setSize(winW, winH);
        me.renderer.setPixelRatio(window.devicePixelRatio);
        me.renderer.domElement.style.position = 'absolute';
        me.renderer.domElement.style.left = '0px';
        me.renderer.domElement.style.top = '0px';

        //--
        me.cssRenderer = new CssRenderer(me.renderer, me.camera);
        me.cssRenderer.resize();
        me.cssRenderer.domElement.style.left = '0px';
        me.cssRenderer.domElement.style.top = '0px';

        //--
        me.assetItemManager = new AssetItemManager();

        // ---
        me.baseField = new THREE.Group();
        me.baseField.name = StaticVariable.ITEM_BASE_FIELD_NAME;

        // ---
        me.objectField = new THREE.Group();
        me.objectField.name = StaticVariable.ITEM_OBJECT_FIELD_NAME;

        // ---
        me.obControls = new OrbitControls(me.camera, me.renderer.domElement);
        me.obControls.enableKeys = false;
        me.obControls.minPolarAngle = StaticVariable.CONTROLS_MIN_POLAR_ANGLE;
        me.obControls.maxPolarAngle = StaticVariable.CONTROLS_MAX_POLAR_ANGLE;

        // ---
        me.tfControls = new TransformControls(me.camera, me.renderer.domElement);
        // material 에 transparent 속성이 true인 경우 선택한 객체 뒤로 컨트롤러가 가려진다. 이를 해결하기 위해 renderOrder값을 1로 올려준다. (기본값은 0)
        me.tfControls.traverse(function (object3D) {
            object3D.renderOrder = 1;
        });

        // ---
        me.raycaster = new Raycaster(me.renderer, me.camera);

        // ---
        me.clock = new THREE.Clock();

        // ---
        me.historyManager = new HistoryManager(me);

        // ---
        me.gridObject3D = new THREE.GridHelper( StaticVariable.GRID_SIZE, StaticVariable.GRID_DIVISIONS, StaticVariable.GRID_COLOR, StaticVariable.GRID_COLOR );

        // ---
        me.scene.add(me.camera);
        me.scene.add(me.light);
        me.scene.add(me.baseField);
        me.scene.add(me.objectField);
        me.scene.add(me.tfControls);
        me.scene.add(me.gridObject3D);

        // ---
        me.rootEl.classList.add(StaticVariable.ELEMENT_FIELD_CLASS_NAME);
        me.rootEl.id = StaticVariable.ELEMENT_FIELD_ID;
        me.rootEl.style.width = me.options.width + 'px';
        me.rootEl.style.height = me.options.height + 'px';
        me.rootEl.style.overflow = 'hidden';
        me.rootEl.style.position = 'relative';

        // ---
        me.rootEl.appendChild(me.cssRenderer.domElement);
        me.rootEl.appendChild(me.renderer.domElement);
        me.options.el.appendChild(me.rootEl);

        // ---
        me.isRun = true;

        //--
        me.disableAttach = false;
        me.selectedItem = null;

        //--
        me.start();
        me.__initEvent();
    }

    /**
     * 화면에 격자를 보인다.
     */
    showGrid() {
        const me = this;

        me.gridObject3D.visible = true;
    }

    /**
     * 화면에 격자를 숨긴다.
     */
    hideGrid() {
        const me = this;

        me.gridObject3D.visible = false;
    }

    /**
     * 배경화면을 정해진 색으로 표시한다.
     * @param {string} colorCode #000000 형태의 색상코드.
     */
    showBackground(colorCode = StaticVariable.STYLE_BACKGROUND_COLOR) {
        const me = this;

        me.rootEl.style.backgroundColor = colorCode;
    }

    /**
     * 배경화면을 숨긴다.
     */
    hideBackground() {
        const me = this;

        me.rootEl.style.backgroundColor = '';
    }

    /**
     * 선택을 못하게 한다.
     */
    disableAttach() {
        const me = this;

        me.disableAttach = true;
    }

    /**
     * 선택을 할 수 있도록 한다.
     */
    enableAttach() {
        const me = this;

        me.disableAttach = false;
    }

    /**
     * 화면컨트롤러를 끈다.
     */
    disableViewController() {
        const me =this;

        me.obControls.enablePan = false;
        me.obControls.enableZoom = false;
        me.obControls.enableRotate = false;
        me.obControls.enabled = false;
        me.obControls.saveState();
    }

    /**
     * 화면컨트롤러를 켠다.
     */
    enableViewController() {
        const me = this;

        me.obControls.reset();
        me.obControls.enablePan = true;
        me.obControls.enableZoom = true;
        me.obControls.enableRotate = true;
        me.obControls.enabled = true;
    }

    /**
     * 아이템을 선택한다.
     * @param {AssetItem} assetItem 선택할 아이템 객체.
     */
    attach(assetItem) {
        const me = this;

        if (assetItem && (!me.disableAttach)) {
            me.tfControls.attach(assetItem.object3D);
            me.tfControls.visible = true;
            me.selectedItem = assetItem;

            me.options.onSelect(assetItem, me);
        }
    }

    /**
     * 선택을 취소한다.
     */
    detach() {
        const me = this;

        if (!me.disableAttach) {
            me.tfControls.detach();
            me.tfControls.visible = false;
            me.selectedItem = null;

            me.options.onDeselect(me);
        }
    }

    /**
     * 카메라 위치를 초기화 한다.
     */
    viewDefault() {
        const me = this;

        me.obControls.target0.copy(StaticVariable.CAMERA_ZERO_LOOK_AT);
        me.obControls.position0.copy(StaticVariable.CAMERA_ZERO_POSITION);
        me.obControls.zoom0 = StaticVariable.CAMERA_ZERO_ZOOM;

        me.obControls.reset();
    }

    /**
     * 실행.
     */
    redo() {
        const me = this;

        me.detach();
        me.historyManager.redo();
    }

    /**
     * 실행취소.
     */
    undo() {
        const me = this;

        me.detach();
        me.historyManager.undo();
    }

    /**
     * 랜더링 시작.
     */
    start() {
        const me = this;

        me.isRun = true;

        (function animate() {
            if (me.isRun) {
                requestAnimationFrame(animate);
            }

            me.renderer.render(me.scene, me.camera);
            me.assetItemManager.animationUpdate(me.clock.getDelta());

            me.cssRenderer.updateAll();
            me.cssRenderer.render();
        })();
    }

    /**
     * 랜더링 멈춤.
     */
    stop() {
        const me = this;

        me.isRun = false;
    }

    /**
     * 화면에 3D객체를 추가한다.
     * @param {AssetItem || object} obj 화면에 표시할 3D객체 정보.
     */
    import(obj) {
        const me = this;

        const assetItem = new AssetItem(obj);

        return me.itemLoader.load(assetItem).then(function (currentItem) {
            me.objectField.add(currentItem.object3D);
            me.cssRenderer.add(assetItem);
            me.assetItemManager.add(assetItem);

            assetItem.animationPlay();

            me.historyManager.push({
                name: 'import',
                redo: function () {
                    me.recoverArray([currentItem]);
                },
                undo: function () {
                    me.removeArray([currentItem]);
                }
            });

            return Promise.resolve(currentItem);
        });
    }

    /**
     * 아이템 id를 받아서 화면에 복원한다.
     * @param {string} id 복원할 아이템 id.
     */
    recoverFromId(id) {
        const me = this;
        const item = me.assetItemManager.recover(id);

        me.objectField.add(item.object3D);

        me.historyManager.push({
            name: 'recoverFromId',
            redo: function () {
                me.recoverFromId(id);
            },
            undo: function () {
                me.removeById(id);
            }
        });
    }

    /**
     * 아이템 배열을 받아 화면에 되돌려 놓는다.
     * @param {Array} arr 복원할 아이템 배열.
     */
    recoverArray(arr) {
        const me = this;

        for (let i = 0; i < arr.length; i++) {
            me.recoverFromId(arr[i].id);
        }
    }

    /**
     * 화면의 모든 아이템을 제거한다.
     */
    removeAll() {
        const me = this;

        me.detach();

        const itemArr = me.assetItemManager.getItemArray();

        me.objectField.remove.apply(me.objectField, me.objectField.children);
        me.assetItemManager.removeAll();

        me.historyManager.push({
            name: 'removeAll',
            redo: function () {
                me.removeArray(itemArr);
            },
            undo: function () {
                me.recoverArray(itemArr);
            }
        });
    }

    /**
     * 선택한 아이템을 제거한다.
     */
    remove() {
        const me = this;

        const assetItem = me.selectedItem;

        if (assetItem) {
            const id = assetItem.id;

            me.detach();

            me.removeById(id);
        }
    }

    /**
     * 아이템 id를 받아서 화면에서 제거한다.
     * @param {string} id 삭제할 아이템 id.
     */
    removeById(id) {
        const me = this;
        const item = me.assetItemManager.remove(id);

        me.objectField.remove(item.object3D);

        me.historyManager.push({
            name: 'removeById',
            redo: function () {
                me.removeById(id);
            },
            undo: function () {
                me.recoverFromId(id);
            }
        });
    }

    /**
     * 아이템 배열을 받아 화면에서 제거한다.
     * @param {Array} arr 삭제할 아이템 배열.
     */
    removeArray(arr) {
        const me = this;

        for (let i = 0; i < arr.length; i++) {
            me.removeById(arr[i].id);
        }
    }

    /**
     * 이름을 입력받아 해당 이름을 가진 아이템 정보를 반환한다. 중복시 처음 찾은 정보만 반환한다.
     * @param {string} name assetItem에 지정된 이름.
     */
    getItemByName (name) {
        const me = this;

        return me.assetItemManager.getItemByName(name);
    }

    /**
     * 2D 객체 sprite 전환, 해제
     */
    switchingSpriteMode () {
        const me = this;

        const prevItem = me.selectedItem;
        const type = 'html,image,youtube';

        if (prevItem && type.indexOf(prevItem.type) >= 0) {
            const cloneItem = prevItem.clone();

            cloneItem.rotation.x = 0;
            cloneItem.rotation.y = 0;
            cloneItem.rotation.z = 0;
            cloneItem.isSprite = !cloneItem.isSprite;

            me.import(cloneItem).then(function () {
                me.remove();

                const historyManager = me.historyManager;
                const undoHistory = historyManager.getHistory();
                const redoHistory = historyManager.getHistory(historyManager.cursor - 1);

                undoHistory.onUndo = function () {
                    historyManager.undo();
                };

                redoHistory.onRedo = function () {
                    historyManager.redo();
                };
            });
        }
    }

    /**
     * 조작 모드를 변경한다.
     * @param {string} mode 모드명.
     */
    modeChange(mode) {
        const me = this;

        if (mode !== StaticVariable.CONTROLS_TF_MODE_SCALE) {
            me.tfControls.space = StaticVariable.CONTROLS_TF_SPACE_W;
        }

        me.tfControls.setMode(mode);
    }

    /**
     * 선택한 아이템의 크기를 변경한다.
     * @param {number} x x축.
     * @param {number} y y축.
     * @param {number} z z축.
     */
    setScale(x, y, z) {
        const me = this;

        const assetItem = me.selectedItem;

        if (assetItem) {
            x = parseFloat(x);
            y = parseFloat(y);
            z = parseFloat(z);

            const transformHistory = new TransformHistory(assetItem, assetItem);

            assetItem.object3D.scale.set(x, y, z);

            assetItem.syncMembers();

            transformHistory.setNextItem(assetItem);

            me.__pushTransformHistory([transformHistory]);

            me.options.onMove([assetItem], me);
        }
    }

    /**
     * 입력된 비율만큼 전체 크기를 변경한다. (1 == 100%)
     * @param {number} x x축.
     * @param {number} y y축.
     * @param {number} z z축.
     */
    multiplyScaleAll(x, y, z) {
        const me = this;

        const itemArr = me.assetItemManager.getItemArray();
        const tHistoryArr = [];

        let assetItem;

        x = parseFloat(x);
        y = parseFloat(y);
        z = parseFloat(z);

        me.detach();

        for (let i = 0; i < itemArr.length; i++) {
            assetItem = itemArr[i];

            const transformHistory = new TransformHistory(assetItem, assetItem);

            assetItem.object3D.position.multiply(new THREE.Vector3(x, y, z));
            assetItem.object3D.scale.multiply(new THREE.Vector3(x, y, z));

            assetItem.syncMembers();

            transformHistory.setNextItem(assetItem);

            tHistoryArr.push(transformHistory);
        }

        me.__pushTransformHistory(tHistoryArr);

        me.options.onMove(itemArr, me);
    }

    /**
     * 선택한 아이템을 이동한다.
     * @param {number} x x좌표.
     * @param {number} y y좌표.
     * @param {number} z z좌표.
     */
    setPosition(x, y, z) {
        const me = this;

        const assetItem = me.selectedItem;

        if (assetItem) {
            x = parseFloat(x);
            y = parseFloat(y);
            z = parseFloat(z);

            const transformHistory = new TransformHistory(assetItem, assetItem);

            assetItem.object3D.position.set(x, y, z);

            assetItem.syncMembers();

            transformHistory.setNextItem(assetItem);

            me.__pushTransformHistory([transformHistory]);

            me.options.onMove([assetItem], me);
        }
    }

    /**
     * 선택한 아이템을 축을 기준으로 회전시킨다.
     * @param {number} x x축 기준 회전값.
     * @param {number} y y축 기준 회전값.
     * @param {number} z z축 기준 회전값.
     */
    setRotation(x, y, z) {
        const me = this;

        const assetItem = me.selectedItem;

        if (assetItem) {
            x = parseFloat(x);
            y = parseFloat(y);
            z = parseFloat(z);

            const transformHistory = new TransformHistory(assetItem, assetItem);

            assetItem.object3D.rotation.set(x, y, z, assetItem.object3D.rotation.w);

            assetItem.syncMembers();

            transformHistory.setNextItem(assetItem);

            me.__pushTransformHistory([transformHistory]);

            me.options.onMove([assetItem], me);
        }
    }

    /**
     * 선택한 아이템이 애니메이션인 경우 실행할 시간을 입력한다. 0인 경우 계속 실행한다.
     * @param {integer} startMs 애니메이션이 시작하는 시간. (millisecond)
     * @param {integer} endMs 애니메이션이 끝나는 시간. (millisecond)
     * @param {boolean} loop 애니메이션 반복여부.
     */
    setAnimationTime(startMs = 0, endMs = 0, loop = true) {
        const me = this;

        const assetItem = me.selectedItem;

        if (assetItem) {
            assetItem.animationStop();
            assetItem.setAnimationTime(startMs, endMs, loop);
            assetItem.animationPlay();
        }
    }

     /**
     * 대상을 클릭했을 때 이동할 경로를 입력한다.
     * @param {string} link 이동할 경로.
     */
    setLink(link) {
        const me = this;

        const assetItem = me.selectedItem;

        if (assetItem) {
            assetItem.link = link;
        }
    }

    /**
     * 선택된 대상을 화면의 기준점으로 잡는다.
     * @param {AssetItem} assetItem 보여줄 아이템 객체.
     */
    viewTarget(assetItem = this.selectedItem) {
        const me = this;

        if (assetItem) {
            const object3D = assetItem.object3D;

            let box = new THREE.Box3();
            box.setFromObject(object3D);

            const boxSize = new THREE.Vector3();
            box.getSize(boxSize);

            const halfBoxSize = boxSize.clone().divide(new THREE.Vector3(2, 2, 2));
            const target = box.max.clone().sub(halfBoxSize);

            // 카메라의 기본 위치를 기준으로 한 화면에 표시되 치수. (3D공간 내부의 수치 기준)
            const vRad = (Math.PI / 180) * (me.camera.getEffectiveFOV()) / 2; // 화면의 수직각도.
            const defaultHeight = StaticVariable.CAMERA_ZERO_POSITION.z * Math.tan(vRad); // 화면의 높이.
            const defaultWidth = me.camera.aspect * defaultHeight; // 화면의 넓이.
            const defaultDepth = (defaultHeight / 2) / Math.tan(vRad); // 화면의 깊이.
            const hRad = Math.atan2(defaultWidth / 2, defaultDepth); // 화면의 수평각도.

            let z = boxSize.y / Math.tan(vRad); // 수직 기준 깊이. 주변 여백을 위해 y값을 2로 나누지 않고 사용한다.

            if (defaultWidth - boxSize.x < defaultHeight - boxSize.y) {
                z = boxSize.x / Math.tan(hRad); // 수평 기준 깊이. 주변 여백을 위해 x값을 2로 나누지 않고 사용한다.
            }

            z += halfBoxSize.z; // 깊이는 대상의 중심이 아니라 전면을 기준으로 한다.

            const position = new THREE.Vector3(0, 0, z);
            position.add(target);

            me.obControls.target0.copy(target);
            me.obControls.position0.copy(position);
            me.obControls.zoom0 = StaticVariable.CAMERA_ZERO_ZOOM;

            me.obControls.reset();
        }
    }

    /**
     * 화면의 크기를 재설정 한다.
     * @param {integer} width 화면의 넓이.
     * @param {integer} height 화면의 높이.
     */
    resize(width = 800, height = 600) {
        const me = this;

        me.rootEl.style.width = width + 'px';
        me.rootEl.style.height = height + 'px';

        me.renderer.setSize(width, height);

        me.cssRenderer.resize();
        me.cssRenderer.domElement.style.left = '0px';
        me.cssRenderer.domElement.style.top = '0px';

        me.camera.aspect = width / height;
        me.camera.updateProjectionMatrix();
    }

    __pushTransformHistory(arr) {
        const me = this;

        const tArr = arr;

        me.historyManager.push({
            name: 'transform',
            redo: function () {
                let tHistory;
                let object3D;
                for (let i = 0; i < arr.length; i++) {
                    tHistory = tArr[i];
                    object3D = tHistory.currentItem.object3D;

                    const p = tHistory.nextItem.position;
                    const r = tHistory.nextItem.rotation;
                    const s = tHistory.nextItem.scale;

                    object3D.position.set(p.x, p.y, p.z);
                    object3D.rotation.set(r.x, r.y, r.z, object3D.rotation.w);
                    object3D.scale.set(s.x, s.y, s.z);

                    tHistory.currentItem.syncMembers();
                }
            },
            undo: function () {
                let tHistory;
                let object3D;

                for (let i = 0; i < arr.length; i++) {
                    tHistory = tArr[i];
                    object3D = tHistory.currentItem.object3D;

                    const p = tHistory.prevItem.position;
                    const r = tHistory.prevItem.rotation;
                    const s = tHistory.prevItem.scale;

                    object3D.position.set(p.x, p.y, p.z);
                    object3D.rotation.set(r.x, r.y, r.z, object3D.rotation.w);
                    object3D.scale.set(s.x, s.y, s.z);

                    tHistory.currentItem.syncMembers();
                }
            }
        });
    }

    __intersect(evt) {
        const me = this;

        const intersectChild = me.raycaster.intersect(this.objectField.children, evt.offsetX, evt.offsetY);

        let group = null;

        if (intersectChild) {
            intersectChild.traverseAncestors(function (object3D) {
                if (object3D.parent && object3D.parent.name === StaticVariable.ITEM_OBJECT_FIELD_NAME) {
                    group = object3D;
                }
            });
        }

        return me.assetItemManager.getItemByObject3D(group);
    }

    __initEvent() {
        const me = this;

        // 마우스클릭.
        me.renderer.domElement.addEventListener('mousedown', function (evt) {
            const intersectedItem = me.__intersect(evt);

            switch(evt.which) {
                case 1:
                    break;

                case 2:
                    break;

                case 3:
                    if (intersectedItem) {
                        me.attach(intersectedItem);

                    } else {
                        me.detach();
                    }
                    break;
            }
        });

        // 컨트롤러 이벤트 설정.
        setTimeout(function () {
            let prevItem;
            let isUsingTfControl = false;

            me.obControls.saveState();

            me.tfControls.addEventListener('mouseDown', function () {
                prevItem = new AssetItem(me.selectedItem);
                me.disableViewController();
            });

            me.tfControls.addEventListener('objectChange', function () {
                isUsingTfControl = !!me.selectedItem;
            });

            me.tfControls.addEventListener('mouseUp', function () {
                me.selectedItem.syncMembers();

                if (isUsingTfControl) {
                    isUsingTfControl = false;

                    const transformHistory = new TransformHistory(me.selectedItem, prevItem, me.selectedItem);
                    me.__pushTransformHistory([transformHistory]);

                    setTimeout(function () {
                        me.options.onMove([me.selectedItem], me);
                    }, 100);
                }

                me.enableViewController();
            });

            me.obControls.domElement.addEventListener('mouseout', function () {
                me.disableViewController();
            });

            me.obControls.domElement.addEventListener('mouseenter', function () {
                me.enableViewController();
            });
        }, 100);
    }
}