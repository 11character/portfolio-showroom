<template>
    <div class="root-field font-neuemachina">
        <div ref="top" class="top">
            <top-menu :showroom="showroom" ref="topMenu"></top-menu>
        </div>

        <div :class="centerStyle" ref="center">
            <cover :hidden="hiddenCover" :percent="loadingPercent" :img="showroom.imgUrl" @enter="onClickCover" class="cover"></cover>

            <div ref="viewField" class="view-field">
                <div class="cross-hair"></div>

                <div class="view-button music-button">
                    <div class="content">
                        <span>Music Off</span>
                    </div>
                </div>

                <div @click="showText" ref="textButton" class="view-button object-button">
                    <div class="content">
                        <span>Available Work</span>
                    </div>

                    <div class="icon">
                        <font-awesome-icon :icon="['fas', 'plus-square']"></font-awesome-icon>
                    </div>
                </div>

                <div :hidden="!isShowText" ref="textField" class="text-field">
                    <div @click="hideText" class="text-header">
                        <div class="content">
                            <span>Available Product List</span>
                        </div>

                        <div class="icon">
                            <font-awesome-icon :icon="['fas', 'minus-square']"></font-awesome-icon>
                        </div>
                    </div>

                    <div class="text-body">

                    </div>
                </div>
            </div>
        </div>

        <div ref="bottom" class="bottom">
            <div class="content">(주)예술고래 상회</div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../class/apiUrl';
    import Utils from '../../class/utils';
    import Showroom from '../../class/showroom';

    import topMenuVue from '../parts/viewPage/topMenu.vue';
    import coverVue from '../parts/viewPage/cover.vue';

    import NemoShowroomViewer from '../../nemoShowroom/nemoShowroomViewer/nemoShowroomViewer';

    export default {
        components: {
            'top-menu': topMenuVue,
            'cover': coverVue
        },
        props: ['id'],
        data: function () {
            const me = this;

            return {
                showroom: new Showroom(),
                isShowText: false,
                hiddenCover: false,
                loadingPercent: 0,
                showroomViewer: new NemoShowroomViewer({
                    width: 100,
                    height: 100,
                    onSelect: function (assetItem) {
                        console.log(assetItem.name);
                    },
                    onLoadProgress: function (count, total, assetItem) {
                        me.loadingPercent = parseInt(count / total * 100, 10);
                    },
                    onLoad: function () {
                        me.loadingPercent = 100;
                    }
                }),
                centerStyle: {
                    'center': true,
                    'center-full': false
                }
            };
        },
        mounted: function () {
            const me = this;

            // 뷰어 객체는 mounted 실행시 초기화 하여 자식 컴포넌트에 넘겨주려고 하면 오류가 발생한다.
            // data 초기화 후에 에디터의 위치를 이동하는 식으로 처리한다.
            me.$refs.viewField.appendChild(me.showroomViewer.rootEl);

            $(window).on('resize.view.page', function () {
                me.hideText();

                const jWin = $(window);
                const jTop = $(me.$refs.top);
                const jCenter = $(me.$refs.center);
                const jBottom = $(me.$refs.bottom);
                const jViewField = $(me.$refs.viewField);

                let w = jWin.outerWidth();
                let h = jWin.outerHeight();

                if (!me.centerStyle['center-full']) {
                    w = w - 36;
                    h = h - jTop.outerHeight() - jBottom.outerHeight() - 36;
                }

                jCenter.outerWidth(w).outerHeight(h);

                me.showroomViewer.resize(w, h);
            });

            Utils.apiRequest(ApiUrl.SHOWROOM_DATA, {seqId: me.id}).then(function (data) {
                // 뷰어의 위치가 변경되기를 기다렸다가 처리.
                setTimeout(function () {
                    $(window).trigger('resize.view.page');

                    if (data.data.length > 0) {
                        me.showroom = new Showroom(Utils.snakeObjToCamelObj(data.data[0]));

                        // 크기가 변경된 이후에 처리.
                        setTimeout(function () {
                            me.showroomViewer.openJson(me.showroom.data || '{}');
                        }, 50);
                    } else {
                        alert('해당 정보가 없습니다.');
                    }
                }, 50);
            });
        },
        beforeDestroy: function () {
            const me = this;

            me.showroomViewer.destroy();
            me.showroomViewer = null;

            $(window).off('resize.view.page');
        },
        methods: {
            showText: function () {
                const me = this;

                const jButton = $(me.$refs.textButton);
                const jText = $(me.$refs.textField);

                const position = jButton.offset();
                const top = position.top - jText.outerHeight() + jButton.outerHeight();
                const left = position.left - jText.outerWidth() + jButton.outerWidth();

                jText.css('top', top + 'px').css('left', left + 'px');

                me.isShowText = true;
            },
            hideText: function () {
                const me = this;

                me.isShowText = false;
            },
            onClickCover: function () {
                const me = this;

                me.centerStyle['center-full'] = true;

                $(window).trigger('resize.view.page');

                me.$refs.topMenu.hideText();
                me.$refs.topMenu.smallMode();

                me.hiddenCover = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
.root-field {
    .top {
        width: 100%;
        height: 108px;
        position: fixed;
        left: 0px;
        top: 0px;
        z-index: 3;
    }

    .center {
        margin: 108px 18px 0px 18px;
        width: 100%;
        overflow: hidden;
        position: relative;

        .cover {
            position: absolute;
            z-index: 2;
        }

        .view-field {
            left: 0px;
            top: 0px;

            .cross-hair {
                width: 0.5rem;
                height: 0.5rem;
                background-color: #ffffff;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -0.25rem;
                margin-left: -0.25rem;
                border-radius: 50%;
                z-index: 1;
            }

            .view-button {
                position: absolute;
                padding: 0px 1rem;
                color: #ffffff;
                background-color: #000000;
                border: 1px solid #ffffff;
                cursor: default;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                z-index: 1;
            }

            .music-button {
                left: 18px;
                top: 100%;
                margin-top: -42px;
            }

            .music-button:hover {
                color: #000000;
                border: 1px solid #000000;
                background-color: #ffffff;
            }

            .object-button {
                width: 210px;
                height: 45px;
                font-size: 0.5rem 1.2rem;
                padding: 0.5rem 1rem;
                font-weight: bold;
                left: 100%;
                top: 100%;
                margin-left: -228px;
                margin-top: -63px;
                display: flex;

                .content {
                    width: 90%;
                    overflow: hidden;
                    white-space:nowrap;
                    word-wrap:normal;
                    text-overflow:ellipsis;
                }

                .icon {
                    width: 10%;
                    text-align: right;
                }
            }

            .object-button:hover {
                color: #000000;
                border: 1px solid #000000;
                background-color: #ffffff;
            }

            .text-field {
                position: absolute;
                width: 500px;
                height: 400px;
                overflow-y: auto;
                font-weight: bold;
                color: #000000;
                background-color: #ffffff;
                border: 1px solid #000000;
                z-index: 1;

                .text-header {
                    width: 100%;
                    height: 42px;
                    padding: 0.5rem 1rem;
                    font-size: 1.2rem;
                    font-weight: bold;
                    border-bottom: 1px solid #000000;
                    cursor: default;
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    display: flex;

                    .content {
                        width: 90%;
                        overflow: hidden;
                        white-space:nowrap;
                        word-wrap:normal;
                        text-overflow:ellipsis;
                    }

                    .icon {
                        width: 10%;
                        text-align: right;
                    }
                }

                .text-body {
                    width: 100%;
                    height: 355px;
                }
            }
        }
    }

    .center-full {
        position: fixed;
        left:0px;
        top: 0px;
        margin: 0px;
        width: 100vw;
        height: 100vh;
    }

    .bottom {
        width: 100%;
        height: 37px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
        padding: 0px 18px;

        .content {
            width:100%;
            height: 10px;
            padding-top: 8px;
            border-top: 1px solid #000000;
            font-size: 0.6rem;
        }
    }
}
</style>

<style lang="scss">
    // 화면에 표시되는 텍스트 아이템의 공통 스타일.
    @import "./assetItemText.scss";
</style>