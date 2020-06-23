export default class ObjectFile {
    constructor (obj = {}) {
        this.seqId = obj.seqId || 0;
        this.typeCode = obj.typeCode || 0;
        this.ext = obj.ext || '';
        this.name = obj.name || '';
        this.fullName = obj.fullName || '';
        this.dirPath = obj.dirPath || '';
        this.path = obj.path || '';
        this.dirUrl = obj.dirUrl || '';
        this.url = obj.url || '';
        this.size = obj.size || 0;
        this.memo = obj.memo || '';
        this.cDate = obj.cDate || '';
        this.uDate = obj.uDate || '';
        this.dDate = obj.dDate || '';
    }
}