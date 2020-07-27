export default class Options {
    constructor(obj = {}) {
        this.el = obj.el || document.body;
        this.width = obj.width || 800;
        this.height = obj.height || 600;

        this.onSelect = (typeof obj.onSelect == 'function') ? obj.onSelect : function () {};
        this.onLoadProgress = (typeof obj.onLoadProgress == 'function') ? obj.onLoadProgress : function () {};
    }
}