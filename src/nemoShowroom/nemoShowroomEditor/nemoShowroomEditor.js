import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';

import * as StaticVariable from '../common/staticVariable';
import MouseRaycaster from '../common/mouseRaycaster';
import HistoryManager from './historyManager';
import AssetItem from '../common/assetItem';
import ItemLoader from '../common/itemLoader';
import CssRenderer from '../common/cssRenderer';
import AssetItemManager from '../common/assetItemManager';
import Options from './options';
import Utils from '../../class/utils';
import TransformHistory from './transformHistory';

import EditorInterface from '../common/editorInterface';

const Promise = window.Promise;

export default class NemoShowroomEditor extends EditorInterface {
    constructor (obj = {}) {
        super();

        const me  = this;

        RectAreaLightUniformsLib.init();

        me.options = new Options(obj);

        const winW = me.options.width;
        const winH = me.options.height;

        // ---
        me.itemLoader = new ItemLoader();

        // ---
        me.rootEl = Utils.createDivElement();
        me.rootEl.style.backgroundColor = StaticVariable.STYLE_BACKGROUND_COLOR;

        // ---
        me.scene = new THREE.Scene();

        // ---
        me.lightField = new THREE.Group();

        // ---
        me.light = new THREE.DirectionalLight();
        me.light.intensity = 0;
        me.light.position.copy(StaticVariable.LIGHT_ZERO_POSITION);
        me.lightField.add(me.light);

        // ---
        me.camera = new THREE.PerspectiveCamera(45, winW / winH, StaticVariable.CAMERA_NEAR, StaticVariable.CAMERA_FAR);
        me.camera.position.copy(StaticVariable.CAMERA_ZERO_POSITION);
        me.camera.lookAt(StaticVariable.CAMERA_ZERO_LOOK_AT);

        // ---
        me.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        me.renderer.setSize(winW, winH);
        me.renderer.setPixelRatio(window.devicePixelRatio);
        me.renderer.domElement.style.position = 'absolute';
        me.renderer.domElement.style.left = '0px';
        me.renderer.domElement.style.top = '0px';
        me.renderer.shadowMap.enabled = true;
        me.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // ---
        me.cssRenderer = new CssRenderer(me.renderer, me.camera);
        me.cssRenderer.resize();
        me.cssRenderer.domElement.style.left = '0px';
        me.cssRenderer.domElement.style.top = '0px';

        // ---
        me.assetItemManager = new AssetItemManager();

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
        me.tfControls.setRotationSnap(Math.PI / 180);
        me.tfControls.renderOrder = 1;
        me.tfControls.traverse(function (obj) {
            obj.renderOrder = 1;
        });

        // ---
        me.mouseRaycaster = new MouseRaycaster(me.renderer, me.camera);

        // ---
        me.clock = new THREE.Clock();

        // ---
        me.historyManager = new HistoryManager(me);

        // ---
        me.gridObject3D = new THREE.GridHelper( StaticVariable.GRID_SIZE, StaticVariable.GRID_DIVISIONS, StaticVariable.GRID_COLOR, StaticVariable.GRID_COLOR );
        me.gridObject3D.position.setY(0.005);
        me.gridObject3D.renderOrder = 1;
        me.gridObject3D.traverse(function (obj) {
            obj.renderOrder = 1;
        });

        // ---
        const floorGeo = new THREE.PlaneBufferGeometry(StaticVariable.FLOOR_SIZE, StaticVariable.FLOOR_SIZE);
        const floorMat = new THREE.MeshPhongMaterial({color: StaticVariable.FLOOR_COLOR});
        me.baseFloor = new THREE.Mesh(floorGeo, floorMat);
        me.baseFloor.rotation.x = -(Math.PI / 2);
        me.baseFloor.renderOrder = 1;
        me.baseFloor.traverse(function (obj) {
            obj.renderOrder = 1;
        });

        // ---
        me.scene.add(me.camera);
        me.scene.add(me.lightField);
        me.scene.add(me.objectField);
        me.scene.add(me.tfControls);
        me.scene.add(me.gridObject3D);
        me.scene.add(me.baseFloor);

        // ---
        me.rootEl.classList.add(StaticVariable.ELEMENT_FIELD_CLASS_NAME);
        me.rootEl.id = StaticVariable.ELEMENT_FIELD_ID;
        me.rootEl.style.width = winW + 'px';
        me.rootEl.style.height = winH + 'px';
        me.rootEl.style.overflow = 'hidden';
        me.rootEl.style.position = 'relative';

        // ---
        me.rootEl.appendChild(me.cssRenderer.domElement);
        me.rootEl.appendChild(me.renderer.domElement);
        me.options.el.appendChild(me.rootEl);

        // ---
        me.isRun = true;

        // ---
        me.disableAttach = false;
        me.selectedItem = null;

        // ---
        me.start();
        me.__initEvent();
    }

