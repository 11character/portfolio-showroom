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
     */
    intersect(object3DArr, offsetX, offsetY) {
        const me = this;

        const canvas = me.renderer.domElement;
        const x = (offsetX / canvas.width) * 2 - 1;
        const y = -(offsetY / canvas.height) * 2 + 1;

        me.mouseVector.set(x, y);
        me.raycaster.setFromCamera(me.mouseVector, me.camera);

        const arr = me.raycaster.intersectObjects(object3DArr, true);

        return (arr.length) ? arr[0].object : null;
    }
}