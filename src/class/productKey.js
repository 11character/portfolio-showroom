export default class ProductKey {
    constructor (obj = {}) {
        this.seqId = obj.seqId || 0;
        this.productId = obj.productId || 0;
        this.productName = obj.productName || '';
        this.downloadKey = obj.downloadKey || '';
        this.downloadLink = obj.downloadLink || '';
        this.description = obj.description || '';
        this.endDate = obj.endDate || '';
        this.cDate = obj.cDate || '';
        this.uDate = obj.uDate || '';
        this.dDate = obj.dDate || '';
    }
}