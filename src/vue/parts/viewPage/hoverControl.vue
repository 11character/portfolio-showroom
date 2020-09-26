<template>
    <div
        @mousedown="onPointerDown"
        @mouseup="onPointerUp"
        @mouseleave="onPointerUp"
        @mousemove="onPointerMove"
        @touchmove="onPointerMove"
        @touchstart="onPointerDown"
        @touchend="onPointerUp"
        class="hover-control-field disable-user-select">
            <div ref="pointer" class="control-pointer"></div>
    </div>
</template>

<script>
    /**
     * template event : control
     */
    export default {
        data: function () {
            return {
                isPointerDown: false,
                height: 120
            };
        },
        mounted: function () {
            const me = this;

            me.setPointerPosition(0);
        },
        methods: {
            setPointerPosition: function (y) {
                const me = this;

                const jPointer = $(me.$refs.pointer);

                const zeroY = me.height / 2;
                const top = zeroY - y - 15;

                jPointer.css('top', top);
            },
            onPointerDown: function () {
                const me = this;

                me.setPointerPosition(0);

                me.$emit('control', 0);

                me.isPointerDown = true;
            },
            onPointerMove: function (evt) {
                const me = this;

                if (me.isPointerDown) {
                    const halfH = me.height / 2
                    const zeroY = halfH;
                    const position = evt.currentTarget.getBoundingClientRect();

                    let offsetY;

                    if (evt.changedTouches && evt.changedTouches[0]) {
                        offsetY = zeroY - (evt.changedTouches[0].pageY - position.y);

                    } else {
                        offsetY = zeroY - (evt.pageY - position.y);
                    }

                    if (Math.abs(offsetY) > halfH) {
                        offsetY = halfH * Math.sign(offsetY);
                    }

                    me.setPointerPosition(offsetY);

                    me.$emit('control', offsetY);
                }
            },
            onPointerUp: function () {
                const me = this;

                me.setPointerPosition(0);

                me.$emit('control', 0);

                me.isPointerDown = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .hover-control-field {
        width: 30px;
        height: 120px;
        border-radius: 15px;
        position: relative;
        background-color: rgba(0, 0, 0, 0.5);

        .control-pointer {
            width: 30px;
            height: 30px;
            left: 0px;
            border-radius: 50%;
            position: absolute;
            background-color: #ffffff;
        }
    }
</style>