import * as THREE from 'three/build/three.module';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';

import * as StaticVariable from '../common/staticVariable';
import MouseRaycaster from '../common/mouseRaycaster';
import AssetItem from '../common/assetItem';
import ItemLoader from '../common/itemLoader';
import CssRenderer from '../common/cssRenderer';
import AssetItemManager from '../common/assetItemManager';
import Options from './options';
import MoveInfo from './moveInfo';
import Utils from '../../class/utils';

const Promise = window.Promise;

export default class NemoShowroomViewer {
    constructor (obj = {}) {
        const me = this;

        RectAreaLightUniformsLib.init();

        me.options = new Options(obj);

        const winW = me.options.width;
        const winH = me.options.height;
        const pixelRatio = window.devicePixelRatio;

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
        me.light.position.copy(StaticVariable.LIGHT_ZERO_POSITION);
        me.lightField.add(me.light);

        // ---
        me.camera = new THREE.PerspectiveCamera(45, winW / winH, StaticVariable.CAMERA_NEAR, StaticVariable.CAMERA_FAR);
        me.camera.position.setY(StaticVariable.CONTROLS_RAY_FAR);
        me.camera.target = new THREE.Vector3();
        me.cameraLon = 0;
        me.cameraLat = 0;

        // ---
        me.moveInfo = new MoveInfo();

        // ---
        me.renderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
        me.renderer.setPixelRatio(pixelRatio);
        me.renderer.setSize(winW, winH);
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
        me.mouseRaycaster = new MouseRaycaster(me.renderer, me.camera);

        // ---
        me.clock = new THREE.Clock();

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
        me.scene.add(me.baseFloor);

        // --- ?????????. ????????? ???????????? ??????.
        // ????????? ??????, ?????????????????????.
        me.composer = new EffectComposer(me.renderer);

        me.renderPass = new RenderPass(me.scene, me.camera);

        me.outlinePass = new OutlinePass( new THREE.Vector2(winW, winH), me.scene, me.camera);
        me.outlinePass.edgeStrength = 2;
        me.outlinePass.edgeThickness = 3;
        me.outlinePass.edgeGlow = 1;
        me.outlinePass.visibleEdgeColor = new THREE.Color(0xffffff);
        me.outlinePass.hiddenEdgeColor = new THREE.Color(0xffffff);

        me.fxaaPass = new ShaderPass(FXAAShader);
        me.fxaaPass.material.uniforms['resolution'].value.x = 1 / (winW * pixelRatio);
        me.fxaaPass.material.uniforms['resolution'].value.y = 1 / (winH * pixelRatio);

        me.composer.addPass(me.renderPass);
        me.composer.addPass(me.outlinePass);
        me.composer.addPass(me.fxaaPass);

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
        me.colliderMeshArr = [];
        me.outlineMeshArr = [];
        me.selectedItem = null;

        // ---
        me.__initEvent();
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

            const delta = me.clock.getDelta();

            me.assetItemManager.animationUpdate(delta);

            me.__move(delta);

            me.composer.render();

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

    __afterLoading(itemArr, isFirst) {
        const me = this;

        // ???????????? ?????? destroy() ????????? ?????? ??????.
        if (me.options) {
            // ??????.
            for (let i = 0; i < itemArr.length; i++) {
                const assetItem = itemArr[i];

                // ?????? ?????? ??????.
                if (assetItem.isLight) {
                    const lightObj3D = assetItem.object3D.children[0];
                    const removeArr = [];

                    lightObj3D.traverse(function (obj) {
                        if (obj.name == StaticVariable.MESH_NAME_LIGHT_HELPER
                            || obj.name == StaticVariable.MESH_NAME_LIGHT_CONE)// ?????? ?????? ?????????.
                        {
                            removeArr.push(obj);
                        }
                    });

                    for (let i = 0; i < removeArr.length; i++) {
                        removeArr[i].parent.remove(removeArr[i]);
                    }
                }

                // ???????????? ??????, ?????? ??????.
                if (assetItem.isStartPoint) {
                    assetItem.object3D.children[0].remove.apply(assetItem.object3D.children[0], assetItem.object3D.children[0].children);

                    me.camera.position.copy(assetItem.object3D.position);
                    me.camera.position.y += StaticVariable.CONTROLS_RAY_FAR;

                    me.camera.rotation.set(0, assetItem.object3D.rotation.y, 0);

                    me.cameraLon = Utils.r2d(me.camera.rotation.y * -1);
                    me.cameraLat = Utils.r2d(me.camera.rotation.x * -1);
                }

                // ????????? ?????? ?????? ??????.
                if (assetItem.isTransparent) {
                    assetItem.setOpacity(0);
                }

                me.objectField.add(assetItem.object3D);

                me.assetItemManager.add(assetItem);

                me.cssRenderer.add(assetItem).then(function () {
                    // iframe??? ???????????? ?????? ????????? ????????? ????????? ???????????? ?????? ???????????? ???????????? ????????? ??????.
                    // ?????? ???????????? ?????? ???????????? ????????????.
                    const iframeElArr = me.rootEl.getElementsByTagName('iframe');

                    for (let i = 0; i < iframeElArr.length; i++) {
                        iframeElArr[i].addEventListener('load', function () {
                            window.focus();
                        });
                    }
                });

                assetItem.animationPlay();
            }

            // cssRenderer??? ???????????? ????????? ?????? ??? ????????? ??????.
            setTimeout(function () {
                if (isFirst) {
                    me.colliderMeshArr = [];
                    me.outlineMeshArr = [];
                }

                for (let i = 0; i < itemArr.length; i++) {
                    const assetItem = itemArr[i];

                    assetItem.object3D.traverse(function (obj) {
                        if (obj.isMesh) {
                            // ???????????? ??????.
                            if (assetItem.isCollider) {
                                me.colliderMeshArr.push(obj);
                            }

                            // ????????????.
                            if (assetItem.isClickTarget) {
                                me.outlineMeshArr.push(obj);
                            }
                        }
                    });
                }

                me.options.onLoad(me);
            }, 500);
        }
    }

    /**
     * json??? ?????? ????????? ?????? ????????????.
     * @param {String} json
     */
    openJson(json) {
        const me = this;

        const data = JSON.parse(json);

        let promise = Promise.resolve();

        // ?????? ??????.
        const arr = data.itemArray;

        if (Array.isArray(arr) && arr.length) {
            me.setLightIntensity(data.lightIntensity);
            me.setLightHorizontalAngle(data.lightHorizontalAngle);

            const promiseArr = [];
            const totalCount = arr.length;

            let count = 0;
            let assetItem = null;

            const loadingArr0 = [];
            const loadingArr1 = [];

            // ?????? ?????? ??????.
            for (let i = 0; i < arr.length; i++) {
                assetItem = new AssetItem(arr[i]);
                // ?????? ????????? ????????? 0??? ?????? ?????? ???????????? ??????.
                if (!assetItem.backgroundLoading) {
                    loadingArr0.push(assetItem);

                } else {
                    loadingArr1.push(assetItem);
                }
            }

            // ?????? ?????? ??????. (????????? onLoad ????????? ??????)
            me.options.onLoadProgress(count, totalCount, assetItem);

            for (let i = 0; i < loadingArr0.length; i++) {
                assetItem = loadingArr0[i];

                promiseArr.push(me.itemLoader.load(assetItem).then(function (assetItem) {
                    count++

                    // ???????????? ?????? destroy() ????????? ?????? ??????.
                    if (me.options) {
                        me.options.onLoadProgress(count, totalCount, assetItem);
                    }

                    return Promise.resolve(assetItem);
                }));
            }

            promise = Promise.all(promiseArr).then(function (itemArr) {
                (me.__afterLoading.bind(me))(itemArr, true);

                //?????? ?????? ????????? ??????.
                for (let i = 0; i < loadingArr1.length; i++) {
                    me.itemLoader.load(loadingArr1[i]).then(function (item) {
                        (me.__afterLoading.bind(me))([item], false);
                    });
                }

                return Promise.resolve(itemArr);
            });

        } else {
            me.options.onLoad(me);
        }

        return promise;
    }

    /**
     * ????????? ????????? ????????? ??????.
     * @param {integer} width ????????? ??????.
     * @param {integer} height ????????? ??????.
     */
    resize(width = 800, height = 600) {
        const me = this;

        const pixelRatio = window.devicePixelRatio;

        me.rootEl.style.width = width + 'px';
        me.rootEl.style.height = height + 'px';

        me.renderer.setPixelRatio(pixelRatio);
        me.renderer.setSize(width, height);

        me.composer.setSize(width, height);

        me.fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
        me.fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);

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

        window.removeEventListener(me.__onKeydown);
        window.removeEventListener(me.__onKeyup);

        setTimeout(function () {

            for (let key in me) {
                if (me.hasOwnProperty(key)) {
                    delete me[key];
                }
            }
        }, 1);
    }

