import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as StaticVariable from '../common/staticVariable';
import AssetItem from '../common/assetItem';
import ItemLoader from '../common/itemLoader';
import CssRenderer from '../common/cssRenderer';
import AssetItemManager from '../common/assetItemManager';
import Options from './options';
import Utils from '../../class/utils';

import EditorInterface from '../common/editorInterface';

const Promise = window.Promise;

export default class NemoShowroomEditor extends EditorInterface {
    constructor (obj = {}) {
        super();

        const me  = this;

        me.options = new Options(obj);

        const winW = me.options.width;
        const winH = me.options.height;

        // ---
        me.itemLoader = new ItemLoader();

        // ---
        me.rootEl = Utils.createDivElement();
        me.rootEl.style.backgroundColor = StaticVariable.STYLE_ASSET_EDIT_BACKGROUND_COLOR;

        // ---
        me.scene = new THREE.Scene();

        // ---
        me.lightField = new THREE.Group();

        // ---
        me.light = new THREE.DirectionalLight();
        me.light.position.copy(StaticVariable.LIGHT_ZERO_POSITION);
        me.lightField.add(me.light);

        // ---
        me.subLight = new THREE.AmbientLight();
        me.subLight.intensity = StaticVariable.SUB_LIGHT_INTENSITY;
        me.lightField.add(me.subLight);

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
        me.clock = new THREE.Clock();

        // ---
        me.scene.add(me.camera);
        me.scene.add(me.lightField);
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

        me.removeAll();

        const data = JSON.parse(json);
        const arr = data.itemArray;

        let promise = Promise.resolve();

        if (arr && arr.length) {
            me.setLightIntensity(data.lightIntensity);
            me.setLightHorizontalAngle(data.lightHorizontalAngle);

            const assetItem = new AssetItem(arr[0]);

            promise = me.itemLoader.load(assetItem).then(function (currentItem) {
                // ???????????? ?????? destroy() ????????? ?????? ??????.
                if (me.options) {
                    me.objectField.add(currentItem.object3D);
                    me.cssRenderer.add(currentItem);
                    me.assetItemManager.add(currentItem);

                    currentItem.animationPlay();

                    me.assetItem = currentItem;
                }

                me.viewTarget(currentItem);

                me.options.onLoad(currentItem);

                return Promise.resolve(currentItem);
            });
        }

        return promise;
    }

    /**
     * ????????? 3D????????? ?????????.
     * @param {AssetItem || object} obj ????????? ????????? 3D?????? ??????.
     */
    openItem(obj) {
        const me = this;

        me.removeAll();

        const assetItem = new AssetItem(obj);

        return me.itemLoader.load(assetItem).then(function (currentItem) {
            me.objectField.add(currentItem.object3D);
            me.cssRenderer.add(currentItem);
            me.assetItemManager.add(currentItem);

            currentItem.animationPlay();

            me.assetItem = currentItem;

            me.viewTarget(currentItem);

            me.options.onLoad(currentItem);

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
            itemArray: []
        };

        if (me.assetItem) {
            obj.itemArray = [me.assetItem];
        }

        return JSON.stringify(obj);
    }

    /**
     * ????????? ?????? ????????? ?????????.
     */
    removeAll() {
        const me = this;

        me.objectField.remove.apply(me.objectField, me.objectField.children);
    }

    /**
     * 2D ?????? sprite ??????, ??????.
     */
    switchingSpriteMode () {
        const me = this;

        const prevItem = me.assetItem;

        if (prevItem && StaticVariable.ITEM_2D_TYPES.indexOf(prevItem.type) >= 0) {
            const cloneItem = prevItem.clone();

            cloneItem.rotation.x = 0;
            cloneItem.rotation.y = 0;
            cloneItem.rotation.z = 0;
            cloneItem.isSprite = !cloneItem.isSprite;

            me.import(cloneItem);
        }
    }

     /**
     * ????????? ???????????? ??? ????????? ????????? ????????????.
     * @param {string} link ????????? ??????.
     */
    setLink(link) {
        const me = this;

        const assetItem = me.assetItem;

        if (assetItem) {
            assetItem.link = link;
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
     * ????????? ????????? ????????? ??????????????? ?????????.
     * @param {AssetItem} assetItem ????????? ????????? ??????.
     */
    viewTarget(assetItem) {
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

    __initEvent() {
        const me = this;

        // ???????????? ????????? ??????.
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