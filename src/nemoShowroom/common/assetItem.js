import * as THREE from 'three/build/three.module';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

import Utils from '../../class/utils';
import * as StaticVariable from './staticVariable';
import MaterialOption from './materialOption';
import MaterialButton from './materialButton';
import LightOptions from './lightOptions';
import ImageButton from './imageButton';

const Promise = window.Promise;

class Xyz {
    constructor (obj) {
        this.x = parseFloat(obj.x);
        this.y = parseFloat(obj.y);
        this.z = parseFloat(obj.z);
    }

    equals(xyz) {
        return (xyz instanceof Xyz) && (this.x === xyz.x) && (this.y === xyz.y) && (this.z === xyz.z);
    }
}

export default class AssetItem {
    constructor (obj = {}) {
        this.id = Utils.randomString();

        this.name = obj.name || '';
        this.description = obj.description || '';
        this.type = obj.type || StaticVariable.ITEM_TYPE_NONE;
        this.itemUrl = obj.itemUrl || '';
        this.content = obj.content || '';
        this.width = obj.width || 0;
        this.height = obj.height || 0;
        this.backgroundLoading = !!obj.backgroundLoading;
        this.link = obj.link || '';
        this.castShadow = !!obj.castShadow;
        this.receiveShadow = !!obj.receiveShadow;

        this.object3D = obj.object3D;

        this.zeroScale = new Xyz(obj.zeroScale || {x: 1, y: 1, z: 1});
        this.zeroPosition = new Xyz(obj.zeroPosition || {x: 0, y: 0, z: 0});
        this.zeroRotation = new Xyz(obj.zeroRotation || {x: 0, y: 0, z: 0});

        this.scale = new Xyz(obj.scale || {x: 1, y: 1, z: 1});
        this.position = new Xyz(obj.position || {x: 0, y: 0, z: 0});
        this.rotation = new Xyz(obj.rotation || {x: 0, y: 0, z: 0});

        this.animationMixer = obj.animationMixer || null;
        this.animationActions = obj.animationActions || [];

        this.animationStartTime = (typeof obj.animationStartTime === 'number') ? obj.animationStartTime : 0;
        this.animationEndTime = (typeof obj.animationEndTime === 'number') ? obj.animationEndTime : 0;
        this.animationLoop = (typeof obj.animationLoop === 'boolean') ? obj.animationLoop : true;
        this.isAnimationRun = false;

        this.onShow = (typeof obj.onShow === 'function') ? obj.onShow : function () {};
        this.onHide = (typeof obj.onHide === 'function') ? obj.onHide : function () {};
        this.onAnimationEnd = (typeof obj.onAnimationEnd === 'function') ? obj.onAnimationEnd : function () {};

        this.isSprite = !!obj.isSprite;
        this.isLight = !!obj.isLight;
        this.isStartPoint = !!obj.isStartPoint;

        this.isCollider = !!obj.isCollider;
        this.isTransparent = !!obj.isTransparent;
        this.isClickTarget = !!obj.isClickTarget;

        this.isLoaded = !!obj.isLoaded;
        this.isEmpty = !!obj.isEmpty;

        this.materialOptions = {};
        if (obj.materialOptions) {
            for (let id in obj.materialOptions) {
                this.materialOptions[id] = new MaterialOption(obj.materialOptions[id]);
            }
        }

        this.lightOptions = new LightOptions(obj.lightOptions);

        this.linkButtonArray = [];
        if (Array.isArray(obj.linkButtonArray)) {
            for (let i = 0; i < obj.linkButtonArray.length; i++) {
                this.linkButtonArray.push(new ImageButton(obj.linkButtonArray[i]));
            }
        }

        this.materialButtonArray = [];
        if (Array.isArray(obj.materialButtonArray)) {
            for (let i = 0; i < obj.materialButtonArray.length; i++) {
                this.materialButtonArray.push(new MaterialButton(obj.materialButtonArray[i]));
            }
        }
    }

    get isAnimation() {
        const me = this;

        return me.animationMixer && me.animationActions.length;
    }

    get isVisible() {
        const me = this;

        return (me.object3D) ? (me.object3D.visible) : false;
    }

