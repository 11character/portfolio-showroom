import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as StaticVariable from '../common/staticVariable';
import MouseRaycaster from '../common/mouseRaycaster';
import AssetItem from '../common/assetItem';
import ItemLoader from '../common/itemLoader';
import CssRenderer from '../common/cssRenderer';
import AssetItemManager from '../common/assetItemManager';
import Options from './options';
import Utils from '../../class/utils';

const Promise = window.Promise;

export default class NemoShowroomEditor {
    constructor (obj = {}) {
        const me  = this;

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
        me.objectField = new THREE.Group();
        me.objectField.name = StaticVariable.ITEM_OBJECT_FIELD_NAME;

        // ---
        me.obControls = new OrbitControls(me.camera, me.renderer.domElement);
        me.obControls.enableKeys = false;
        me.obControls.minPolarAngle = StaticVariable.CONTROLS_MIN_POLAR_ANGLE;
        me.obControls.maxPolarAngle = StaticVariable.CONTROLS_MAX_POLAR_ANGLE;

        // ---
        me.mouseRaycaster = new MouseRaycaster(me.renderer, me.camera);

        // ---
        me.clock = new THREE.Clock();

        // ---
        me.scene.add(me.camera);
        me.scene.add(me.light);
        me.scene.add(me.objectField);

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

        me.assetItem = null;

        //--
        me.start();
        me.__initEvent();
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
     * json을 읽어 저장된 값을 불러온다.
     * @param {String} json
     */
    openJson(json) {
        const me = this;

        const data = JSON.parse(json);
        const assetItem = new AssetItem(data);

        return me.itemLoader.load(assetItem).then(function (currentItem) {
            // 불러오는 중에 destroy() 호출시 오류 방지.
            if (me.options) {
                me.objectField.add(currentItem.object3D);
                me.cssRenderer.add(currentItem);
                me.assetItemManager.add(currentItem);

                currentItem.animationPlay();

                me.assetItem = currentItem;
            }

            return Promise.resolve(currentItem);
        });
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
            me.cssRenderer.add(currentItem);
            me.assetItemManager.add(currentItem);

            currentItem.animationPlay();

            me.assetItem = currentItem;

            return Promise.resolve(currentItem);
        });
    }

    /**
     * 에디터에 표시된 내용을 JSON형태로 출력한다.
     */
    exportJson() {
        const me = this;

        return JSON.stringify(me.assetItem || {});
    }

    /**
     * 2D 객체 sprite 전환, 해제
     */
    switchingSpriteMode () {
        const me = this;

        const prevItem = me.assetItem;
        const type = 'html,image,youtube';

        if (prevItem && type.indexOf(prevItem.type) >= 0) {
            const cloneItem = prevItem.clone();

            cloneItem.rotation.x = 0;
            cloneItem.rotation.y = 0;
            cloneItem.rotation.z = 0;
            cloneItem.isSprite = !cloneItem.isSprite;

            me.import(cloneItem);
        }
    }

     /**
     * 대상을 클릭했을 때 이동할 경로를 입력한다.
     * @param {string} link 이동할 경로.
     */
    setLink(link) {
        const me = this;

        const assetItem = me.assetItem;

        if (assetItem) {
            assetItem.link = link;
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

    /**
     * 객체를 비운다.
     */
    destroy() {
        const me = this;

        if (me.rootEl.parentElement) {
            me.rootEl.parentElement.removeChild(me.rootEl);
        }

        me.stop();

        me.scene.remove.apply(me.scene, me.scene.children);

        setTimeout(function () {

            for (let key in me) {
                if (me.hasOwnProperty(key)) {
                    delete me[key];
                }
            }
        }, 1);
    }

    __initEvent() {
        const me = this;

        // 컨트롤러 이벤트 설정.
        setTimeout(function () {
            me.obControls.saveState();

            me.obControls.domElement.addEventListener('mouseout', function () {
                me.disableViewController();
            });

            me.obControls.domElement.addEventListener('mouseenter', function () {
                me.enableViewController();
            });
        }, 100);
    }
}