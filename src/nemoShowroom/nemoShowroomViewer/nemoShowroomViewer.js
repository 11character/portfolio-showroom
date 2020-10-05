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
import MoveInfo from './moveInfo';
import Utils from '../../class/utils';

const Promise = window.Promise;

export default class NemoShowroomViewer {
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
        me.moveInfo = new MoveInfo();

        // ---
        me.renderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
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
        const floorGeo = new THREE.PlaneBufferGeometry(StaticVariable.FLOOR_SIZE, StaticVariable.FLOOR_SIZE);
        const floorMat = new THREE.MeshPhongMaterial({color: StaticVariable.FLOOR_COLOR});
        me.baseFloor = new THREE.Mesh(floorGeo, floorMat);
        me.baseFloor.rotation.x = -(Math.PI / 2);
        me.baseFloor.renderOrder = 2;

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
        me.outlinePass.edgeStrength = 2;
        me.outlinePass.edgeThickness = 3;
        me.outlinePass.edgeGlow = 1;

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

    __afterLoading(itemArr, isFirst) {
        const me = this;

        // 불러오는 중에 destroy() 호출시 오류 방지.
        if (me.options) {
            // 배치.
            for (let i = 0; i < itemArr.length; i++) {
                const assetItem = itemArr[i];

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
                if (isFirst) {
                    me.colliderMeshArr = [];
                    me.outlineMeshArr = [];
                }

                for (let i = 0; i < itemArr.length; i++) {
                    const assetItem = itemArr[i];

                    assetItem.object3D.traverse(function (obj) {
                        if (obj.isMesh) {
                            // 충돌박스 생성.
                            if (assetItem.isCollider) {
                                me.colliderMeshArr.push(obj);
                            }

                            // 클릭대상.
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

            const loadingArr0 = [];
            const loadingArr1 = [];

            // 로드 순서 구분.
            for (let i = 0; i < arr.length; i++) {
                assetItem = new AssetItem(arr[i]);
                // 로드 순서가 없거나 0인 경우 선행 로딩으로 처리.
                if (!assetItem.backgroundLoading) {
                    loadingArr0.push(assetItem);

                } else {
                    loadingArr1.push(assetItem);
                }
            }

            // 선행 로딩 처리. (완료시 onLoad 이벤트 실행)
            me.options.onLoadProgress(count, totalCount, assetItem);

            for (let i = 0; i < loadingArr0.length; i++) {
                assetItem = loadingArr0[i];

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
                (me.__afterLoading.bind(me))(itemArr, true);

                //후속 로딩 비동기 실행.
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
        const originY = position.y;

        const rayCaster = new THREE.Raycaster(position, direction);

        let arr = rayCaster.intersectObjects(me.colliderMeshArr);
        
        // 충돌검사.
        let check = false;

        if (arr.length) {
            check = arr[0].distance < StaticVariable.CONTROLS_RAY_FAR;
        }

        // 위, 아래 이동이 아닌 경우 상단과 하단 부분도 측정.
        if (direction.y == 0) {
            // 상단 선.
            position.setY(originY + (StaticVariable.CONTROLS_RAY_FAR * 0.75));
            rayCaster.set(position, direction);
            arr = rayCaster.intersectObjects(me.colliderMeshArr);

            if (arr.length) {
                check = arr[0].distance < StaticVariable.CONTROLS_RAY_FAR;
            }

            // 하단 선.
            position.setY(originY - (StaticVariable.CONTROLS_RAY_FAR * 0.75))
            rayCaster.set(position, direction);
            arr = rayCaster.intersectObjects(me.colliderMeshArr);

            if (arr.length) {
                check = arr[0].distance < StaticVariable.CONTROLS_RAY_FAR;
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
                case 'w':
                case 'arrowup':
                    me.moveInfo.moveForward = true;
                    break;

                // a
                case 'a':
                case 'arrowleft':
                    me.moveInfo.moveLeft = true;
                    break;

                // s
                case 's':
                case 'arrowdown':
                    me.moveInfo.moveBackward = true;
                    break;

                // d
                case 'd':
                case 'arrowright':
                    me.moveInfo.moveRight = true;
                    break;

                // r
                case 'r':
                    me.moveInfo.moveUp = true;
                    break;

                // f
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
                case 'w':
                case 'arrowup':
                    me.moveInfo.moveForward = false;
                    break;

                // a
                case 'a':
                case 'arrowleft':
                    me.moveInfo.moveLeft = false;
                    break;

                // s
                case 's':
                case 'arrowdown':
                    me.moveInfo.moveBackward = false;
                    break;

                // d
                case 'd':
                case 'arrowright':
                    me.moveInfo.moveRight = false;
                    break;

                // r
                case 'r':
                    me.moveInfo.moveUp = false;
                    break;

                // f
                case 'f':
                    me.moveInfo.moveDown = false;
                    break;
            }
        }
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

            switch(evt.button) {
                case 0:
                    // 테두리 표시.
                    me.selectedItem = me.__intersect(evt);
                    me.outlinePass.selectedObjects = me.selectedItem ? [me.selectedItem.object3D] : [];
                    me.options.onClick(me.selectedItem);
                    break;
            }
        }

        function onPointerMove(evt) {
            // 화면 회전.
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

                // 선택된 아이템이 없고, 화면 가운데 포커스를 설정한 경우 테두리 표시.
                if (!me.selectedItem && me.options.centerFocus) {
                    clearTimeout(centerFocusTimeout);

                    centerFocusTimeout = setTimeout(function () {
                        const centerX = (me.rootEl.clientWidth / 2) * window.devicePixelRatio;
                        const centerY = (me.rootEl.clientHeight / 2) * window.devicePixelRatio;
                        const intersectedItem = me.__intersectXY(centerX, centerY);

                        me.outlinePass.selectedObjects = intersectedItem ? [intersectedItem.object3D] : [];
                    }, 50);
                }

                me.options.onMoveCamera();

            // 선택된 아이템이 없고, 마우스로 포커싱이 되는 경우.
            } else if (!me.selectedItem && !me.options.centerFocus) {
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

        if (me.options.autoStart) {
            me.start();
        }
    }
}