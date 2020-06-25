class HistoryInfo {
    constructor (obj) {
        this.name = obj.name || '';
        this.redo = obj.redo || function () {};
        this.undo = obj.undo || function () {};
        this.onRedo = obj.onRedo || function () {};
        this.onUndo = obj.onUndo || function () {};
    }
}

export default class HistoryManager {
    constructor (app) {
        this.app = app;
        this.historyArr = [];
        this.cursor = -1;
        this.isLock = false;
    }

    lock() {
        const me = this;

        me.isLock = true;
    }

    unlock() {
        const me = this;

        me.isLock = false;
    }

    push(obj) {
        const me = this;

        if (!me.isLock) {
            me.historyArr = me.historyArr.slice(0, me.cursor + 1);
            me.historyArr.push(new HistoryInfo(obj));

            me.cursor = me.historyArr.length - 1;
        }
    }

    getHistory(cursor) {
        const me = this;

        cursor = (typeof cursor == 'number') ? cursor : me.cursor;

        return me.historyArr[cursor];
    }

    redo() {
        const me = this;

        me.lock();

        if (me.cursor < (me.historyArr.length - 1)) {
            me.cursor++;

            const historyInfo = me.historyArr[me.cursor];

            historyInfo.redo();
            historyInfo.onRedo();
        }

        me.unlock();
    }

    undo() {
        const me = this;

        me.lock();

        if (me.cursor > -1) {
            const historyInfo = me.historyArr[me.cursor];

            me.cursor--;

            historyInfo.undo();
            historyInfo.onUndo();
        }

        me.unlock();
    }
}