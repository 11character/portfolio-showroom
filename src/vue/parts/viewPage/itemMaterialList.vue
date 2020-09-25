<template>
    <div class="item-material-list-field disable-user-select">
        <div @mousedown="onPointerDown"
            @mousemove="onPointerMove"
            @mouseup="onPointerUp"
            @mouseleave="onPointerUp"
            @touchstart="onPointerDown"
            @touchmove="onPointerMove"
            @touchend="onPointerUp"
            ref="list"
            class="item-material-list">

            <div v-for="(button, i) in buttonArray" :key="i" class="texture-button">
                <img v-if="button.url" :src="button.url" :alt="i" @click="onClickMaterial(button)" class="texture-button-img">

                <div v-else @click="onClickMaterial(button)" class="texture-button-none-img">
                    <font-awesome-icon :icon="['fas', 'paint-brush']"></font-awesome-icon>&nbsp;{{ i + 1 }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MaterialOption from '../../../nemoShowroom/common/materialOption';
    import ImageButton from '../../../nemoShowroom/common/imageButton';

    export default {
        props: ['assetItem'],
        data: function () {
            return {
                buttonArray: [],
                isPointerDown: false,
                buttonTimeout: null,
                pointerX: 0,
                scrollX: 0
            };
        },
        watch: {
            assetItem: function (item) {
                const me = this;

                if (item) {
                    me.buttonArray = item.materialButtonArray;
                }
            }
        },
        methods: {
            onPointerDown: function (evt) {
                const me = this;

                if (evt.changedTouches && evt.changedTouches[0]) {
                    me.pointerX = evt.changedTouches[0].pageX;

                } else {
                    me.pointerX = evt.pageX;
                }

                me.scrollX = $(me.$refs.list).scrollLeft();

                me.isPointerDown = true;
            },
            onPointerMove: function (evt) {
                const me = this;

                clearTimeout(me.buttonTimeout);

                if (me.isPointerDown) {
                    let x;

                    if (evt.changedTouches && evt.changedTouches[0]) {
                        x = evt.changedTouches[0].pageX - me.pointerX;

                    } else {
                        x = (evt.pageX - me.pointerX);
                    }

                    const jList = $(me.$refs.list);
                    const scrollLeft = me.scrollX - x;

                    jList.scrollLeft(scrollLeft);
                }
            },
            onPointerUp: function () {
                const me = this;

                me.isPointerDown = false;
            },
            onClickMaterial: function (button) {
                const me = this;

                me.buttonTimeout = setTimeout(function () {
                    me.assetItem.setMaterialOptions(button.materialOptions);
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item-material-list-field {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;

        .disable-user-select {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .item-material-list {
            height: 100%;
            margin: 0px auto;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            overflow-x: hidden;
            padding: 0rem 1rem;

            .texture-button {
                width: 90px;
                min-width: 90px;
                height: 90px;
                border-radius: 50%;
                margin: 8px 16px;
                background-color: #000000;
                cursor: pointer;

                .texture-button-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }

                .texture-button-none-img {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #ffffff;
                    font-size: 1.5rem;
                }
            }

            .texture-button:hover {
                border: 3px solid #ffffff;
                background-color: transparent;
                border-width: 3px;
            }

            .texture-button:first-child {
                margin-left: 0rem;
            }

            .texture-button:last-child {
                margin-right: 0rem;
            }
        }
    }
</style>