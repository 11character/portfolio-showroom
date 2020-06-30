import AssetItem from '../common/assetItem';

export default class TransformHistory {
    constructor (current, prev, next) {
        this.currentItem = current;
        this.prevItem = new AssetItem(prev);
        this.nextItem = new AssetItem(next);
    }

    setCurrentItem(item) {
        this.currentItem = item;
    }

    setPrevItem(item) {
        this.prevItem = new AssetItem(item);
    }

    setNextItem(item) {
        this.nextItem = new AssetItem(item);
    }
}