    // 저장되는 JSON 값.
    toJSON() {
        const me = this;

        return {
            name: me.name,
            description: me.description,
            type: me.type,
            itemUrl: me.itemUrl,
            content: me.content,
            width: me.width,
            height: me.height,
            backgroundLoading: me.backgroundLoading,
            link: me.link,
            castShadow: me.castShadow,
            receiveShadow: me.receiveShadow,

            zeroScale: me.zeroScale,
            zeroPosition: me.zeroPosition,
            zeroRotation: me.zeroRotation,

            scale: me.scale,
            position: me.position,
            rotation: me.rotation,

            animationStartTime: me.animationStartTime,
            animationEndTime: me.animationEndTime,
            animationLoop: me.animationLoop,

            isSprite: me.isSprite,
            isLight: me.isLight,
            isStartPoint: me.isStartPoint,

            isCollider: me.isCollider,
            isTransparent: me.isTransparent,
            isClickTarget: me.isClickTarget,

            materialOptions: me.materialOptions,
            lightOptions: me.lightOptions,

            linkButtonArray: me.linkButtonArray,
            materialButtonArray: me.materialButtonArray
        };
    }

    setMaterialOption(obj = {}, id = '0') {
        const me = this;

        const materialOption = new MaterialOption(obj);

        let i = 0;

        // traverse 로 검색되는 순서를 인덱스로 사용한다.
        me.object3D.traverse(function (obj) {
            if (obj.isMesh && obj.material) {
                const mtl = obj.material;

                let targetMtl = null;

                // material이 배열인 경우.
                if (Array.isArray(mtl)) {
                    for (let j = 0; j < mtl.length; j++) {
                        if (id == i + '-' + j) {
                            targetMtl = mtl[j];
                            break;
                        }
                    }

                // 단일 material.
                } else if (id == i + '') {
                    targetMtl = mtl;
                }

                if (targetMtl) {
                    for (let key in materialOption) {
                        if (targetMtl.hasOwnProperty(key)) {
                            me.__setMtlValue(key, targetMtl, materialOption[key]);
                        }
                    }
                }

                i++;
            }
        });

        me.materialOptions[id] = materialOption;
    }

    setMaterialOptions(options = {}) {
        const me = this;

        for (let id in options) {
            me.setMaterialOption(options[id], id);
        }
    }

    getOriginalMaterialOptions() {
        const me = this;

        const options = {};

        let i = 0;

        // traverse 로 검색되는 순서를 인덱스로 사용한다.
        me.object3D.traverse(function (obj) {
            if (obj.isMesh && obj.material) {
                const mtl = obj.material;

                // material이 배열인 경우.
                if (Array.isArray(mtl)) {
                    for (let j = 0; j < mtl.length; j++) {
                        const mtlOption = new MaterialOption();
                        const childrenMtl = mtl[j];

                        for (let key in childrenMtl) {
                            if (mtlOption.hasOwnProperty(key)) {
                                me.__setMtlOptionValue(key, mtlOption, childrenMtl[key]);
                            }
                        }

                        options[i + '-' + j] = mtlOption;
                    }

                // 단일 material.
                } else {
                    const mtlOption = new MaterialOption();

                    for (let key in mtl) {
                        if (mtlOption.hasOwnProperty(key)) {
                            me.__setMtlOptionValue(key, mtlOption, mtl[key]);
                        }
                    }

                    options[i + ''] = mtlOption;
                }

                i++;
            }
        });

        return options;
    }

    setLightOptions(obj = {}) {
        const me = this;

        if (me.isLight) {
            me.lightOptions = new LightOptions(obj);

            me.object3D.traverse(function (obj) {
                if (obj instanceof THREE.Light) {
                    let val;

                    // 조명 설정 반복문 입력.
                    for (let key in me.lightOptions) {
                        if (key != 'shadow') {
                            val = me.lightOptions[key];

                            if (key == 'color' || key == 'groundColor') {
                                val = new THREE.Color(val);
                            }

                            obj[key] = val;
                        }
                    }

                    if (obj.shadow) {
                        // 그림자 설정 직접 입력.
                        obj.shadow.mapSize.width = me.lightOptions.shadowMapSizeW;
                        obj.shadow.mapSize.height = me.lightOptions.shadowMapSizeH;
                        obj.shadow.camera.near = me.lightOptions.shadowCameraNear;
                        obj.shadow.camera.far = me.lightOptions.shadowCameraFar;
                        obj.shadow.bias = me.lightOptions.shadowBias;
                        obj.shadow.focus = me.lightOptions.shadowFocus;

                        // only directional light.
                        if (obj.shadow.camera instanceof THREE.OrthographicCamera) {
                            obj.shadow.camera.left = me.lightOptions.shadowCameraLeft;
                            obj.shadow.camera.right = me.lightOptions.shadowCameraRight;
                            obj.shadow.camera.top = me.lightOptions.shadowCameraTop;
                            obj.shadow.camera.bottom = me.lightOptions.shadowCameraBottom;
                        }

                        obj.shadow.camera.updateProjectionMatrix();
                    }

                // 조명 helper 업데이트.
                } else if (obj instanceof RectAreaLightHelper || obj instanceof THREE.SpotLightHelper) {
                    obj.light.updateMatrix();
                    obj.update();

                // CameraHelper(그림자 영역) 업데이트.
                } else if (obj instanceof THREE.CameraHelper) {
                    obj.update();
                }
            });
        }
    }

