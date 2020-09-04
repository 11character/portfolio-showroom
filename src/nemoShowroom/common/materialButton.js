import MaterialOption from "./materialOption";

export default class MaterialButton {
    constructor (obj = {}) {
        this.name = obj.name || '';
        this.url = obj.url || '';

        this.materialOptions = {};
        if (obj.materialOptions) {
            for (let index in obj.materialOptions) {
                this.materialOptions[index] = new MaterialOption(obj.materialOptions[index]);
            }
        }
    }
}