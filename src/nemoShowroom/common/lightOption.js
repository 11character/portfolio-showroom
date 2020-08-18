export default class LightOption {
    constructor (obj = {}) {
        this.intensity = (typeof obj.intensity == 'number') ? obj.intensity : 1;
    }
}