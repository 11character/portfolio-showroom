import * as THREE from 'three/build/three.module';

export default class MoveInfo {
    constructor (obj = {}) {
        this.moveForward = !!obj.moveForward;
        this.moveLeft = !!obj.moveLeft;
        this.moveBackward = !!obj.moveBackward;
        this.moveRight = !!obj.moveRight;
        this.moveUp = !!obj.moveUp;
        this.moveDown = !!obj.moveDown;
        this.velocity = obj.velocity || new THREE.Vector3(),
        this.direction = obj.direction || new THREE.Vector3(),
        this.speed = (typeof obj.speed == 'number') ? obj.speed : 50;
    }

    get isMove() {
        const me = this;

        return me.moveForward || me.moveLeft || me.moveBackward || me.moveRight || me.moveUp || me.moveDown;
    }

    offDirection() {
        const me = this;

        me.moveForward = false;
        me.moveLeft = false;
        me.moveBackward = false;
        me.moveRight = false;
        me.moveUp = false;
        me.moveDown = false;
    }
}