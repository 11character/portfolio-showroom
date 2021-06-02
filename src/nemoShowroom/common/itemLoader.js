import * as THREE from 'three/build/three.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

import html2canvas from 'html2canvas';

import Utils from '../../class/utils';
import * as StaticVariable from './staticVariable';

const Promise = window.Promise;

export default class AssetLoader {
    constructor (baseUrl) {
        this.baseUrl = baseUrl || '.';
    }

    load(assetItem) {
        const me = this;

        assetItem.object3D = new THREE.Group();

        return me.__loadItem(assetItem).then(function (item) {
            return me.__onLoad(item);

        }).catch(function () {
            assetItem.isEmpty = true;
            assetItem.object3D = new THREE.Group();

            return Promise.resolve(assetItem);
        });
    }

    clone(assetItem) {
        const me = this;

        const cloneItem = assetItem.clone();
        cloneItem.isLoaded = false;
        cloneItem.object3D = new THREE.Group();

        // 3D객체 복제
        // 3D객체를 복제하는 데 타입을 구분하는 이유는 threejs로 불러온 파일 형식에 따라서 복제가 안되는 포맷이 있기 때문이다.
        // 복제가 안되는 대상은 재로드 하는 방식을 사용한다.(현재는 fbx파일)
        // 반대로 obj로더의 경우에는 로드를 연속으로 하면 오류가 발생한다.

        let promise;

        if (StaticVariable.CLONE_RELOAD_TYPE.indexOf(cloneItem.type) > -1) {
            promise = me.__loadItem(cloneItem);

        } else {
            cloneItem.object3D.add(assetItem.object3D.clone());
            cloneItem.object3D.scale.copy(assetItem.object3D.scale);
            cloneItem.object3D.position.copy(assetItem.object3D.position);
            cloneItem.object3D.rotation.copy(assetItem.object3D.rotation);

            promise = Promise.resolve(cloneItem);
        }

        return promise.then(function (item) {
            return me.__onLoad(item);

        }).catch(function () {
            cloneItem.isEmpty = false;
            cloneItem.object3D = new THREE.Group();

            return Promise.resolve(cloneItem);
        });
    }

    __onLoad(assetItem) {
        const group = assetItem.object3D;
        const removeChildArr = [];
        const notSystemModel = StaticVariable.ITEM_SYSTEM_TYPES.indexOf(assetItem.type) < 0;

        group.traverse(function (object3D) {
            // 객체를 회전했을 때 Y축 180도 이상 회전값에 의해 XZ축이 반전되는 것을 막기위한 처리.
            // 다만 이로 인해 X축이 180도 이상 회전시 YZ가 반전된다.
            if (object3D.rotation) {
                object3D.rotation.order = 'YXZ';
            }

            // 에디터에서 추가하지 않은 조명 객체가 섞여 있는 경우 제거한다.
            if (notSystemModel && object3D.isLight) {
                removeChildArr.push(object3D);
            }

            // 카메라 객체가 섞여 있는 경우 제거한다.
            if (object3D.isCamera) {
                removeChildArr.push(object3D);
            }

            // 객체 양면 표시.
            if (object3D.material) {
                object3D.material.side = THREE.DoubleSide;
            }

            // 그림자 설정.
            if (notSystemModel && object3D.isMesh) {
                object3D.castShadow = assetItem.castShadow;
                object3D.receiveShadow = assetItem.receiveShadow;
            }

            if (assetItem.type !== StaticVariable.ITEM_TYPE_HTML && assetItem.type !== StaticVariable.ITEM_TYPE_YOUTUBE) {
                object3D.renderOrder = 1;
            }
        });

        if (assetItem.type !== StaticVariable.ITEM_TYPE_HTML && assetItem.type !== StaticVariable.ITEM_TYPE_YOUTUBE) {
            group.renderOrder = 1;
        }

        for(let i = 0; i < removeChildArr.length; i++) {
            removeChildArr[i].parent.remove(removeChildArr[i]);
        }

        // material 설정값이 있으면 적용.
        if (Object.keys(assetItem.materialOptions).length) {
            assetItem.setMaterialOptions(assetItem.materialOptions);
        }

        assetItem.isLoaded = true;

        return Promise.resolve(assetItem);
    }