    getBox3() {
        const me = this;

        return new THREE.Box3().setFromObject(me.object3D);
    }

    setOpacity(num = 1) {
        const me = this;

        me.object3D.traverse(function (obj) {
            if (obj.material) {
                obj.material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: num
                });

                obj.material.renderOrder = obj.renderOrder;
            }
        });
    }

    setCastShadow(bool) {
        const me = this;

        if (StaticVariable.ITEM_SYSTEM_TYPES.indexOf(me.type) < 0) {
            me.castShadow = bool;

            me.object3D.traverse(function (obj) {
                if (obj.isMesh) {
                    obj.castShadow = bool;
                }
            });
        }
    }

    setReceiveShadow(bool) {
        const me = this;

        const notSystemModel = StaticVariable.ITEM_SYSTEM_TYPES.indexOf(me.type) < 0;

        const supportMesh = me.type != StaticVariable.ITEM_TYPE_HTML
            && me.type != StaticVariable.ITEM_TYPE_YOUTUBE
            && me.type != StaticVariable.ITEM_TYPE_TEXT;

        if (notSystemModel && supportMesh) {
            me.receiveShadow = bool;

            me.object3D.traverse(function (obj) {
                if (obj.isMesh) {
                    obj.receiveShadow = bool;
                }
            });
        }
    }

    show(callEvent = true) {
        const me = this;

        me.object3D.visible = true;

        if (callEvent) {
            me.onShow();
        }
    }

    hide(callEvent = true) {
        const me = this;

        me.object3D.visible = false;

        me.object3D.traverse(function(object3D) {
            // 애니메이션 시간을 초기화 한다.
            if (object3D.mixer) {
                object3D.mixer.time = me.animationStartTime / 1000;

                for (let i = 0; i < object3D.animations.length; i++) {
                    const action = object3D.mixer.clipAction(object3D.animations[i]);
                    action.reset();
                }
            }
        });

        if (callEvent) {
            me.onHide();
        }
    }

    animationUpdate(clockDelta) {
        const me = this;

        if (me.isAnimation && me.isAnimationRun) {
            const mixer = me.animationMixer;

            let delta = clockDelta;

            if (me.animationEndTime > 0 && mixer.time > (me.animationEndTime / 1000)) {
                if (me.animationLoop) {
                    me.animationMixer.time = 0;

                    const actions = me.animationActions;

                    for (let i = 0; i < actions.length; i++) {
                        actions[i].reset();
                    }

                    delta = me.animationStartTime / 1000;

                } else {
                    me.animationStop();
                }

                // 시간이 정해지지 않았을 때 루프이벤트는 asset-loader 에서 선언.
                me.onAnimationEnd();
            }

            mixer.update(delta);
        }
    }

    animationPlay() {
        const me = this;

        if (me.isAnimation) {
            me.animationMixer.time = 0;

            const actions = me.animationActions;

            for (let i = 0; i < actions.length; i++) {
                actions[i].reset();
                actions[i].play();
            }

            me.animationMixer.update(me.animationStartTime / 1000);

            me.isAnimationRun = true;
        }
    }

    animationStop() {
        const me = this;

        if (me.isAnimation) {
            me.isAnimationRun = false;

            me.animationMixer.stopAllAction();
        }
    }

    setAnimationTime(startMs = 0, endMs = 0, loop = true) {
        const me = this;

        if (me.isAnimation) {
            me.animationStartTime = parseInt(startMs, 10);
            me.animationEndTime = parseInt(endMs, 10);
            me.animationLoop = loop;
        }
    }

    syncTransformMembers() {
        const me = this;

        const object3D = me.object3D;
        const position = object3D.position;
        const rotation = object3D.rotation;
        const scale = object3D.scale;

        me.position.x = position.x;
        me.position.y = position.y;
        me.position.z = position.z;

        me.rotation.x = rotation.x;
        me.rotation.y = rotation.y;
        me.rotation.z = rotation.z;

        me.scale.x = scale.x;
        me.scale.y = scale.y;
        me.scale.z = scale.z;
    }

    clone() {
        const me = this;

        return new AssetItem(me);
    }

    __loadTexture(url) {
        return new Promise(function (resolve, reject) {
            const loader = new THREE.TextureLoader();

            loader.load(url, function (texture) {
                texture.flipY = false;

                resolve(texture);
            }, undefined, reject);
        });
    }

    __loadCubeTexture(urlArr) {
        return new Promise(function (resolve, reject) {
            if (urlArr.length == 6) {
                const loader = new THREE.CubeTextureLoader();

                loader.setPath('./');

                loader.load(urlArr, function (cubeTexture) {
                    resolve(cubeTexture);
                }, undefined, reject);

            } else {
                reject(new Error('need 6 url'));
            }
        });
    }

    __setMtlLiteral(name, mtl, value) {
        mtl[name] = value;
    }

    __setMtlColor(name, mtl, value) {
        if (value) {
            mtl[name] = new THREE.Color(value);
        }
    }

    __setMtlTexture(name, mtl, value) {
        const me = this;

        if (value) {
            me.__loadTexture(value).catch(function () {
                return Promise.resolve(null);

            }).then(function (texture) {
                mtl[name] = texture;
                mtl.needsUpdate = true;
            });
        }
    }

    __setMtlCubeTexture(name, mtl, value) {
        const me = this;

        if (value) {
            me.__loadCubeTexture(value).catch(function () {
                return Promise.resolve(null);

            }).then(function (cubeTexture) {
                mtl[name] = cubeTexture;
                mtl.needsUpdate = true;
            });
        }
    }

    __setMtlValue(name, mtl, value) {
        const me = this;

        switch (name) {
            case 'roughness':
            case 'metalness':
            case 'reflectivity':
                me.__setMtlLiteral(name, mtl, value);
                break;

            case 'color':
            case 'emissive':
                me.__setMtlColor(name, mtl, value);
                break;

            case 'map' :
            case 'normalMap' :
            case 'metalnessMap' :
            case 'roughnessMap' :
                me.__setMtlTexture(name, mtl, value);
                break;

            case 'envMap':
                me.__setMtlCubeTexture(name, mtl, value);
        }
    }

    __setMtlOptionLiteral(name, mtlOption, value) {
        mtlOption[name] = value;
    }

    __setMtlOptionColor(name, mtlOption, value) {
        if (value) {
            mtlOption[name] = value.getStyle();
        }
    }

    __getTextureImageUrl(img) {
        let url = '';

        // img 태그
        if (img.tagName && img.tagName.toLowerCase() == 'img') {
            const pathname = Utils.parseUrl(img.baseURI).pathname;
            url = img.currentSrc.substring(img.currentSrc.indexOf(pathname) + pathname.length);

        // ImageBitmap
        } else if (img && img instanceof ImageBitmap) {
            const canvas = document.createElement('canvas');

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');

            ctx.drawImage(img, 0, 0, img.width, img.height);

            url = canvas.toDataURL();
        }

        return url;
    }

    __setMtlOptionTexture(name, mtlOption, value) {
        const me = this;

        if (value && value.image) {
            mtlOption[name] = me.__getTextureImageUrl(value.image);

        } else {
            mtlOption[name] = '';
        }
    }

    __setMtlOptionCubeTexture(name, mtlOption, value) {
        const me = this;

        if (value && value.image && value.image.length == 6) {
            const arr = [];

            for (let i = 0; i < value.image.length; i++) {
                arr.push(me.__getTextureImageUrl(value.image[i]));
            }

            mtlOption[name] = arr;

        } else {
            mtlOption[name] = [];
        }
    }

    __setMtlOptionValue(name, mtlOption, value) {
        const me = this;

        switch (name) {
            case 'roughness':
            case 'metalness':
            case 'reflectivity':
                me.__setMtlOptionLiteral(name, mtlOption, value);
                break;

            case 'color':
            case 'emissive':
                me.__setMtlOptionColor(name, mtlOption, value);
                break;

            case 'map' :
            case 'normalMap' :
            case 'metalnessMap' :
            case 'roughnessMap' :
                me.__setMtlOptionTexture(name, mtlOption, value);
                break;

            case 'envMap':
                me.__setMtlOptionCubeTexture(name, mtlOption, value);
        }
    }
}