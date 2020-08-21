export default class LightOption {
    constructor (obj = {}) {
        this.intensity = (typeof obj.intensity == 'number') ? obj.intensity : 1;
        this.penumbra = (typeof obj.penumbra == 'number') ? obj.penumbra : 0;
        this.angle = (typeof obj.angle == 'number') ? obj.angle : Math.PI / 3;
        this.distance = (typeof obj.distance == 'number') ? obj.distance : 0;
        this.decay = (typeof obj.decay == 'number') ? obj.decay : 1;
        this.color = obj.color || 'rgb(255, 255, 255)';
    }
}