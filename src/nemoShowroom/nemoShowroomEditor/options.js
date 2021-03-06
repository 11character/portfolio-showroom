export default class Options {
    constructor(obj = {}) {
        this.el = obj.el || document.body;
        this.width = obj.width || 800;
        this.height = obj.height || 600;

        this.onSelect = (typeof obj.onSelect == 'function') ? obj.onSelect : function () {};
        this.onDeselect = (typeof obj.onDeselect == 'function') ? obj.onDeselect : function () {};
        this.onMove = (typeof obj.onMove == 'function') ? obj.onMove : function () {};
        this.onLoad = (typeof obj.onLoad == 'function') ? obj.onLoad : function () {};
    }
}