    moveForwardSwitch(bool) {
        const me = this;

        me.moveInfo.moveBackward = false;
        me.moveInfo.moveForward = bool;
    }

    moveBackwardSwitch(bool) {
        const me = this;

        me.moveInfo.moveForward = false;
        me.moveInfo.moveBackward = bool;
    }

    moveLeftSwitch(bool) {
        const me = this;

        me.moveInfo.moveRight = false;
        me.moveInfo.moveLeft = bool;
    }

    moveRightSwitch(bool) {
        const me = this;

        me.moveInfo.moveLeft = false;
        me.moveInfo.moveRight = bool;
    }

    moveUpSwitch(bool) {
        const me = this;

        me.moveInfo.moveDown = false;
        me.moveInfo.moveUp = bool;
    }

    moveDownSwitch(bool) {
        const me = this;

        me.moveInfo.moveUp = false;
        me.moveInfo.moveDown = bool;
    }

    moveStop() {
        const me = this;

        me.moveInfo.offDirection();
    }

    centerFocus(bool) {
        const me = this;

        me.options.centerFocus = bool;
    }

    __cameraLookDir(camera) {
        const vector3 = new THREE.Vector3(0, 0, -1);

        vector3.applyEuler(camera.rotation, camera.rotation.order);

        return vector3;
    }

