<template>
    <div class="move-button-field">
        <div class="left-field">
            <div
                @mousedown="onPointerDownLeft"
                @mouseup="onPointerUpLeft"
                @mouseleave="onPointerUpLeft"
                @touchstart="onPointerDownLeft"
                @touchend="onPointerUpLeft"
                class="move-button move-button-left">
                    <font-awesome-icon :icon="['fas', 'arrow-left']"></font-awesome-icon>
            </div>
        </div>

        <div class="center-field">
            <div
                @mousedown="onPointerDownForward"
                @mouseup="onPointerUpForward"
                @mouseleave="onPointerUpForward"
                @touchstart="onPointerDownForward"
                @touchend="onPointerUpForward"
                class="move-button move-button-forward">
                    <font-awesome-icon :icon="['fas', 'arrow-up']"></font-awesome-icon>
            </div>

            <div
                @mousedown="onPointerDownBackward"
                @mouseup="onPointerUpBackward"
                @mouseleave="onPointerUpBackward"
                @touchstart="onPointerDownBackward"
                @touchend="onPointerUpBackward"
                class="move-button move-button-backward">
                    <font-awesome-icon :icon="['fas', 'arrow-down']"></font-awesome-icon>
            </div>
        </div>

        <div class="right-field">
            <div
                @mousedown="onPointerDownRight"
                @mouseup="onPointerUpRight"
                @mouseleave="onPointerUpRight"
                @touchstart="onPointerDownRight"
                @touchend="onPointerUpRight"
                class="move-button move-button-right">
                    <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon>
            </div>
        </div>
    </div>
</template>

<script>
    import NemoShowroomViewer from '../../../nemoShowroom/nemoShowroomViewer/nemoShowroomViewer';

    export default {
        props: {
            viewer: {type: NemoShowroomViewer}
        },
        methods: {
            onPointerDownForward: function () {
                const me = this;

                me.viewer.moveForwardSwitch(true);
            },
            onPointerUpForward: function () {
                const me = this;

                me.viewer.moveForwardSwitch(false);
            },
            onPointerDownBackward: function () {
                const me = this;

                me.viewer.moveBackwardSwitch(true);
            },
            onPointerUpBackward: function () {
                const me = this;

                me.viewer.moveBackwardSwitch(false);
            },
            onPointerDownLeft: function () {
                const me = this;

                me.viewer.moveLeftSwitch(true);
            },
            onPointerUpLeft: function () {
                const me = this;

                me.viewer.moveLeftSwitch(false);
            },
            onPointerDownRight: function () {
                const me = this;

                me.viewer.moveRightSwitch(true);
            },
            onPointerUpRight: function () {
                const me = this;

                me.viewer.moveRightSwitch(false);
            }
        }
    }
</script>

<style lang="scss">
    .move-button-field {
        width: 192px;
        display: flex;

        -ms-user-select: none;
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;

        .move-button {
            width: 50px;
            height: 50px;
            background-color: rgba(255, 255, 255, 0.5);
            border-radius: 0.25rem;
            margin-top: 16px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
        }

        .move-button:first-child {
            margin-top: 0px;
        }

        .left-field {
            width: 50px;
            margin-right: 16px;
            display: flex;
            align-items: center;
        }

        .center-field {
            width: 50px;
        }

        .right-field {
            width: 50px;
            margin-left: 16px;
            display: flex;
            align-items: center;
        }
    }
</style>