    __loadItem(assetItem) {
        const me = this;

        const onLoadComplete = function (object3D) {
            const itemGroup = assetItem.object3D;
            const scale = assetItem.scale;
            const position = assetItem.position;
            const rotation = assetItem.rotation;

            itemGroup.scale.set(scale.x, scale.y, scale.z);
            itemGroup.position.set(position.x, position.y, position.z);
            itemGroup.rotation.set(rotation.x, rotation.y, rotation.z, itemGroup.rotation.w);

            itemGroup.add(object3D);

            return Promise.resolve(assetItem);
        };

        switch (assetItem.type) {
            case StaticVariable.ITEM_TYPE_3D_GLB:
            case StaticVariable.ITEM_TYPE_3D_GLTF:
                return me.__loadGltf(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_3D_OBJ:
                return me.__loadObjMtl(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_3D_STL:
                return me.__loadStl(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_3D_FBX:
                return me.__loadFbx(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_3D_DAE:
                return me.__loadCollada(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_IMAGE:
                return me.__loadImage(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_HTML:
                return me.__loadHtml(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_YOUTUBE:
                return me.__loadYoutube(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_TEXT:
                return me.__loadText(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_AMBIENT_LIGHT:
                return me.__loadAmbientLight(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_DIRECTIONAL_LIGHT:
                return me.__loadDirectionalLight(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_HEMISPHERE_LIGHT:
                return me.__loadHemisphereLight(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_SPOT_LIGHT:
                return me.__loadSpotLight(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_POINT_LIGHT:
                return me.__loadPointLight(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_RECT_LIGHT:
                return me.__loadRectLight(assetItem).then(onLoadComplete);

            case StaticVariable.ITEM_TYPE_START_POINT:
                return me.__loadStartPoint(assetItem).then(onLoadComplete);

            default:
                console.error('type not found');
                return Promise.reject();
        }
    }

    __loadStartPoint(assetItem) {
        return new Promise(function (resolve) {
            const geometry = new THREE.ConeGeometry(1, 0.5, 4);
            const meshMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff, emissive: 0x888888, transparent: true, opacity: 0.9});
            const cone = new THREE.Mesh(geometry, meshMaterial);

            assetItem.isStartPoint = true;

            cone.scale.setX(0.5);
            cone.position.set(0, 1, -0.25);
            cone.rotation.set(Math.PI / 2, 0, Math.PI);

            const group = new THREE.Group();

            group.add(cone);

            const clone = cone.clone();
            const lineMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});

            clone.material = lineMaterial;
            clone.scale.set(0.51, 1.01, 1.01);

            group.add(clone);

            resolve(group);
        });
    }

    __loadAmbientLight(assetItem) {
        return new Promise(function (resolve) {
            const lightOptions = assetItem.lightOptions;
            const light = new THREE.AmbientLight(
                new THREE.Color(lightOptions.color),
                lightOptions.intensity
            );

            const geometry = new THREE.SphereGeometry(1, 8, 8);
            const material = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: false});
            const sphere = new THREE.Mesh(geometry, material);
            const group = new THREE.Group();

            assetItem.isLight = true;

            sphere.name = StaticVariable.MESH_NAME_LIGHT_HELPER;

            group.add(light);
            group.add(sphere);

            resolve(group);
        });
    }

    __loadDirectionalLight(assetItem) {
        return new Promise(function (resolve) {
            const lightOptions = assetItem.lightOptions;
            const light = new THREE.DirectionalLight(
                new THREE.Color(lightOptions.color),
                lightOptions.intensity
            );

            const geometry = new THREE.SphereGeometry(0.5, 8, 8);
            const material = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: false});
            const sphere = new THREE.Mesh(geometry, material);
            const field = new THREE.Group();
            const group = new THREE.Group();

            assetItem.isLight = true;

            // 조명의 기본 방향을 -y로 하려 한다.
            // CameraHelper 의 기본방향은 -z다.
            // CameraHelper 의 기본방향 수정방법을 찾지 못했다.
            // 그렇기 때문에 조명 방향을 -z축으로 설정하고, field를 -y로 회전한다.
            light.position.set(0, 0, 0);
            light.target.position.set(0, 0, -1);
            light.castShadow = lightOptions.castShadow;
            light.shadow.mapSize.width = lightOptions.shadowMapSizeW;
            light.shadow.mapSize.height = lightOptions.shadowMapSizeH;
            light.shadow.camera.near = lightOptions.shadowCameraNear;
            light.shadow.camera.far = lightOptions.shadowCameraFar;
            light.shadow.camera.left = lightOptions.shadowCameraLeft;
            light.shadow.camera.right = lightOptions.shadowCameraRight;
            light.shadow.camera.top = lightOptions.shadowCameraTop;
            light.shadow.camera.bottom = lightOptions.shadowCameraBottom;
            light.shadow.bias = lightOptions.shadowBias;

            // 그림자 설정 후 CameraHelper를 생성해야 한다.
            const helper = new THREE.CameraHelper(light.shadow.camera);

            helper.matrix = new THREE.Matrix4();

            helper.name = StaticVariable.MESH_NAME_LIGHT_HELPER;
            sphere.name = StaticVariable.MESH_NAME_LIGHT_HELPER;

            field.add(light);
            field.add(light.target);
            field.add(sphere);
            field.add(helper);

            field.rotation.set(-(Math.PI / 2), 0, 0);

            group.add(field);

            resolve(group);
        });
    }

    __loadHemisphereLight(assetItem) {
        return new Promise(function (resolve) {
            const lightOptions = assetItem.lightOptions;
            const light = new THREE.HemisphereLight(
                new THREE.Color(lightOptions.color),
                new THREE.Color(lightOptions.groundColor),
                lightOptions.intensity
            );

            const sGeometry = new THREE.SphereGeometry(0.5, 8, 8);
            const bGeometry1 = new THREE.BoxGeometry(0.25, 2, 0.25);
            const bGeometry2 = new THREE.BoxGeometry(0.25, 2, 0.25);
            const sMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: false});
            const bMaterial1 = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: false});
            const bMaterial2 = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: false});
            const sphere = new THREE.Mesh(sGeometry, sMaterial);
            const box1 = new THREE.Mesh(bGeometry1, bMaterial1);
            const box2 = new THREE.Mesh(bGeometry2, bMaterial2);
            const group = new THREE.Group();

            assetItem.isLight = true;

            box1.position.set(0, 1.5, 0);
            box2.position.set(0, -1.5, 0);

            sphere.name = StaticVariable.MESH_NAME_LIGHT_HELPER;
            box1.name = StaticVariable.MESH_NAME_LIGHT_HELPER;
            box2.name = StaticVariable.MESH_NAME_LIGHT_HELPER;

            group.add(light);
            group.add(sphere);
            group.add(box1);
            group.add(box2);

            resolve(group);
        }).catch();
    }

