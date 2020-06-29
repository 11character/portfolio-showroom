export default class AssetItemManager {
    constructor () {
        const me = this;

        me.__items = {};
        me.__removedItems = {};
    }

    add(assetItem) {
        const me = this;

        me.__items[assetItem.id] = assetItem;

        if (me.__removedItems[assetItem.id]) {
            delete me.__removedItems[assetItem.id];
        }
    }

    addArray(arr) {
        const me = this;

        for (let i = 0; i < arr.length; i++) {
            me.add(arr[i]);
        }
    }

    remove(id) {
        const me = this;

        const item = me.__items[id];

        if (item) {
            delete me.__items[id];

            item.onHide();

            me.__removedItems[id] = item;
        }

        return me.__removedItems[id];
    }

    removeAll() {
        const me = this;

        let item;

        for (let key in me.__items) {
            if (me.__items.hasOwnProperty(key)) {
                item = me.__items[key];

                item.onHide();

                me.__removedItems[key] = item;
            }
        }

        me.__items = {};
    }

    recover(id) {
        const me = this;

        const item = me.__removedItems[id];

        if (item) {
            delete me.__removedItems[id];

            item.onShow();

            me.__items[id] = item;
        }

        return me.__items[id];
    }

    getItemByObject3D(object3D) {
        const me = this;

        let item = null;

        for (let key in me.__items) {
            if (me.__items.hasOwnProperty(key) && me.__items[key].object3D === object3D) {
                item = me.__items[key];
                break;
            }
        }

        return item;
    }

    getItemByName(name) {
        const me = this;
        
        let item = null;

        if (name) {
            for (let key in me.__items) {
                if (me.__items.hasOwnProperty(key) && me.__items[key].name == name) {
                    item = me.__items[key];
                    break;
                }
            }
        }

        return item;
    }

    getItemArray() {
        const me = this;

        const arr = [];

        for (let key in me.__items) {
            if (me.__items.hasOwnProperty(key)) {
                arr.push(me.__items[key]);
            }
        }

        return arr;
    }

    animationUpdate(clockDelta) {
        const me = this;

        let item;

        for (let key in me.__items) {
            if (me.__items.hasOwnProperty(key)) {
                item = me.__items[key];

                if (item.isAnimation) {
                    item.animationUpdate(clockDelta);
                }
            }
        }
    }
}