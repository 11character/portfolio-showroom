export default class Options {
    constructor(obj = {}) {
        this.el = obj.el || document.body;
        this.mode = obj.mode || 'edit';
    }
}