    __loadSpotLight(assetItem) {
        return new Promise(function (resolve) {
            const lightOptions = assetItem.lightOptions;
            const light = new THREE.SpotLight(
                new THREE.Color(lightOptions.color),
                lightOptions.intensity,
                lightOptions.distance,
                lightOptions.angle,
                lightOptions.penumbra,
                lightOptions.decay
            );

            const helper = new THREE.SpotLightHelper(light, 0xffff00);
            const geometry = new THREE.SphereGeometry(0.5, 8, 8);
            const material = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: false});
            const sphere = new THREE.Mesh(geometry, material);
            const group = new THREE.Group();

            assetItem.isLight = true;

            light.position.set(0, 0.5, 0);
            light.castShadow = lightOptions.castShadow;
            light.shadow.mapSize.width = lightOptions.shadowMapSizeW;
            light.shadow.mapSize.height = lightOptions.shadowMapSizeH;
            light.shadow.camera.near = lightOptions.shadowCameraNear;
            light.shadow.camera.far = lightOptions.shadowCameraFar;
            light.shadow.bias = lightOptions.shadowBias;
            light.shadow.focus = lightOptions.shadowFocus;

            helper.matrix = helper.light.matrix;

            helper.name = StaticVariable.MESH_NAME_LIGHT_HELPER;
            sphere.name = StaticVariable.MESH_NAME_LIGHT_HELPER;

            group.add(light);
            group.add(light.target);
            group.add(helper);
            group.add(sphere);

            resolve(group);
        });
    }

    __loadPointLight(assetItem) {
        return new Promise(function (resolve) {
            const lightOptions = assetItem.lightOptions;
            const light = new THREE.PointLight(
                new THREE.Color(lightOptions.color),
                lightOptions.intensity,
                lightOptions.distance,
                lightOptions.decay
            );

            const helper = new THREE.PointLightHelper(light, 1, 0xffff00);
            const geometry = new THREE.SphereGeometry(0.5, 8, 8);
            const material = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: false});
            const sphere = new THREE.Mesh(geometry, material);
            const group = new THREE.Group();

            assetItem.isLight = true;

            light.castShadow = lightOptions.castShadow;
            light.shadow.mapSize.width = lightOptions.shadowMapSizeW;
            light.shadow.mapSize.height = lightOptions.shadowMapSizeH;
            light.shadow.camera.near = lightOptions.shadowCameraNear;
            light.shadow.camera.far = lightOptions.shadowCameraFar;
            light.shadow.bias = lightOptions.shadowBias;

            helper.matrix = helper.light.matrix;

            helper.name = StaticVariable.MESH_NAME_LIGHT_HELPER;
            sphere.name = StaticVariable.MESH_NAME_LIGHT_HELPER;

            group.add(light);
            group.add(helper);
            group.add(sphere);

            resolve(group);
        });
    }

    __loadRectLight(assetItem) {
        return new Promise(function (resolve) {
            const lightOptions = assetItem.lightOptions;

            const lightF = new THREE.RectAreaLight(
                new THREE.Color(lightOptions.color),
                lightOptions.intensity,
                lightOptions.width,
                lightOptions.height
            );

            const lightB = new THREE.RectAreaLight(
                new THREE.Color(lightOptions.color),
                lightOptions.intensity,
                lightOptions.width,
                lightOptions.height
            );

            const helper = new RectAreaLightHelper(lightF);
            const group = new THREE.Group();

            assetItem.isLight = true;

            lightB.lookAt(0, 0, 1);

            group.add(lightF);
            group.add(lightB);
            group.add(helper);

            resolve(group);
        }).catch(e => console.log(e));
    }

    __loadText(assetItem) {
        const fieldEl = document.getElementById(StaticVariable.ELEMENT_FIELD_ID);
        const divEl = Utils.createDivElement();

        divEl.innerHTML = assetItem.content;
        // 배치 후 모습이 보지 않게 위치를 이동한다.
        divEl.style.position = 'absolute';
        divEl.style.left = '100%';
        divEl.style.top = '100%';
        fieldEl.appendChild(divEl);

        const width = divEl.offsetWidth;
        const height = divEl.offsetHeight;

        assetItem.width = width;
        assetItem.height = height;

        return html2canvas(divEl, {
            backgroundColor: null,
            logging: false,
            width: width,
            height: height

        }).then(function (canvas) {
            const g = new THREE.PlaneGeometry(width, height);
            const m = new THREE.MeshPhongMaterial({
                map: new THREE.CanvasTexture(canvas)
            });
            const object3D = new THREE.Mesh(g, m);

            fieldEl.removeChild(divEl);

            return Promise.resolve(object3D);
        });
    }

    __loadImage(assetItem) {
        const me = this;

        return new Promise(function (resolve, reject) {
            const loader = new THREE.TextureLoader();
            const imageUrl = me.baseUrl + '/' + assetItem.itemUrl;

            loader.load(imageUrl, function (texture) {
                let object3D;

                if (assetItem.isSprite) {
                    const sm = new THREE.SpriteMaterial({
                        map: texture
                    });

                    object3D = new THREE.Sprite(sm);
                    object3D.scale.set(assetItem.width, assetItem.height, 1);

                } else {
                    const g = new THREE.PlaneGeometry(assetItem.width, assetItem.height);
                    const m = new THREE.MeshPhongMaterial({
                        map: texture,
                        transparent: true
                    });

                    object3D = new THREE.Mesh(g, m);
                }

                assetItem.object3D.add(object3D);

                resolve(object3D);
            }, null, reject);
        });
    }

    __loadHtml(assetItem) {
        let object3D;

        if (assetItem.isSprite) {
            const sm = new THREE.SpriteMaterial({
                colorWrite: false
            });

            object3D = new THREE.Sprite(sm);
            object3D.scale.set(1, 1, 1);

        } else {
            const g = new THREE.PlaneGeometry(1, 1);
            const m = new THREE.MeshBasicMaterial({
                colorWrite: false
            });

            object3D = new THREE.Mesh(g, m);
        }

        object3D.name = StaticVariable.TRANSPARENT_OBJECT_NAME;

        return Promise.resolve(object3D);
    }

    __loadYoutube(assetItem) {
        let object3D;

        if (assetItem.isSprite) {
            const sm = new THREE.SpriteMaterial({
                colorWrite: false
            });
            object3D = new THREE.Sprite(sm);
            object3D.scale.set(1, 1, 1);

        } else {
            const g = new THREE.PlaneGeometry(1, 1);
            const m = new THREE.MeshBasicMaterial({
                colorWrite: false
            });

            object3D = new THREE.Mesh(g, m);
        }

        object3D.name = StaticVariable.TRANSPARENT_OBJECT_NAME;

        return Promise.resolve(object3D);
    }

    __loadGltf(assetItem) {
        const me = this;

        return new Promise(function (resolve, reject) {
            const loader = new GLTFLoader();
            const glthUrl = me.baseUrl + '/' + assetItem.itemUrl;

            loader.setPath(Utils.urlToParentPath(glthUrl) + '/');

            loader.load(Utils.urlToFileName(glthUrl), function (gltf) {
                resolve(gltf.scene);
            }, null, reject);
        });
    }

    __loadFbx(assetItem) {
        const me = this;

        return new Promise(function (resolve, reject) {
            const loader = new FBXLoader();
            const fbxUrl = me.baseUrl + '/' + assetItem.itemUrl;

            loader.load(fbxUrl, function (object3D) {
                if (object3D.animations && object3D.animations.length) {
                    const mixer = new THREE.AnimationMixer(object3D);
                    const clips = object3D.animations;

                    assetItem.animationMixer = mixer;
                    assetItem.animationActions = [];

                    for (let i = 0; i < clips.length; i++) {
                        const action = mixer.clipAction(clips[i]);

                        assetItem.animationActions.push(action);
                    }

                    // 시간이 지정 되었을 때 루프이벤트는 assetItem 에서 선언.
                    mixer.addEventListener('loop', function () {
                        assetItem.animationStop();

                        if (assetItem.animationLoop) {
                            assetItem.animationPlay();
                        }

                        assetItem.onAnimationEnd();
                    });
                }

                object3D.traverse(function (obj) {
                    if (obj.isMesh) {
                        obj.frustumCulled = false;
                    }
                });

                resolve(object3D);
            }, null, reject);
        });
    }

    __loadStl(assetItem) {
        const me = this;

        return new Promise(function (resolve, reject) {
            const loader = new STLLoader();
            const stlUrl = me.baseUrl + '/' + assetItem.itemUrl;

            loader.load(stlUrl, function (geometry) {
                const object3D = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());

                resolve(object3D);
            }, null, reject);
        });
    }

    __loadObj (assetItem, mtlParseResult) {
        const me = this;

        return new Promise(function (resolve, reject) {
            const objUrl = me.baseUrl + '/' + assetItem.itemUrl;
            const loader = new OBJLoader2();

            if (mtlParseResult) {
                loader.addMaterials(MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult), true);
            }

            loader.load(objUrl, function (object3D) {
                resolve(object3D);
            }, null, reject, null, false);
        });
    }

    __loadMtl(assetItem) {
        const me = this;

        return new Promise(function (resolve, reject) {
            try {
                const xhr = new XMLHttpRequest();

                let mtlUrl = me.baseUrl + '/' + assetItem.itemUrl;

                mtlUrl = mtlUrl.substring(0, mtlUrl.lastIndexOf('.'));
                mtlUrl += '.mtl';

                // mtl파일이 없는 오류를 로더에서 감지할 수 없기 때문에 따로 확인한다.
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === xhr.DONE) {
                        if (xhr.status === 200) {
                            const loader = new MTLLoader();

                            loader.load(mtlUrl, function (mtlParseResult) {
                                resolve(mtlParseResult);
                            });

                        } else {
                            reject(new Error('mtl not found'));
                        }
                    }
                };

                xhr.open('GET', mtlUrl);
                xhr.send();

            } catch (error) {
                reject(error);
            }
        });
    }

    __loadObjMtl(assetItem) {
        const me = this;

        return new Promise(function (resolve, reject) {
            me.__loadMtl(assetItem).catch(function () {
                return Promise.resolve(null);

            }).then(function (mtlParseResult) {
                me.__loadObj(assetItem, mtlParseResult).then(function (object3D) {
                    resolve(object3D);
                }).catch(reject);
            });
        });
    }

    __loadCollada(assetItem) {
        const me = this;

        return new Promise(function (resolve, reject) {
            const loader = new ColladaLoader();
            const daeUrl = me.baseUrl + '/' + assetItem.itemUrl;

            loader.load(daeUrl, function (collada) {
                resolve(collada.scene);
            }, null, reject);
        });
    }
}