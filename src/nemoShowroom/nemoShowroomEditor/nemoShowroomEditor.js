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
        me.fieldEl = Utils.createDivElement();

        // ---
        me.scene = new THREE.Scene();

        // ---
        me.light = new THREE.AmbientLight();

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
        me.fieldEl.classList.add(StaticVariable.ELEMENT_FIELD_CLASS_NAME);
        me.fieldEl.id = StaticVariable.ELEMENT_FIELD_ID;
        me.fieldEl.style.width = me.options.width + 'px';
        me.fieldEl.style.height = me.options.height + 'px';
        me.fieldEl.style.overflow = 'hidden';
        me.fieldEl.style.position = 'relative';

        // ---
        me.fieldEl.appendChild(me.cssRenderer.domElement);
        me.fieldEl.appendChild(me.renderer.domElement);
        me.options.el.appendChild(me.fieldEl);

        // ---
        (function animate() {
            requestAnimationFrame(animate);

            me.renderer.render(me.scene, me.camera);

            me.cssRenderer.updateAll();
            me.cssRenderer.render();
        })();
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
     * 화면의 크기를 재설정 한다.
     * @param {integer} width 화면의 넓이.
     * @param {integer} height 화면의 높이.
     */
    resize(width = 800, height = 600) {
        const me = this;

        me.fieldEl.style.width = width + 'px';
        me.fieldEl.style.height = height + 'px';

        me.renderer.setSize(width, height);

        me.cssRenderer.resize();
        me.cssRenderer.domElement.style.left = '0px';
        me.cssRenderer.domElement.style.top = '0px';

        me.camera.aspect = width / height;
        me.camera.updateProjectionMatrix();
    }
}