import * as THREE from 'three/build/three.module';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

import * as StaticVariable from '../common/staticVariable';
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

        // ---
        me.itemLoader = new ItemLoader();

        // ---
        me.rootEl = Utils.createDivElement();
        me.rootEl.tabIndex = 1;
        me.rootEl.style.backgroundColor = StaticVariable.STYLE_BACKGROUND_COLOR;

        // ---
        me.scene = new THREE.Scene();

        // ---
        me.light = new THREE.DirectionalLight();
        me.light.position.set(1, 1, 1);

        // ---
        me.camera = new THREE.PerspectiveCamera(45, winW / winH, StaticVariable.CAMERA_NEAR, StaticVariable.CAMERA_FAR);

        //--
        me.controls = new PointerLockControls(me.camera, me.rootEl);
        me.controls.getObject().position.setY(StaticVariable.CONTROLS_Y);

        // --
        me.moveInfo = {
            moveForward: false,
            moveLeft: false,
            moveBackward: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            velocity: new THREE.Vector3(),
            direction: new THREE.Vector3(),
            speed: 100.0
        };

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
        me.clock = new THREE.Clock();

        // ---
        const geoFloor = new THREE.BoxBufferGeometry(2000, 0.1, 2000);
        const matStdFloor = new THREE.MeshPhongMaterial({color: StaticVariable.FLOOR_COLOR});
        me.baseFloor = new THREE.Mesh(geoFloor, matStdFloor);

        // ---
        me.scene.add(me.camera);
        me.scene.add(me.controls.getObject());
        me.scene.add(me.light);
        me.scene.add(me.objectField);
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
        me.isLock = false;

        //--
        me.disableAttach = false;
        me.selectedItem = null;

        //--
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

            me.renderer.render(me.scene, me.camera);
            me.assetItemManager.animationUpdate(delta);

            me.__move(delta);

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

        const arr = JSON.parse(json);

        if (arr.length) {
            const promiseArr = [];

            let assetItem;

            for (let i = 0; i < arr.length; i++) {
                assetItem = new AssetItem(arr[i]);

                promiseArr.push(me.itemLoader.load(assetItem));
            }

            Promise.all(promiseArr).then(function (itemArr) {
                let assetItem;

                for (let i = 0; i < itemArr.length; i++) {
                    assetItem = itemArr[i];

                    if (assetItem.type == StaticVariable.ITEM_TYPE_SPOT_LIGHT) {
                        assetItem.object3D.children[0].remove(assetItem.object3D.children[0].getObjectByName(StaticVariable.MESH_NAME_CONE));
                    }

                    me.objectField.add(assetItem.object3D);
                    me.cssRenderer.add(assetItem);
                    me.assetItemManager.add(assetItem);

                    assetItem.animationPlay();
                }
            });
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

    __detectPlayerCollision() {
        const me = this;

        // 이동방향.
        const direction = me.moveInfo.direction.clone();
        // 바라보는 방향. (높이제거)
        const cameraDirection = me.controls.getDirection(new THREE.Vector3()).clone();
        cameraDirection.setY(0);

        // 전방을 기준으로 카메라가 바라보는 각도.
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 0, -1),
            cameraDirection
        );

        // 카메라 방향 기준으로 이동하는 방향. (방향 오차를 줄이기 위해 normalize)
        direction.applyQuaternion(quaternion);
        direction.normalize();

        // 계산된 방향으로 선을 긋는다.
        const position = me.controls.getObject().position.clone();
        const rayCaster = new THREE.Raycaster(position, direction, 0, StaticVariable.CONTROLS_RAY_FAR);

        // 충돌검사.
        const intersects = rayCaster.intersectObjects(me.objectField.children, true);

        return intersects.length > 0;
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

            me.controls.moveRight(-velocity.x * delta);
            me.controls.moveForward(velocity.z * delta);
            // y축.
            me.controls.getObject().position.y -= (velocity.y * delta);

            if (me.controls.getObject().position.y < 1) {
                velocity.y = 0;
                me.controls.getObject().position.y = 1;
            }
        }
    }

    __initEvent() {
        const me = this;

        me.rootEl.addEventListener('click', function () {
            me.controls.lock();
        });

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