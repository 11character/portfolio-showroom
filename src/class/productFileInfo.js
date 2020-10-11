export default class ProductFileInfo {
    constructor (obj = {}) {
        this.seqId = obj.seqId || 0;
        this.ext = obj.ext || '';
        this.name = obj.name || '';
        this.fullName = obj.fullName || '';
        this.dirPath = obj.dirPath || '';
        this.path = obj.path || '';
        this.size = obj.size || 0;
        this.description = obj.description || '';
        this.cDate = obj.cDate || '';
        this.uDate = obj.uDate || '';
        this.dDate = obj.dDate || '';
    }
}