    __detectPlayerCollision() {
        const me = this;

        // ????????????.
        const direction = me.moveInfo.direction.clone();
        // ???????????? ??????. (????????????)
        const cameraDirection = me.__cameraLookDir(me.camera);
        cameraDirection.setY(0);

        // ????????? ???????????? ???????????? ???????????? ??????.
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), cameraDirection);

        // ????????? ?????? ???????????? ???????????? ??????. (?????? ????????? ????????? ?????? normalize)
        direction.applyQuaternion(quaternion);
        direction.normalize();

        // ????????? ???????????? ?????? ?????????.
        const position = me.camera.position.clone();
        const originY = position.y;

        const rayCaster = new THREE.Raycaster(position, direction, 0, StaticVariable.CONTROLS_RAY_FAR);

        let arr = rayCaster.intersectObjects(me.colliderMeshArr);

        // ????????????.
        let check = arr.length > 0;

        // ???, ?????? ????????? ?????? ?????? ????????? ?????? ????????? ??????.
        // if (direction.y == 0) {
        //     // ?????? ???.
        //     position.setY(originY + (StaticVariable.CONTROLS_RAY_FAR * 0.75));
        //     rayCaster.set(position, direction);
        //     arr = rayCaster.intersectObjects(me.colliderMeshArr);
        //     check = arr.length > 0;

        //     // ?????? ???.
        //     position.setY(originY - (StaticVariable.CONTROLS_RAY_FAR * 0.75))
        //     rayCaster.set(position, direction);
        //     arr = rayCaster.intersectObjects(me.colliderMeshArr);
        //     check = arr.length > 0;
        // }

        return check;
    }

    __move(delta) {
        const me = this;

        // ??????.
        const mInfo = me.moveInfo;
        const velocity = mInfo.velocity;
        const direction = mInfo.direction;
        const speed = mInfo.speed;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= velocity.y * 10.0 * delta;

        // ?????? ????????? ??????.
        direction.x = Number(mInfo.moveRight) - Number(mInfo.moveLeft);
        direction.z = Number(mInfo.moveBackward) - Number(mInfo.moveForward);
        direction.y = Number(mInfo.moveUp) - Number(mInfo.moveDown);
        direction.normalize();

        if (!me.__detectPlayerCollision()) {
            if (mInfo.moveRight || mInfo.moveLeft) {
                velocity.x -= direction.x * speed * delta;
            }

            if (mInfo.moveForward || mInfo.moveBackward) {
                velocity.z -= direction.z * speed * delta;
            }

            if (mInfo.moveUp || mInfo.moveDown) {
                velocity.y -= direction.y * speed * delta;
            }

            let vector3 = new THREE.Vector3();

            // x???.
            let distance = -velocity.x * delta;
            vector3.setFromMatrixColumn(me.camera.matrix, 0);
            me.camera.position.addScaledVector(vector3, distance);

            // z???.
            distance = velocity.z * delta;
            vector3.setFromMatrixColumn(me.camera.matrix, 0);
            vector3.crossVectors(me.camera.up, vector3);
            me.camera.position.addScaledVector(vector3, distance);

            // y???.
            me.camera.position.y -= (velocity.y * delta);

            if (me.camera.position.y < StaticVariable.CONTROLS_RAY_FAR) {
                velocity.y = 0;
                me.camera.position.y = StaticVariable.CONTROLS_RAY_FAR;
            }
        }
    }

    __intersect(evt) {
        const me = this;

        const intersectChild = me.mouseRaycaster.intersect(me.outlineMeshArr, evt);

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

    __intersectXY(x, y) {
        const me = this;

        const intersectChild = me.mouseRaycaster.intersectXY(me.outlineMeshArr, x, y);

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

    __onKeydown(evt) {
        const me = this;

        if (me.isRun) {
            const key = evt.key.toLowerCase();

            switch (key) {
                // w
                case '???':
                case 'w':
                case 'arrowup':
                    me.moveInfo.moveForward = true;
                    break;

                // a
                case '???':
                case 'a':
                case 'arrowleft':
                    me.moveInfo.moveLeft = true;
                    break;

                // s
                case '???':
                case 's':
                case 'arrowdown':
                    me.moveInfo.moveBackward = true;
                    break;

                // d
                case '???':
                case 'd':
                case 'arrowright':
                    me.moveInfo.moveRight = true;
                    break;

                // r
                case '???':
                case 'r':
                    me.moveInfo.moveUp = true;
                    break;

                // f
                case '???':
                case 'f':
                    me.moveInfo.moveDown = true;
                    break;
            }
        }
    }

    __onKeyup(evt) {
        const me =  this;

        const key = evt.key.toLowerCase();

        if (me.isRun) {
            switch (key) {
                // w
                case '???':
                case 'w':
                case 'arrowup':
                    me.moveInfo.moveForward = false;
                    break;

                // a
                case '???':
                case 'a':
                case 'arrowleft':
                    me.moveInfo.moveLeft = false;
                    break;

                // s
                case '???':
                case 's':
                case 'arrowdown':
                    me.moveInfo.moveBackward = false;
                    break;

                // d
                case '???':
                case 'd':
                case 'arrowright':
                    me.moveInfo.moveRight = false;
                    break;

                // r
                case '???':
                case 'r':
                    me.moveInfo.moveUp = false;
                    break;

                // f
                case '???':
                case 'f':
                    me.moveInfo.moveDown = false;
                    break;
            }
        }
    }

    __onKeyupAll() {
        const me = this;

        me.moveInfo.moveForward = false;
        me.moveInfo.moveLeft = false;
        me.moveInfo.moveBackward = false;
        me.moveInfo.moveRight = false;
        me.moveInfo.moveUp = false;
        me.moveInfo.moveDown = false;
    }

    __initEvent() {
        const me = this;

        let isUserInteracting = false;
        let pointerDownMouseX = 0;
        let pointerDownMouseY = 0;
        let pointerDownLon = 0;
        let pointerDownLat = 0;
        let mouseFocusTimeout;
        let centerFocusTimeout;

        function onPointerDown(evt) {
            isUserInteracting = true;

            const pointerXY = me.mouseRaycaster.getPointerXY(evt);
            const x = pointerXY.x;
            const y = pointerXY.y;

            pointerDownMouseX = x;
            pointerDownMouseY = y;

            pointerDownLon = me.cameraLon;
            pointerDownLat = me.cameraLat;

            if (!me.moveInfo.isMove) {
                switch(evt.button) {
                    case 0:
                        // ????????? ??????.
                        me.selectedItem = me.__intersect(evt);
                        me.outlinePass.selectedObjects = me.selectedItem ? [me.selectedItem.object3D] : [];
                        me.options.onClick(me.selectedItem);
                        break;
                }
            }
        }

        function onPointerMove(evt) {
            // ?????? ??????.
            if (isUserInteracting) {
                const pointerXY = me.mouseRaycaster.getPointerXY(evt);
                const x = pointerXY.x;
                const y = pointerXY.y;

                me.cameraLon = (pointerDownMouseX - x) * 0.05 + pointerDownLon;
                me.cameraLat = (y - pointerDownMouseY) * 0.05 + pointerDownLat;

                me.cameraLat = Math.max(-85, Math.min(85, me.cameraLat));

                const theta = Utils.d2r(me.cameraLon - 90);
                const phi = Utils.d2r(90 - me.cameraLat);

                me.camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
                me.camera.target.y = 500 * Math.cos(phi);
                me.camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
                me.camera.lookAt(me.camera.target);

                // ????????? ???????????? ??????, ?????? ????????? ???????????? ????????? ?????? ????????? ??????.
                if (!me.moveInfo.isMove && !me.selectedItem && me.options.centerFocus) {
                    clearTimeout(centerFocusTimeout);

                    centerFocusTimeout = setTimeout(function () {
                        const centerX = (me.rootEl.clientWidth / 2) * window.devicePixelRatio;
                        const centerY = (me.rootEl.clientHeight / 2) * window.devicePixelRatio;
                        const intersectedItem = me.__intersectXY(centerX, centerY);

                        me.outlinePass.selectedObjects = intersectedItem ? [intersectedItem.object3D] : [];
                    }, 50);
                }

                me.options.onMoveCamera();

            // ????????? ???????????? ??????, ???????????? ???????????? ?????? ??????.
            } else if (!me.moveInfo.isMove && !me.selectedItem && !me.options.centerFocus) {
                clearTimeout(mouseFocusTimeout);

                mouseFocusTimeout = setTimeout(function () {
                    const intersectedItem = me.__intersect(evt);

                    me.outlinePass.selectedObjects = intersectedItem ? [intersectedItem.object3D] : [];
                }, 10);
            }
        }

        function onPointerUp() {
            isUserInteracting = false;
        }

        me.rootEl.addEventListener('mousedown', onPointerDown);
        me.rootEl.addEventListener('mousemove', onPointerMove);
        me.rootEl.addEventListener('mouseup', onPointerUp);

        me.rootEl.addEventListener('touchstart', onPointerDown);
        me.rootEl.addEventListener('touchmove', onPointerMove);
        me.rootEl.addEventListener('touchend', onPointerUp);

        me.rootEl.addEventListener('mouseleave', onPointerUp);

        window.addEventListener('keydown', function (evt) {
            me.__onKeydown.call(me, evt);
        });

        window.addEventListener('keyup', function (evt) {
            me.__onKeyup.call(me, evt);
        });

        window.addEventListener('blur', function () {
            me.__onKeyupAll.call(me);
        });

        if (me.options.autoStart) {
            me.start();
        }
    }
}