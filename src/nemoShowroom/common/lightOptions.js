export default class LightOptions {
    constructor (obj = {}) {
        this.color = obj.color || 'rgb(255, 255, 255)';
        this.intensity = (typeof obj.intensity == 'number') ? obj.intensity : 1;
        this.distance = (typeof obj.distance == 'number') ? obj.distance : 0;
        this.decay = (typeof obj.decay == 'number') ? obj.decay : 1;
        this.castShadow = !!obj.castShadow;
        
        // SpotLight only.
        this.angle = (typeof obj.angle == 'number') ? obj.angle : Math.PI / 3;
        this.penumbra = (typeof obj.penumbra == 'number') ? obj.penumbra : 0;

        // RectAreaLight only.
        this.width = (typeof obj.width == 'number') ? obj.width : 10;
        this.height = (typeof obj.height == 'number') ? obj.height : 10;

        // HemisphereLight only.
        this.groundColor = obj.groundColor || 'rgb(64, 64, 64)';

        // shadow.
        this.shadow = {
            mapSize: {
                // width: (typeof obj.shadowMapSizeW == 'number') ? obj.shadowMapSizeW : 512,
                // height: (typeof obj.shadowMapSizeH == 'number') ? obj.shadowMapSizeH : 512
                // 값 고정.
                width: 2048,
                height: 2048
            },
            camera: {
                near: (typeof obj.shadowCameraNear == 'number') ? obj.shadowCameraNear : 0.5,
                far: (typeof obj.shadowCameraFar == 'number') ? obj.shadowCameraFar : 500,
                left: (typeof obj.shadowCameraLeft == 'number') ? obj.shadowCameraLeft : -5,
                right: (typeof obj.shadowCameraRight == 'number') ? obj.shadowCameraRight : 5,
                top: (typeof obj.shadowCameraTop == 'number') ? obj.shadowCameraTop : 5,
                bottom: (typeof obj.shadowCameraBottom == 'number') ? obj.shadowCameraBottom : -5,
            },
            bias: (typeof obj.shadowBias == 'number') ? obj.shadowBias : -0.001,
            Focus: (typeof obj.shadowFocus == 'number') ? obj.shadowFocus : 1 // shadow - SpotLight only.
        };
    }

    get shadowMapSizeW() {
        return this.shadow.mapSize.width;
    }
    get shadowMapSizeH() {
        return this.shadow.mapSize.height;
    }
    get shadowCameraNear() {
        return this.shadow.camera.near;
    }
    get shadowCameraFar() {
        return this.shadow.camera.far;
    }
    get shadowCameraLeft() {
        return this.shadow.camera.left
    }
    get shadowCameraRight() {
        return this.shadow.camera.right
    }
    get shadowCameraTop() {
        return this.shadow.camera.top
    }
    get shadowCameraBottom() {
        return this.shadow.camera.bottom
    }
    get shadowBias() {
        return this.shadow.bias;
    }
    get shadowFocus() {
        return this.shadow.Focus;
    }

    set shadowMapSizeW(val) {
        // this.shadow.mapSize.width = val;
    }
    set shadowMapSizeH(val) {
        // this.shadow.mapSize.height = val;
    }
    set shadowCameraNear(val) {
        this.shadow.camera.near = val;
    }
    set shadowCameraFar(val) {
        this.shadow.camera.far = val;
    }
    set shadowCameraLeft(val) {
        this.shadow.camera.left = val;
    }
    set shadowCameraRight(val) {
        this.shadow.camera.right = val;
    }
    set shadowCameraTop(val) {
        this.shadow.camera.top = val;
    }
    set shadowCameraBottom(val) {
        this.shadow.camera.bottom = val;
    }
    set shadowBias(val) {
        this.shadow.bias = val;
    }
    set shadowFocus(val) {
        this.shadow.Focus = val;
    }

    toJSON() {
        const me = this;

        return {
            color: me.color,
            intensity: me.intensity,
            distance: me.distance,
            decay: me.decay,
            castShadow: me.castShadow,

            angle: me.angle,
            penumbra: me.penumbra,

            width: me.width,
            height: me.height,

            groundColor: me.groundColor,

            shadowMapSizeW: me.shadowMapSizeW,
            shadowMapSizeH: me.shadowMapSizeH,
            shadowCameraNear: me.shadowCameraNear,
            shadowCameraFar: me.shadowCameraFar,
            shadowCameraLeft: me.shadowCameraLeft,
            shadowCameraRight: me.shadowCameraRight,
            shadowCameraTop: me.shadowCameraTop,
            shadowCameraBottom: me.shadowCameraBottom,
            shadowBias: me.shadowBias,
            shadowFocus: me.shadowFocus
        };
    }
}