    /**
     * ??????????????? ????????????.
     */
    addStartPoint() {
        const me = this;

        const name = '-Start point-';

        let assetItem = me.assetItemManager.getItemByName(name);
        let promise;

        if (assetItem) {
            me.viewTarget(assetItem);

            promise = Promise.resolve(assetItem);

        } else {
            let assetItem = new AssetItem({
                name: name,
                type: StaticVariable.ITEM_TYPE_START_POINT
            });

            promise = me.itemLoader.load(assetItem).then(function (currentItem) {
                me.objectField.add(currentItem.object3D);
                me.assetItemManager.add(currentItem);

                me.historyManager.push({
                    name: 'addStartPoint',
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

        return promise;
    }

    /**
     * ???????????? ????????????.
     * @param {string} lightType ?????? ??????.
     */
    addLight(lightType) {
        const me = this;

        let name = lightType.charAt(0).toUpperCase();
        name += lightType.slice(1);
        name = '-' + name + '-';

        const assetItem = new AssetItem({
            name: name,
            type: lightType
        });

        return me.itemLoader.load(assetItem).then(function (currentItem) {
            me.objectField.add(currentItem.object3D);
            me.assetItemManager.add(currentItem);

            me.historyManager.push({
                name: 'addLight.' + lightType,
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
     * ????????? ????????? ?????????.
     */
    showGrid() {
        const me = this;

        me.gridObject3D.visible = true;
    }

    /**
     * ????????? ????????? ?????????.
     */
    hideGrid() {
        const me = this;

        me.gridObject3D.visible = false;
    }

    /**
     * ??????????????? ????????? ????????? ????????????.
     * @param {string} colorCode #000000 ????????? ????????????.
     */
    showBackground(colorCode = StaticVariable.STYLE_BACKGROUND_COLOR) {
        const me = this;

        me.rootEl.style.backgroundColor = colorCode;
    }

    /**
     * ??????????????? ?????????.
     */
    hideBackground() {
        const me = this;

        me.rootEl.style.backgroundColor = '';
    }

    /**
     * ????????? ????????? ??????.
     */
    disableAttach() {
        const me = this;

        me.disableAttach = true;
    }

    /**
     * ????????? ??? ??? ????????? ??????.
     */
    enableAttach() {
        const me = this;

        me.disableAttach = false;
    }

    /**
     * ????????????????????? ??????.
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
     * ????????????????????? ??????.
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
     * ???????????? ????????????.
     * @param {AssetItem} assetItem ????????? ????????? ??????.
     */
    attach(assetItem) {
        const me = this;

        if (assetItem && (!me.disableAttach)) {
            me.tfControls.attach(assetItem.object3D);
            me.tfControls.visible = true;
            me.selectedItem = assetItem;

            me.__tfcRotateOnlyY(assetItem);

            me.options.onSelect(assetItem, me);
        }
    }

    /**
     * ????????? ????????????.
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
     * ????????? ????????? ????????? ??????.
     */
    viewDefault() {
        const me = this;

        me.obControls.target0.copy(StaticVariable.CAMERA_ZERO_LOOK_AT);
        me.obControls.position0.copy(StaticVariable.CAMERA_ZERO_POSITION);
        me.obControls.zoom0 = StaticVariable.CAMERA_ZERO_ZOOM;

        me.obControls.reset();
    }

    /**
     * ??????.
     */
    redo() {
        const me = this;

        me.detach();
        me.historyManager.redo();
    }

    /**
     * ????????????.
     */
    undo() {
        const me = this;

        me.detach();
        me.historyManager.undo();
    }

    /**
     * ????????? ??????.
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
     * ????????? ??????.
     */
    stop() {
        const me = this;

        me.isRun = false;
    }

    /**
     * json??? ?????? ????????? ?????? ????????????.
     * @param {String} json
     */
    openJson(json) {
        const me = this;

        const data = JSON.parse(json);
        const arr = data.itemArray;

        let promise = Promise.resolve();

        if (Array.isArray(arr) && arr.length) {
            me.setLightIntensity(data.lightIntensity);
            me.setLightHorizontalAngle(data.lightHorizontalAngle);

            // ????????? ????????? ????????? ????????? ?????? ?????????.
            const hasPrveOpen = me.objectField.children.length;

            if (hasPrveOpen) {
                me.removeAll();

                // ?????? ????????? ?????? ??????????????? ????????? ??????.
                const removeHistoryInfo = me.historyManager.getHistory();

                // ????????? ????????? ?????? ???, ?????? ????????? ???????????? ??????????????? ????????????.
                removeHistoryInfo.onRedo = function () {
                    me.historyManager.redo();
                };
            }

            const promiseArr = [];

            let assetItem;

            for (let i = 0; i < arr.length; i++) {
                assetItem = new AssetItem(arr[i]);

                promiseArr.push(me.itemLoader.load(assetItem));
            }

            promise = Promise.all(promiseArr).then(function (itemArr) {
                // ???????????? ?????? destroy() ????????? ?????? ??????.
                if (me.options) {
                    let assetItem;

                    for (let i = 0; i < itemArr.length; i++) {
                        assetItem = itemArr[i];

                        me.objectField.add(assetItem.object3D);
                        me.cssRenderer.add(assetItem);
                        me.assetItemManager.add(assetItem);

                        assetItem.animationPlay();
                    }

                    me.options.onLoad(itemArr);

                    me.historyManager.push({
                        name: 'open',
                        redo: function () {
                            me.recoverArray(itemArr);
                        },
                        undo: function () {
                            me.removeArray(itemArr);
                        },
                        onUndo: function () {
                            if (hasPrveOpen) {
                                me.historyManager.undo();
                            }
                        }
                    });
                }
            });
        }

        return promise;
    }

    /**
     * ????????? 3D????????? ????????????.
     * @param {AssetItem || object} obj ????????? ????????? 3D?????? ??????.
     */
    import(obj) {
        const me = this;

        const assetItem = new AssetItem(obj);

        return me.itemLoader.load(assetItem).then(function (currentItem) {
            me.objectField.add(currentItem.object3D);
            me.cssRenderer.add(currentItem);
            me.assetItemManager.add(currentItem);

            currentItem.animationPlay();

            me.options.onLoad([currentItem]);

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
     * ???????????? ????????? ????????? JSON????????? ????????????.
     */
    exportJson() {
        const me = this;

        const obj = {
            lightIntensity: me.getLightIntensity(),
            lightHorizontalAngle: me.getLightHorizontalAngle(),
            itemArray: me.assetItemManager.getItemArray()
        };

        return JSON.stringify(obj);
    }

    /**
     * ????????? id??? ????????? ????????? ????????????.
     * @param {string} id ????????? ????????? id.
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
     * ????????? ????????? ?????? ????????? ????????? ?????????.
     * @param {Array} arr ????????? ????????? ??????.
     */
    recoverArray(arr) {
        const me = this;

        for (let i = 0; i < arr.length; i++) {
            me.recoverFromId(arr[i].id);
        }
    }

    /**
     * ????????? ?????? ???????????? ????????????.
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
     * ????????? ???????????? ????????????.
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
     * ????????? id??? ????????? ???????????? ????????????.
     * @param {string} id ????????? ????????? id.
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
     * ????????? ????????? ?????? ???????????? ????????????.
     * @param {Array} arr ????????? ????????? ??????.
     */
    removeArray(arr) {
        const me = this;

        for (let i = 0; i < arr.length; i++) {
            me.removeById(arr[i].id);
        }
    }

    /**
     * ????????? ???????????? ?????? ????????? ?????? ????????? ????????? ????????????. ????????? ?????? ?????? ????????? ????????????.
     * @param {string} name assetItem??? ????????? ??????.
     */
    getItemByName (name) {
        const me = this;

        return me.assetItemManager.getItemByName(name);
    }

    /**
     * 2D ?????? sprite ??????, ??????.
     */
    switchingSpriteMode () {
        const me = this;

        const prevItem = me.selectedItem;

        if (prevItem && StaticVariable.ITEM_2D_TYPES.indexOf(prevItem.type) >= 0) {
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
     * ?????? ????????? ????????????.
     * @param {string} mode ?????????.
     */
    modeChange(mode) {
        const me = this;

        if (mode !== StaticVariable.CONTROLS_TF_MODE_SCALE) {
            me.tfControls.space = StaticVariable.CONTROLS_TF_SPACE_W;
        }

        me.tfControls.setMode(mode);
    }

    /**
     * ????????? ???????????? ????????? ????????????.
     * @param {number} x x???.
     * @param {number} y y???.
     * @param {number} z z???.
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

            assetItem.syncTransformMembers();

            transformHistory.setNextItem(assetItem);

            me.__pushTransformHistory([transformHistory]);

            me.options.onMove([assetItem], me);
        }
    }

    /**
     * ????????? ???????????? ?????? ????????? ????????????. (1 == 100%)
     * @param {number} x x???.
     * @param {number} y y???.
     * @param {number} z z???.
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

            if (!assetItem.isLight && !assetItem.isStartPoint) {
                assetItem.object3D.scale.multiply(new THREE.Vector3(x, y, z));
            }

            assetItem.syncTransformMembers();

            transformHistory.setNextItem(assetItem);

            tHistoryArr.push(transformHistory);
        }

        me.__pushTransformHistory(tHistoryArr);

        me.options.onMove(itemArr, me);
    }

    /**
     * ????????? ???????????? ????????????.
     * @param {number} x x??????.
     * @param {number} y y??????.
     * @param {number} z z??????.
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

            assetItem.syncTransformMembers();

            transformHistory.setNextItem(assetItem);

            me.__pushTransformHistory([transformHistory]);

            me.options.onMove([assetItem], me);
        }
    }

    /**
     * ????????? ???????????? ?????? ???????????? ???????????????.
     * @param {number} x x??? ?????? ?????????.
     * @param {number} y y??? ?????? ?????????.
     * @param {number} z z??? ?????? ?????????.
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

            assetItem.syncTransformMembers();

            transformHistory.setNextItem(assetItem);

            me.__pushTransformHistory([transformHistory]);

            me.options.onMove([assetItem], me);
        }
    }

    /**
     * ????????? ???????????? ?????????????????? ?????? ????????? ????????? ????????????. 0??? ?????? ?????? ????????????.
     * @param {integer} startMs ?????????????????? ???????????? ??????. (millisecond)
     * @param {integer} endMs ?????????????????? ????????? ??????. (millisecond)
     * @param {boolean} loop ??????????????? ????????????.
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
     * ????????? ???????????? ??? ????????? ????????? ????????????.
     * @param {string} link ????????? ??????.
     */
    setLink(link) {
        const me = this;

        const assetItem = me.selectedItem;

        if (assetItem) {
            assetItem.link = link;
        }
    }

    /**
     * ????????? ???????????? ???????????? ?????? ??? ????????? ????????????.
     * @param {boolean} bool ?????? ??????.
     */
    setCastShadow(bool) {
        const me = this;

        const assetItem = me.selectedItem;

        if (assetItem) {
            assetItem.setCastShadow(bool);
        }
    }

    /**
     * ????????? ???????????? ???????????? ????????? ??? ????????? ????????????.
     * @param {boolean} bool ?????? ??????.
     */
    setReceiveShadow(bool) {
        const me = this;

        const assetItem = me.selectedItem;

        if (assetItem) {
            assetItem.setReceiveShadow(bool);
        }
    }

    /**
     * ????????? ????????? ????????? ??????????????? ?????????.
     * @param {AssetItem} assetItem ????????? ????????? ??????.
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

            // ???????????? ?????? ????????? ???????????? ??? ????????? ????????? ??????. (3D?????? ????????? ?????? ??????)
            const vRad = (Math.PI / 180) * (me.camera.getEffectiveFOV()) / 2; // ????????? ????????????.
            const defaultHeight = StaticVariable.CAMERA_ZERO_POSITION.z * Math.tan(vRad); // ????????? ??????.
            const defaultWidth = me.camera.aspect * defaultHeight; // ????????? ??????.
            const defaultDepth = (defaultHeight / 2) / Math.tan(vRad); // ????????? ??????.
            const hRad = Math.atan2(defaultWidth / 2, defaultDepth); // ????????? ????????????.

            let z = boxSize.y / Math.tan(vRad); // ?????? ?????? ??????. ?????? ????????? ?????? y?????? 2??? ????????? ?????? ????????????.

            if (defaultWidth - boxSize.x < defaultHeight - boxSize.y) {
                z = boxSize.x / Math.tan(hRad); // ?????? ?????? ??????. ?????? ????????? ?????? x?????? 2??? ????????? ?????? ????????????.
            }

            z += halfBoxSize.z; // ????????? ????????? ????????? ????????? ????????? ???????????? ??????.

            const position = new THREE.Vector3(0, 0, z);
            position.add(target);

            me.obControls.target0.copy(target);
            me.obControls.position0.copy(position);
            me.obControls.zoom0 = StaticVariable.CAMERA_ZERO_ZOOM;

            me.obControls.reset();
        }
    }

    /**
     * ????????? ????????? ????????? ??????.
     * @param {integer} width ????????? ??????.
     * @param {integer} height ????????? ??????.
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

    /**
     * ?????? ?????? ?????? ??????.
     * @param {float} intensity ??????.
     */
    setLightIntensity(intensity) {
        const me = this;

        me.light.intensity = intensity;
    }

    /**
     * ?????? ?????? ?????? ??????.
     * @param {float} rad Y??? ????????? ??????.
     */
    setLightHorizontalAngle(rad) {
        const me = this;

        // ?????? ?????? ????????? ????????? ?????? ???????????? ????????? ????????? ?????????. (?????? ??????)
        me.lightField.rotation.set(0, rad / 2, 0);
    }

    /**
     * ?????? ?????? ??????.
     */
    getLightIntensity() {
        const me = this;

        return me.light.intensity;
    }

    /**
     * ?????? ?????? ?????? ??????.
     */
    getLightHorizontalAngle() {
        const me = this;

        // ?????? ?????? ????????? ????????? ?????? ???????????? ????????? ?????? ??????. (?????? ??????)
        return me.lightField.rotation.y * 2;
    }

    /**
     * ????????? ?????????.
     */
    destroy() {
        const me = this;

        me.stop();

        if (me.rootEl.parentElement) {
            me.rootEl.parentElement.removeChild(me.rootEl);
        }

        me.scene.traverse(function (object3D) {
            if (object3D.geometry) {
                object3D.geometry.dispose();
            }

            if (object3D.material && Array.isArray(object3D.material)) {
                for (let i = 0; i < object3D.material.length; i++) {
                    object3D.material[i].dispose();
                }
            } else if (object3D.material) {
                object3D.material.dispose();
            }
        });

        me.scene.dispose();

        me.scene.remove.apply(me.scene, me.scene.children);

        setTimeout(function () {

            for (let key in me) {
                if (me.hasOwnProperty(key)) {
                    delete me[key];
                }
            }
        }, 1);
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

                    tHistory.currentItem.syncTransformMembers();
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

                    tHistory.currentItem.syncTransformMembers();
                }
            }
        });
    }

    __intersect(evt) {
        const me = this;

        const intersectChild = me.mouseRaycaster.intersect(me.objectField.children, evt);

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

    __tfcRotateOnlyY(assetItem) {
        const me = this;

        if (assetItem) {
            const isStartPointRotate = (me.tfControls.mode == 'rotate') && assetItem.isStartPoint;
            me.tfControls.showX = !isStartPointRotate;
            me.tfControls.showZ = !isStartPointRotate;
        }
    }

    __initEvent() {
        const me = this;

        // ???????????????.
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

        // ???????????? ????????? ??????.
        setTimeout(function () {
            let prevItem;
            let isUsingTfControl = false;

            me.obControls.saveState();

            me.tfControls.addEventListener('change', function () {
                me.__tfcRotateOnlyY(me.selectedItem);
            });

            me.tfControls.addEventListener('mouseDown', function () {
                prevItem = new AssetItem(me.selectedItem);
                me.disableViewController();
            });

            me.tfControls.addEventListener('objectChange', function () {
                isUsingTfControl = !!me.selectedItem;
            });

            me.tfControls.addEventListener('mouseUp', function () {
                me.selectedItem.syncTransformMembers();

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