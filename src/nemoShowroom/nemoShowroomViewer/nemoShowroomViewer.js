import * as THREE from 'three/build/three.module';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

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
        const me = this;

        me.options = new Options(obj);

        const winW = me.options.width;
        const winH = me.options.height;
        const pixelRatio = window.devicePixelRatio;

        // ---
        me.itemLoader = new ItemLoader();

        // ---
        me.rootEl = Utils.createDivElement();
        me.rootEl.tabIndex = 1;
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
        me.subLight = new THREE.AmbientLight();
        me.subLight.intensity = StaticVariable.SUB_LIGHT_INTENSITY;
        me.lightField.add(me.subLight);

        // ---
        me.camera = new THREE.PerspectiveCamera(45, winW / winH, StaticVariable.CAMERA_NEAR, StaticVariable.CAMERA_FAR);
        me.camera.position.setY(StaticVariable.CONTROLS_RAY_FAR);
        me.camera.target = new THREE.Vector3();
        me.cameraLon = 0;
        me.cameraLat = 0;

        // ---
        me.moveInfo = {
            moveForward: false,
            moveLeft: false,
            moveBackward: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            velocity: new THREE.Vector3(),
            direction: new THREE.Vector3(),
            speed: 50
        };

        // ---
        me.renderer = new THREE.WebGLRenderer({antialias: false, alpha: true, logarithmicDepthBuffer: true});
        me.renderer.setPixelRatio(pixelRatio);
        me.renderer.setSize(winW, winH);
        me.renderer.domElement.style.position = 'absolute';
        me.renderer.domElement.style.left = '0px';
        me.renderer.domElement.style.top = '0px';

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
        const floorGeo = new THREE.BoxBufferGeometry(2000, 0.1, 2000);
        const floorMat = new THREE.MeshPhongMaterial({color: StaticVariable.FLOOR_COLOR});
        me.baseFloor = new THREE.Mesh(floorGeo, floorMat);

        // ---
        me.scene.add(me.camera);
        me.scene.add(me.lightField);
        me.scene.add(me.objectField);
        me.scene.add(me.baseFloor);

        // --- 후처리. 화면에 보여지는 결과.
        // 테두리 표시, 안티얼라이어싱.
        me.composer = new EffectComposer(me.renderer);

        me.renderPass = new RenderPass(me.scene, me.camera);

        me.outlinePass = new OutlinePass( new THREE.Vector2(winW, winH), me.scene, me.camera);
        me.outlinePass.edgeStrength = 10;

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
        me.checkBoxArr = [];
        me.checkItemArr = [];
        me.outlineObjArr = [];
        me.intersectedItem = null;

        // ---
        me.start();
        me.__initEvent();
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

            const delta = me.clock.getDelta();

            me.assetItemManager.animationUpdate(delta);

            me.__move(delta);

            me.composer.render();

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

        let promise = Promise.resolve();

        // 모델 정보.
        const arr = data.itemArray;

        if (Array.isArray(arr) && arr.length) {
            me.setLightIntensity(data.lightIntensity);
            me.setLightHorizontalAngle(data.lightHorizontalAngle);

            const promiseArr = [];
            const totalCount = arr.length;

            let count = 0;
            let assetItem = null;

            // 시작값.
            me.options.onLoadProgress(count, totalCount, assetItem);

            for (let i = 0; i < arr.length; i++) {
                assetItem = new AssetItem(arr[i]);

                promiseArr.push(me.itemLoader.load(assetItem).then(function (assetItem) {
                    count++

                    // 불러오는 중에 destroy() 호출시 오류 방지.
                    if (me.options) {
                        me.options.onLoadProgress(count, totalCount, assetItem);
                    }

                    return Promise.resolve(assetItem);
                }));
            }

            promise = Promise.all(promiseArr).then(function (itemArr) {
                // 불러오는 중에 destroy() 호출시 오류 방지.
                if (me.options) {
                    let assetItem;

                    // 배치.
                    for (let i = 0; i < itemArr.length; i++) {
                        assetItem = itemArr[i];

                        // 조명 도형 제거.
                        if (assetItem.isLight) {
                            assetItem.object3D.children[0].remove(assetItem.object3D.children[0].getObjectByName(StaticVariable.MESH_NAME_LIGHT_CONE));
                        }

                        // 시작위치 지정, 도형 제거.
                        if (assetItem.isStartPoint) {
                            assetItem.object3D.children[0].remove.apply(assetItem.object3D.children[0], assetItem.object3D.children[0].children);

                            me.camera.position.copy(assetItem.object3D.position);
                            me.camera.position.y += StaticVariable.CONTROLS_RAY_FAR;

                            me.camera.rotation.set(0, assetItem.object3D.rotation.y, 0);

                            me.cameraLon = Utils.r2d(me.camera.rotation.y * -1);
                            me.cameraLat = Utils.r2d(me.camera.rotation.x * -1);
                        }

                        // 보이지 않는 도형 숨김.
                        if (assetItem.isTransparent) {
                            assetItem.setOpacity(0);
                        }

                        me.objectField.add(assetItem.object3D);
                        me.cssRenderer.add(assetItem);
                        me.assetItemManager.add(assetItem);

                        assetItem.animationPlay();
                    }

                    // cssRenderer에 배치되어 크기를 구할 수 있도록 대기.
                    setTimeout(function () {
                        me.checkBoxArr = [];
                        me.checkItemArr = [];
                        me.outlineObjArr = [];

                        for (let i = 0; i < itemArr.length; i++) {
                            assetItem = itemArr[i];

                            // 충돌박스 생성.
                            if (assetItem.isCollider) {
                                // 두 배열의 순서 일치.
                                me.checkBoxArr.push(assetItem.getBox3());
                                me.checkItemArr.push(assetItem);
                            }

                            // 클릭대상.
                            if (assetItem.isClickTarget) {
                                me.outlineObjArr.push(assetItem.object3D);
                            }
                        }

                        me.options.onLoad(me);
                    }, 500);
                }
            });

        } else {
            me.options.onLoad(me);
        }

        return promise;
    }

    /**
     * 화면의 크기를 재설정 한다.
     * @param {integer} width 화면의 넓이.
     * @param {integer} height 화면의 높이.
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
     * 전역 조명 밝기 설정.
     * @param {float} intensity 밝기.
     */
    setLightIntensity(intensity) {
        const me = this;

        me.light.intensity = intensity;
    }

    /**
     * 전역 조명 위치 설정.
     * @param {float} rad Y축 라디안 각도.
     */
    setLightHorizontalAngle(rad) {
        const me = this;

        // 그룹 안의 조명의 위치가 배로 회전하기 때문에 반으로 줄인다. (이유 모름)
        me.lightField.rotation.set(0, rad / 2, 0);
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

    __cameraLookDir(camera) {
        const vector3 = new THREE.Vector3(0, 0, -1);

        vector3.applyEuler(camera.rotation, camera.rotation.order);

        return vector3;
    }

    __detectPlayerCollision() {
        const me = this;

        // 이동방향.
        const direction = me.moveInfo.direction.clone();
        // 바라보는 방향. (높이제거)
        const cameraDirection = me.__cameraLookDir(me.camera);
        cameraDirection.setY(0);

        // 전방을 기준으로 카메라가 바라보는 각도.
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), cameraDirection);

        // 카메라 방향 기준으로 이동하는 방향. (방향 오차를 줄이기 위해 normalize)
        direction.applyQuaternion(quaternion);
        direction.normalize();

        // 계산된 방향으로 선을 긋는다.
        const position = me.camera.position.clone();
        const ray = new THREE.Ray(position, direction);
        const originY = position.y;
        const vec3 = new THREE.Vector3();

        // 충돌검사.
        let check = false;

        for (let i = 0; i < me.checkBoxArr.length; i++) {
            // 중심 선.
            ray.origin.setY(originY);
            ray.intersectBox(me.checkBoxArr[i], vec3);

            if (vec3.lengthSq() && vec3.distanceTo(position) < StaticVariable.CONTROLS_RAY_FAR) {
                check = true;
                break;
            }

            // 위, 아래 이동이 아닌 경우.
            if (direction.y == 0) {
                // 상단 선.
                ray.origin.setY(originY + (StaticVariable.CONTROLS_RAY_FAR * 0.75));
                ray.intersectBox(me.checkBoxArr[i], vec3);

                if (vec3.lengthSq() && vec3.distanceTo(position) < StaticVariable.CONTROLS_RAY_FAR) {
                    check = true;
                    break;
                }

                // 하단 선.
                ray.origin.setY(originY - (StaticVariable.CONTROLS_RAY_FAR * 0.75));
                ray.intersectBox(me.checkBoxArr[i], vec3);

                if (vec3.lengthSq() && vec3.distanceTo(position) < StaticVariable.CONTROLS_RAY_FAR) {
                    check = true;
                    break;
                }
            }
        }

        return check;
    }

    __move(delta) {
        const me = this;

        // 이동.
        const mInfo = me.moveInfo;
        const velocity = mInfo.velocity;
        const direction = mInfo.direction;
        const speed = mInfo.speed;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= velocity.y * 10.0 * delta;

        // 방향 오른손 좌표.
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

            // x축.
            let distance = -velocity.x * delta;
            vector3.setFromMatrixColumn(me.camera.matrix, 0);
            me.camera.position.addScaledVector(vector3, distance);

            // z축.
            distance = velocity.z * delta;
            vector3.setFromMatrixColumn(me.camera.matrix, 0);
            vector3.crossVectors(me.camera.up, vector3);
            me.camera.position.addScaledVector(vector3, distance);

            // y축.
            me.camera.position.y -= (velocity.y * delta);

            if (me.camera.position.y < StaticVariable.CONTROLS_RAY_FAR) {
                velocity.y = 0;
                me.camera.position.y = StaticVariable.CONTROLS_RAY_FAR;
            }
        }
    }

    __intersect(evt) {
        const me = this;

        const intersectChild = me.mouseRaycaster.intersect(me.outlineObjArr, evt.offsetX, evt.offsetY);

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

        let isUserInteracting = false;
        let onMouseDownMouseX = 0;
        let onMouseDownMouseY = 0;
        let onMouseDownLon = 0;
        let onMouseDownLat = 0;
        let pointerStartTimeout;

        function onPointerStart(evt) {
            evt.stopPropagation();

            isUserInteracting = true;

            const clientX = evt.clientX || evt.touches[0].clientX;
            const clientY = evt.clientY || evt.touches[0].clientY;

            onMouseDownMouseX = clientX;
            onMouseDownMouseY = clientY;

            onMouseDownLon = me.cameraLon;
            onMouseDownLat = me.cameraLat;

            pointerStartTimeout = setTimeout(function () {
                switch(evt.button) {
                    case 0:
                        me.options.onClick(me.intersectedItem);
                        break;
                }
            }, 100);
        }

        function onPointerMove(evt) {
            evt.stopPropagation();

            clearTimeout(pointerStartTimeout);

            // 테두리 표시.
            me.intersectedItem = me.__intersect(evt);
            me.outlinePass.selectedObjects = me.intersectedItem ? [me.intersectedItem.object3D] : [];

            // 화면 회전.
            if (isUserInteracting) {
                const clientX = evt.clientX || evt.touches[0].clientX;
                const clientY = evt.clientY || evt.touches[0].clientY;

                me.cameraLon = (onMouseDownMouseX - clientX) * 0.05 + onMouseDownLon;
                me.cameraLat = (clientY - onMouseDownMouseY) * 0.05 + onMouseDownLat;

                me.cameraLat = Math.max(-85, Math.min(85, me.cameraLat));

                const theta = Utils.d2r(me.cameraLon - 90);
                const phi = Utils.d2r(90 - me.cameraLat);

                me.camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
                me.camera.target.y = 500 * Math.cos(phi);
                me.camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
                me.camera.lookAt(me.camera.target);
            }
        }

        function onPointerUp(evt) {
            evt.stopPropagation();

            isUserInteracting = false;
        }

        me.rootEl.addEventListener('mousedown', onPointerStart);
        me.rootEl.addEventListener('mousemove', onPointerMove);
        me.rootEl.addEventListener('mouseup', onPointerUp);

        me.rootEl.addEventListener('touchstart', onPointerStart);
        me.rootEl.addEventListener('touchmove', onPointerMove);
        me.rootEl.addEventListener('touchend', onPointerUp);

        me.rootEl.addEventListener('mouseleave', onPointerUp);

        me.rootEl.addEventListener('keydown', function (evt) {
            switch (evt.keyCode) {
                // w
                case 87:
                    me.moveInfo.moveForward = true;
                    break;

                // a
                case 65:
                    me.moveInfo.moveLeft = true;
                    break;

                // s
                case 83:
                    me.moveInfo.moveBackward = true;
                    break;

                // d
                case 68:
                    me.moveInfo.moveRight = true;
                    break;

                // r
                case 82:
                    me.moveInfo.moveUp = true;
                    break;

                // f
                case 70:
                    me.moveInfo.moveDown = true;
                    break;
            }
        });

        me.rootEl.addEventListener('keyup', function (evt) {
            switch (evt.keyCode) {
                // w
                case 87:
                    me.moveInfo.moveForward = false;
                    break;

                // a
                case 65:
                    me.moveInfo.moveLeft = false;
                    break;

                // s
                case 83:
                    me.moveInfo.moveBackward = false;
                    break;

                // d
                case 68:
                    me.moveInfo.moveRight = false;
                    break;

                // r
                case 82:
                    me.moveInfo.moveUp = false;
                    break;

                // f
                case 70:
                    me.moveInfo.moveDown = false;
                    break;
            }
        });
    }
}