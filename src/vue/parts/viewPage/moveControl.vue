<template>
    <div
        @mousedown="onPointerDown"
        @mouseup="onPointerUp"
        @mouseleave="onPointerUp"
        @mousemove="onPointerMove"
        @touchmove="onPointerMove"
        @touchstart="onPointerDown"
        @touchend="onPointerUp"
        class="move-control-field">
            <div ref="pointer" class="control-pointer"></div>
    </div>
</template>

<script>
    const Math = window.Math;

    /**
     * template event : control
     */
    export default {
        data: function () {
            return {
                isPointerDown: false,
                radius: 60,
                width: 120,
                height: 120
            };
        },
        mounted: function () {
            const me = this;

            me.setPointerPosition(0, 0);
        },
        methods: {
            setPointerPosition: function (x, y) {
                const me = this;

                const jPointer = $(me.$refs.pointer);

                const zeroX = me.width / 2;
                const zeroY = me.height / 2;

                const left = zeroX + x - 16;
                const top = zeroY - y - 16;

                jPointer.css('left', left).css('top', top);
            },
            onPointerDown: function () {
                const me = this;

                me.setPointerPosition(0, 0);

                me.$emit('control', {
                    distance: 0,
                    angle: 0
                });

                me.isPointerDown = true;
            },
            onPointerMove: function (evt) {
                const me = this;

                if (me.isPointerDown) {
                    const zeroX = me.width / 2;
                    const zeroY = me.height / 2;
                    const position = evt.currentTarget.getBoundingClientRect();

                    let offsetX;
                    let offsetY;

                    if (evt.changedTouches && evt.changedTouches[0]) {
                        offsetX = (evt.changedTouches[0].pageX - position.x) - zeroX;
                        offsetY = zeroY - (evt.changedTouches[0].pageY - position.y);

                    } else {
                        offsetX = (evt.pageX - position.x) - zeroX;
                        offsetY = zeroY - (evt.pageY - position.y);
                    }

                    const distance = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
                    const signX = Math.sign(offsetX);

                    let rad = Math.atan(offsetY / offsetX);

                    if (distance > me.radius) {
                        offsetX = Math.cos(rad) * me.radius * signX;
                        offsetY = Math.sin(rad) * me.radius * signX;
                    }

                    rad = (Math.PI / 2) - rad;

                    if (signX < 0) {
                        rad = Math.PI + rad;
                    }

                    me.setPointerPosition(offsetX, offsetY);

                    me.$emit('control', {
                        distance: distance,
                        angle: rad
                    });
                }
            },
            onPointerUp: function () {
                const me = this;

                me.setPointerPosition(0, 0);

                me.$emit('control', {
                    distance: 0,
                    angle: 0
                });

                me.isPointerDown = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .move-control-field {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        position: relative;
        background-color: rgba(0, 0, 0, 0.5);

        -ms-user-select: none;
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;

        .control-pointer {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            position: absolute;
            background-color: #ffffff;
        }
    }
</style>