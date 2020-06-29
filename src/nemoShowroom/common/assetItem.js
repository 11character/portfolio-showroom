import * as THREE from 'three/build/three.module';

import Utils from '../../class/utils';
import * as StaticVariable from './staticVariable';

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
        this.isUsed = !!obj.isUsed;
        this.isLoaded = !!obj.isLoaded;
    }

    get isAnimation() {
        const me = this;

        return me.animationMixer && me.animationActions.length;
    }

    get isVisible() {
        const me = this;

        return (me.object3D) ? (me.object3D.visible) : false;
    }

    // 외부로 출력되는 JSON 값.
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

            isSprite: me.isSprite
        };
    }

    getBox3() {
        const me = this;

        return new THREE.Box3().setFromObject(me.object3D);
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

    syncMembers() {
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
}