export default class Options {
    constructor(obj = {}) {
        this.el = obj.el || document.body;
        this.width = obj.width || 800;
        this.height = obj.height || 600;
        this.autoStart = (typeof obj.autoStart == 'boolean') ? obj.autoStart : true;
        this.centerFocus = !!obj.centerFocus;

        this.onClick = (typeof obj.onClick == 'function') ? obj.onClick : function () {};
        this.onMoveCamera = (typeof obj.onMoveCamera == 'function') ? obj.onMoveCamera : function () {};
        this.onLoadProgress = (typeof obj.onLoadProgress == 'function') ? obj.onLoadProgress : function () {};
        this.onLoad = (typeof obj.onLoad == 'function') ? obj.onLoad : function () {};
    }
}