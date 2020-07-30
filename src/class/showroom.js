export default class Showroom {
    constructor (obj = {}) {
        this.seqId = obj.seqId || 0;
        this.name = obj.name || '';
        this.description = obj.description || '';
        this.data = obj.data || '';
        this.cDate = obj.cDate || '';
        this.uDate = obj.uDate || '';
        this.dDate = obj.dDate || '';
    }

    validate () {
        const me = this;

        let message = '';

        if (me.name.length > 16) {
            message = '이름은 16글자를 넘을 수 없습니다.';
        }

        if (!me.name.length) {
            message = '이름은 필수입니다.';
        }

        return message;
    }
}