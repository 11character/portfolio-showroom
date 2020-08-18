export default class SelectItem {
    constructor (obj = {}) {
        this.name = obj.name || '';
        this.value = obj.value || '';
    }
}