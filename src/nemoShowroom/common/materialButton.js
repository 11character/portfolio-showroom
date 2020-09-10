import MaterialOption from "./materialOption";

export default class MaterialButton {
    constructor (obj = {}) {
        this.name = obj.name || '';
        this.url = obj.url || '';

        this.materialOptions = {};
        if (obj.materialOptions) {
            for (let id in obj.materialOptions) {
                this.materialOptions[id] = new MaterialOption(obj.materialOptions[id]);
            }
        }
    }
}