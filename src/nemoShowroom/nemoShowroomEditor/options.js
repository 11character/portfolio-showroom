export default class Options {
    constructor(obj = {}) {
        this.el = obj.el || document.body;
        this.mode = obj.mode || 'edit';

        this.onSelect = (typeof obj.onSelect == 'function') ? obj.onSelect : function () {};
        this.onDeselect = (typeof obj.onDeselect == 'function') ? obj.onDeselect : function () {};
        this.onMove = (typeof obj.onMove == 'function') ? obj.onMove : function () {};
    }
}