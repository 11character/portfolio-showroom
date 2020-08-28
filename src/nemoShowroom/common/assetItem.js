import * as THREE from 'three/build/three.module';

import Utils from '../../class/utils';
import * as StaticVariable from './staticVariable';
import MaterialOption from '../common/materialOption';
import LightOption from '../common/lightOption';
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
        this.type = obj.type || StaticVariable.ITEM_TYPE_NONE;
        this.itemUrl = obj.itemUrl || '';
        this.content = obj.content || '';
        this.width = obj.width || 0;
        this.height = obj.height || 0;
        this.link = obj.link || '';

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

        this.materialOptions = {};
        if (obj.materialOptions) {
            for (let index in obj.materialOptions) {
                this.materialOptions[index] = new MaterialOption(obj.materialOptions[index]);
            }
        }

        this.lightOption = new LightOption(obj.lightOption);

        this.linkButtonArray = [];
        if (Array.isArray(obj.linkButtonArray)) {
            for (let i = 0; i < obj.linkButtonArray.length; i++) {
                this.linkButtonArray.push(new ImageButton(obj.linkButtonArray[i]));
            }
        }

        this.textureButtonArray = [];
        if (Array.isArray(obj.textureButtonArray)) {
            for (let i = 0; i < obj.textureButtonArray.length; i++) {
                this.textureButtonArray.push(new ImageButton(obj.textureButtonArray[i]));
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
            type: me.type,
            itemUrl: me.itemUrl,
            content: me.content,
            width: me.width,
            height: me.height,
            link: me.link,

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
            lightOption: me.lightOption,

            linkButtonArray: me.linkButtonArray,
            textureButtonArray: me.textureButtonArray
        };
    }

    setMaterialOption(obj = {}, index = 0) {
        const me = this;

        const materialOption = new MaterialOption(obj);

        let i = 0;

        // traverse 로 검색되는 순서를 인덱스로 사용한다.
        me.object3D.traverse(function (obj) {
            if (obj.isMesh && obj.material && i == index) {
                const mtl = obj.material;

                for (let key in materialOption) {
                    if (mtl.hasOwnProperty(key)) {
                        me.__setMtlValue(key, mtl, materialOption[key]);
                    }
                }

                i++;
            }
        });

        me.materialOptions[index] = materialOption;
    }

    setMaterialOptions(options = {}) {
        const me = this;

        for (let index in options) {
            me.setMaterialOption(options[index], index);
        }
    }

    setLightOption(obj = {}) {
        const me = this;

        if (me.isLight) {
            me.lightOption = new LightOption(obj);

            me.object3D.traverse(function (obj) {
                if (obj instanceof THREE.SpotLight) {
                    let val;

                    for (let key in me.lightOption) {
                        val = me.lightOption[key];

                        if (key == 'color') {
                            val = new THREE.Color(val);
                        }

                        obj[key] = val;
                    }
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
                let mtlArr = [obj.material];

                if (Array.isArray(obj.material)) {
                    mtlArr = obj.material;
                }

                for (let i = 0; i < mtlArr.length; i++) {
                    mtlArr[i].transparent = true;
                    mtlArr[i].opacity = num;
                }
            }
        });
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

    syncMaterialMembers() {
        const me = this;

        const options = {};

        let i = 0;

        // traverse 로 검색되는 순서를 인덱스로 사용한다.
        me.object3D.traverse(function (obj) {
            if (obj.isMesh && obj.material) {
                const mtl = obj.material;
                const mtlOption = new MaterialOption();

                for (let key in mtl) {
                    if (mtlOption.hasOwnProperty(key)) {
                        me.__setMtlOptionValue(key, mtlOption, mtl[key]);
                    }
                }

                options[i] = mtlOption;

                i++;
            }
        });

        me.materialOptions = options;
    }

    clone() {
        const me = this;

        return new AssetItem(me);
    }

    __loadTexture(url) {
        return new Promise(function (resolve, reject) {
            const loader = new THREE.TextureLoader();

            loader.load(url, function (texture) {
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