import * as THREE from 'three/build/three.module';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import { MtlObjBridge } from "three/examples/jsm/loaders/obj2/bridge/MtlObjBridge";

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
        });
    }

    clone(assetItem) {
        const me = this;

        const cloneItem = (assetItem.clone()).object3D = new THREE.Group();
        const reloadType = StaticVariable.CLONE_RELOAD_TYPE;

        // 3D객체 복제
        // 3D객체를 복제하는 데 타입을 구분하는 이유는 threejs로 불러온 파일 형식에 따라서 복제가 안되는 포맷이 있기 때문이다.
        // 복제가 안되는 대상은 재로드 하는 방식을 사용한다.(현재는 fbx파일)
        // 반대로 obj로더의 경우에는 로드를 연속으로 하면 오류가 발생한다.

        cloneItem.isLoaded = false;
        cloneItem.isUsed = false;

        let promise;

        if (reloadType.indexOf(cloneItem.type) > -1) {
            promise = me.__loadItem(cloneItem)

        } else {
            cloneItem.object3D.add(assetItem.object3D.clone());
            cloneItem.object3D.scale.copy(assetItem.object3D.scale);
            cloneItem.object3D.position.copy(assetItem.object3D.position);
            cloneItem.object3D.rotation.copy(assetItem.object3D.rotation);

            promise = Promise.resolve();
        }

        return promise.then(function () {
            return me.__onLoad(cloneItem);
        });
    }

    __onLoad(assetItem) {
        const group = assetItem.object3D;
        const lightArr = [];

        group.traverse(function (object3D) {
            if (assetItem.type != StaticVariable.ITEM_TYPE_SPOT_LIGHT && object3D.isLight) {
                lightArr.push(object3D);
            }

            // 객체 양면 표시.
            if (object3D.material) {
                object3D.material.side = THREE.DoubleSide;
            }
        });

        for(let i = 0; i < lightArr.length; i++) {
            lightArr[i].parent.remove(lightArr[i]);
        }

        assetItem.isLoaded = true;

        return Promise.resolve(assetItem);
    }

    __loadItem(assetItem) {
        const me = this;

        const onLoad = function (object3D) {
            const itemGroup = assetItem.object3D;
            const scale = assetItem.scale;
            const position = assetItem.position;
            const rotation = assetItem.rotation;

            itemGroup.traverse(function (object3D) {
                if (object3D.material) {
                    object3D.userData[StaticVariable.ORG_TRANSPARENT_NAME] = object3D.material.transparent;
                    object3D.userData[StaticVariable.ORG_OPACITY_NAME] = object3D.material.opacity;
                }
            });

            itemGroup.scale.set(scale.x, scale.y, scale.z);
            itemGroup.position.set(position.x, position.y, position.z);
            itemGroup.rotation.set(rotation.x, rotation.y, rotation.z, itemGroup.rotation.w);

            itemGroup.add(object3D);

            return Promise.resolve(assetItem);
        };

        const onError = function () {
            assetItem.object3D.add(new THREE.Object3D());

            return Promise.resolve(assetItem);
        };

        switch (assetItem.type) {
            case StaticVariable.ITEM_TYPE_3D_OBJ:
                return me.__loadObjMtl(assetItem).then(onLoad).catch(onError);

            case StaticVariable.ITEM_TYPE_3D_STL:
                return me.__loadSTL(assetItem).then(onLoad).catch(onError);

            case StaticVariable.ITEM_TYPE_3D_FBX:
                return me.__loadFBX(assetItem).then(onLoad).catch(onError);

            case StaticVariable.ITEM_TYPE_IMAGE:
                return me.__loadImage(assetItem).then(onLoad).catch(onError);

            case StaticVariable.ITEM_TYPE_HTML:
                return me.__loadHTML(assetItem).then(onLoad).catch(onError);

            case StaticVariable.ITEM_TYPE_YOUTUBE:
                return me.__loadYoutube(assetItem).then(onLoad).catch(onError);

            case StaticVariable.ITEM_TYPE_TEXT:
                return me.__loadText(assetItem).then(onLoad).catch(onError);

            case StaticVariable.ITEM_TYPE_SPOT_LIGHT:
                return me.__loadSpotLight(assetItem).then(onLoad).catch(onError);

            default:
                console.error('type not found');
                return onError();
        }
    }

    __clearGroup(object3D) {
        for (let i = 0; i < object3D.children.length; i++) {
            object3D.remove(object3D.children[i]);
        }
    }

    __loadSpotLight(assetItem) {
        const me = this;

        return new Promise(function (resolve, reject) {
            try {
                const spotLight = new THREE.SpotLight( 0xffffff );
                const group = new THREE.Group();

                spotLight.position.set(0, 0.5, 0);
                spotLight.target.position.set(0, -4.5, 0);
                spotLight.angle = Utils.d2r(45);

                group.add(spotLight);
                group.add(spotLight.target);

                const geometry = new THREE.ConeGeometry(1, 1, 32);
                const material = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: true});
                const cone = new THREE.Mesh(geometry, material);

                cone.material.depthTest = false;
                cone.material.transparent = true;
                cone.material.opacity = 0.7;

                group.add(cone);

                resolve(group);

            } catch (error) {
                reject(error);
            }
        });
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
                transparent: true,
                map: new THREE.CanvasTexture(canvas),
                side: THREE.DoubleSide
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
                        transparent: true,
                        map: texture
                    });

                    object3D = new THREE.Sprite(sm);
                    object3D.scale.set(assetItem.width, assetItem.height, 1);

                } else {
                    const g = new THREE.PlaneGeometry(assetItem.width, assetItem.height);
                    const m = new THREE.MeshPhongMaterial({
                        transparent: true,
                        map: texture,
                        side: THREE.DoubleSide
                    });

                    object3D = new THREE.Mesh(g, m);
                }

                assetItem.object3D.add(object3D);

                resolve(object3D);
            }, null, reject);
        });
    }

    __loadHTML(assetItem) {
        let object3D;

        if (assetItem.isSprite) {
            const sm = new THREE.SpriteMaterial({
                transparent: true,
                opacity: 0,
                color: 0x000000,
                blending: THREE.NoBlending
            });

            object3D = new THREE.Sprite(sm);
            object3D.scale.set(1, 1, 1);

        } else {
            const g = new THREE.PlaneGeometry(1, 1);
            const m = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0,
                color: 0x000000,
                blending: THREE.NoBlending,
                side: THREE.DoubleSide
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
                transparent: true,
                opacity: 0,
                color: 0x000000,
                blending: THREE.NoBlending
            });
            object3D = new THREE.Sprite(sm);
            object3D.scale.set(1, 1, 1);

        } else {
            const g = new THREE.PlaneGeometry(1, 1);
            const m = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0,
                color: 0x000000,
                blending: THREE.NoBlending,
                side: THREE.DoubleSide
            });

            object3D = new THREE.Mesh(g, m);
        }

        object3D.name = StaticVariable.TRANSPARENT_OBJECT_NAME;

        return Promise.resolve(object3D);
    }

    __loadFBX(assetItem) {
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

    __loadSTL(assetItem) {
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
                loader.addMaterials(MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true);
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
                try {
                    me.__loadObj(assetItem, mtlParseResult).then(function (object3D) {
                        resolve(object3D);
                    });

                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            });
        });
    }
}