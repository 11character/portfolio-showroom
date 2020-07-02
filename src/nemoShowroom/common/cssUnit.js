import * as THREE from 'three/build/three.module';

export default class CssUnit {
    constructor (assetItem) {
        this.assetItem = assetItem;
        this.ytPlayer = null;
        this.__cssObject3D = null;

        this.onReady = function () {};
    }

    get cssObject3D() {
        const me = this;

        return me.__cssObject3D;
    }

    set cssObject3D(css3D) {
        const me = this;

        css3D.children[0].matrixAutoUpdate = false;

        me.__cssObject3D = css3D;
    }

    // 에디터에서 지정한 위치, 크기, 방향은 CssRenderer.__add() 에서 로컬 위치로 세팅된 상태.
    // 로컬위치 내에서 3D아이템과 CSS아이템을 동기화 한다.
    update() {
        const me = this;

        const itemCss3D = me.__cssObject3D.children[0];

        if (itemCss3D) {
            const webglObject3D = me.assetItem.object3D;

            // object3D.parent를 확인하는 이유는 에디터에서 제거 되었을 때 처리를 위해서다. (실행취소로 복구될 수 있기 때문에 숨김처리를 한다.)
            if (me.assetItem.isVisible && webglObject3D.parent) {
                itemCss3D.matrix.copy(webglObject3D.matrix);

                if (me.assetItem.isSprite) {
                    itemCss3D.scale.copy(webglObject3D.scale);

                } else {
                    const mResolution = new THREE.Matrix4();

                    mResolution.set(
                        100000, 0, 0, 0,
                        0, 100000, 0, 0,
                        0, 0, 100000, 0,
                        0, 0, 0, 100000
                    );

                    itemCss3D.matrix.multiply(mResolution);
                }

                me.showCssObject3D();

            } else {
                me.hideCssObject3D();
            }
        }
    }

    showObject3D(callEvent = true) {
        const me = this;
        me.assetItem.show(callEvent);
    }

    hideObject3D(callEvent = true) {
        const me = this;
        me.assetItem.hide(callEvent);
    }

    showCssObject3D() {
        const me = this;
        me.__cssObject3D.children[0].element.style.visibility = '';
    }

    hideCssObject3D() {
        const me = this;
        me.__cssObject3D.children[0].element.style.visibility = 'hidden';
    }
}