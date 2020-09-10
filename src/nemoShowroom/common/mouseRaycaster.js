import * as THREE from 'three/build/three.module';

export default class MouseRaycaster {
    constructor (renderer, camera) {
        this.raycaster = new THREE.Raycaster();
        this.renderer = renderer;
        this.camera = camera;
        this.mouseVector = new THREE.Vector2(-1, 1);
    }

    /**
     * 마우스 커서와 교차되는 가장 가까운 대상을 반환한다.
     * @param {Array} object3DArr 검사 대상이 들어가 있는 배열.
     * @param {Object} event 마우스(터치) 이벤트.
     */
    intersect(object3DArr, event) {
        const me = this;

        const pointerXY = me.getPointerXY(event);

        const canvas = me.renderer.domElement;
        const x = (pointerXY.x / canvas.width) * 2 - 1;
        const y = -(pointerXY.y / canvas.height) * 2 + 1;

        me.mouseVector.set(x, y);
        me.raycaster.setFromCamera(me.mouseVector, me.camera);

        const arr = me.raycaster.intersectObjects(object3DArr, true);

        return (arr.length) ? arr[0].object : null;
    }

    /**
     * 실제 계산에 사용되는 X Y 좌표.
     * @param {Object} event 마우스(터치) 이벤트.
     */
    getPointerXY(event) {
        const me = this;

        const pixelRatio = window.devicePixelRatio;

        let offsetX;
        let offsetY;

        if (event.changedTouches && event.changedTouches[0]) {
            // 터치는 offetX, offsetY를 제공하지 않는다.
            offsetX = (event.changedTouches[0].pageX - event.target.offsetLeft) * pixelRatio;
            offsetY = (event.changedTouches[0].pageY - event.target.offsetTop) * pixelRatio;

        } else {
            offsetX = event.offsetX * pixelRatio;
            offsetY = event.offsetY * pixelRatio;
        }

        return {
            x: offsetX,
            y: offsetY
        };
    }
}