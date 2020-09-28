<template>
    <div class="item-link-list-field">
        <div @mousedown="onPointerDown"
            @mousemove="onPointerMove"
            @mouseup="onPointerUp"
            @mouseleave="onPointerUp"
            @touchstart="onPointerDown"
            @touchmove="onPointerMove"
            @touchend="onPointerUp"
            ref="list"
            class="item-link-list">

            <div v-for="(button, i) in buttonArray" :key="i" class="link-button">
                <img v-if="button.url" :src="button.url" :alt="button.name" @click="onClickLink(button.link)" async>

                <div v-else @click="onClickLink(button.link)" class="none-img">
                    <font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon>&nbsp;{{ i + 1 }}
                </div>
            </div>
        </div>

        <div @click="onClickLeft" class="item-move-button item-move-left disable-user-select">
            <font-awesome-icon :icon="['fas', 'chevron-left']"></font-awesome-icon>
        </div>

        <div @click="onClickRight" class="item-move-button item-move-right disable-user-select">
            <font-awesome-icon :icon="['fas', 'chevron-right']"></font-awesome-icon>
        </div>
    </div>
</template>

<script>
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
                    me.buttonArray = item.linkButtonArray;

                } else {
                    me.buttonArray = [];
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
            onClickLeft: function () {
                const me = this;

                const jList = $(me.$refs.list);
                const left = jList.scrollLeft() - jList.width();

                jList.stop().animate({
                    scrollLeft: left
                }, 500);
            },
            onClickRight: function () {
                const me = this;

                const jList = $(me.$refs.list);
                const left = jList.scrollLeft() + jList.width();

                jList.stop().animate({
                    scrollLeft: left
                }, 500);
            },
            onClickLink: function (link) {
                const me = this;

                me.buttonTimeout = setTimeout(function () {
                    window.open(link);
                }, 200);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item-link-list-field {
        width: 100%;
        height: 100%;
        position: relative;

        .item-move-button {
            width: 36px;
            height: 100%;
            top: 0px;
            position: absolute;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 1.5rem;
        }

        .item-move-button:hover {
            background-color: rgba(0, 0, 0, 0.2);
        }

        .item-move-left {
            left: 0px;
        }

        .item-move-right {
            left: 100%;
            margin-left: -36px;
        }

        .item-link-list {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0px;
            top: 0px;
            display: flex;
            overflow-x: hidden;

            .link-button {
                width: 200px;
                min-width: 200px;
                height: 100%;
                cursor: pointer;

                img {
                    width: 100%;
                    height: 100%;
                }

                .none-img {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
</style>