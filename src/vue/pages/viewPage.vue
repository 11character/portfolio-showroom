<template>
    <div class="view-page-field">

        <template v-if="isSmallWindow">
            <div :class="{'menu-button-view-mode': isFullScreen}" class="menu-button">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>

            <div :class="{'logo-view-mode': isFullScreen}" class="logo logo-sm"></div>
        </template>

        <template v-if="!isSmallWindow">
            <div :class="{'logo-view-mode': isFullScreen}" class="logo"></div>

            <div :class="{'showroom-button-field-sm': isSmallButton}" class="showroom-button-field">
                <!-- 설명 텍스트 -->
                <div :hidden="!isShowText" ref="textField" class="text-field">
                    <pre v-if="lang == 'ko'" class="font-neuemachina">{{ showroom.contentKo }}</pre>
                    <pre v-else class="font-neuemachina">{{ showroom.contentEn }}</pre>
                </div>
                <!-- END-설명 텍스트 -->

                <!-- 시작화면 -->
                <template v-if="!isSmallButton">
                    <div :class="{'showroom-button-n': isFullScreen}" @click="onClickShowroomLink" class="showroom-button disable-user-select font-neuemachina-ultrabold">
                        <div class="content">
                            <span>Selective Art Shop</span>
                            <br>
                            <span>Enter to Art Shop - Enter to Art Shop - Ent</span>
                        </div>
                    </div>

                    <div :class="{'showroom-button-n': isFullScreen}" @click="onClickShowroomText" ref="textButton" class="showroom-button disable-user-select font-neuemachina-ultrabold">
                        <div class="content">
                            <span>Selected Text:</span>
                            <br>
                            <span>Introduction / Artist Statement</span>
                        </div>

                        <div v-if="isShowText" class="icon">
                            <font-awesome-icon :icon="['fas', 'minus-square']"></font-awesome-icon>
                        </div>

                        <div v-else class="icon">
                            <font-awesome-icon :icon="['fas', 'plus-square']"></font-awesome-icon>
                        </div>
                    </div>
                </template>
                <!-- END-시작화면 -->

                <!-- 전체화면 -->
                <template v-if="isSmallButton">
                    <div @click="onClickShowroomLink" class="showroom-button-sm disable-user-select font-neuemachina-ultrabold">
                        <div class="content">
                            <span>Enter to Art Shop</span>
                        </div>
                    </div>

                    <div @click="onClickShowroomText" class="showroom-button-sm disable-user-select font-neuemachina-ultrabold">
                        <div class="content">
                            <span>Selected Text</span>
                        </div>

                        <div v-if="isShowText" class="icon">
                            <font-awesome-icon :icon="['fas', 'minus-square']"></font-awesome-icon>
                        </div>

                        <div v-else class="icon">
                            <font-awesome-icon :icon="['fas', 'plus-square']"></font-awesome-icon>
                        </div>
                    </div>
                </template>
                <!-- END-전체화면 -->
            </div>
        </template>

        <div ref="top" class="top">
            <div class="line"></div>
        </div>

        <div :class="{'center-full': isFullScreen, 'margin-x-0': isSmallWindow}" ref="center" class="center">
            <cover :hidden="isHiddenCover" :percent="loadingPercent" :img="showroom.imgUrl" @enter="onClickCover" class="cover"></cover>

            <div ref="viewField" class="view-field">
                <div v-if="isMobile && !isShowMaterialList" class="move-left-control">
                    <move-control @control="onControlMove"></move-control>
                </div>

                <div v-if="isMobile && !isShowMaterialList" class="move-right-control">
                    <hover-control @control="onControlHover"></hover-control>
                </div>

                <!-- 배경음악 -->
                <div v-if="!isSmallWindow && showroom.bgmUrl" :class="{'music-button-active': isPlayMusic}" @click="onClickMusic" class="music-button disable-user-select">
                    <div class="content font-neuemachina-ultrabold">
                        <span v-if="isPlayMusic">Music On</span>
                        <span v-else>Music Off</span>
                        <audio ref="bgm"></audio>
                    </div>
                </div>
                <!-- END-배경음악 -->

                <!-- 연관상품 -->
                <div @click="onClickShowList" ref="productButton" class="object-button disable-user-select">
                    <div class="button-content-field">
                        <div class="content font-neuemachina-ultrabold">
                            <span>Available Product</span>
                        </div>

                        <div class="icon">
                            <font-awesome-icon :icon="['fas', 'plus-square']"></font-awesome-icon>
                        </div>
                    </div>
                </div>

                <div :hidden="!isShowList" ref="listField" class="list-field">
                    <div @click="onClickHideList" class="list-header disable-user-select">
                        <div class="content font-neuemachina-ultrabold">
                            <span>Available Product List</span>
                        </div>

                        <div class="icon">
                            <font-awesome-icon :icon="['fas', 'minus-square']"></font-awesome-icon>
                        </div>
                    </div>

                    <div class="product-body">
                        <item-link-list :asset-item="selectedItem"></item-link-list>
                    </div>
                </div>
                <!-- END-연관상품 -->

                <div :hidden="!isShowMaterialList" ref="materialButtonField" class="material-button-field">
                    <item-material-list :asset-item="selectedItem"></item-material-list>
                </div>
            </div>
        </div>

        <div ref="bottom" class="bottom disable-user-select">
            <div class="content">
                <div class="text">{{ pageText[lang].bottom }}</div>

                <div @click="onClickLang" class="lang-button">KR / ENG</div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../class/apiUrl';
    import Utils from '../../class/utils';
    import Showroom from '../../class/showroom';

    import coverVue from '../parts/viewPage/cover.vue';
    import itemLinkListVue from '../parts/viewPage/itemLinkList.vue';
    import itemMaterialListVue from '../parts/viewPage/itemMaterialList.vue';
    import moveControlVue from '../parts/viewPage/moveControl.vue';
    import hoverControlVue from '../parts/viewPage/hoverControl.vue';

    import NemoShowroomViewer from '../../nemoShowroom/nemoShowroomViewer/nemoShowroomViewer';

    import checkMobile from 'is-mobile';

    export default {
        components: {
            'cover': coverVue,
            'item-link-list': itemLinkListVue,
            'item-material-list': itemMaterialListVue,
            'move-control': moveControlVue,
            'hover-control': hoverControlVue
        },
        props: ['id', 'lang'],
        data: function () {
            const me = this;

            return {
                pageText: window.PAGE_TEXT,
                showroom: new Showroom(),
                isShowText: false,
                isSmallButton: false,
                isFullScreen: false,
                isSmallWindow: false,
                isMobile: false,
                isPlayMusic: false,
                isShowList: false,
                isShowMaterialList: false,
                isHiddenCover: false,
                loadingPercent: 0,
                selectedItem: null,
                showroomViewer: new NemoShowroomViewer({
                    width: 100,
                    height: 100,
                    onClick: function (assetItem) {
                        me.selectedItem = assetItem;

                        if (assetItem && assetItem.materialButtonArray.length != 0) {
                            me.onClickShowMaterialButton();

                        } else {
                            me.onClickHideMaterialButton();
                        }

                        if (!assetItem || assetItem.linkButtonArray.length == 0) {
                            me.onClickHideList();
                        }
                    },
                    onLoadProgress: function (count, total, assetItem) {
                        me.loadingPercent = parseInt(count / total * 100, 10);
                    },
                    onLoad: function () {
                        me.loadingPercent = 100;
                    }
                })
            };
        },
        mounted: function () {
            const me = this;

            me.isMobile = checkMobile();

            // 뷰어 객체는 mounted 실행시 초기화 하여 자식 컴포넌트에 넘겨주려고 하면 오류가 발생한다.
            // data 초기화 후에 에디터의 위치를 이동하는 식으로 처리한다.
            me.$refs.viewField.appendChild(me.showroomViewer.rootEl);

            $(window).on('resize.view.page', function () {
                me.isSmallWindow = $(window).width() < 950;

                me.onResizeViewer();
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
            onResizeViewer: function () {
                const me = this;

                me.hideText();
                me.onClickHideList();
                me.onClickHideMaterialButton();

                const jWin = $(window);
                const jTop = $(me.$refs.top);
                const jCenter = $(me.$refs.center);
                const jBottom = $(me.$refs.bottom);
                const jViewField = $(me.$refs.viewField);

                let width = jWin.width();
                let height = jWin.height();

                if (!me.isFullScreen && !me.isSmallWindow) {
                    width = width - 36;
                }

                if (!me.isFullScreen) {
                    height = height - jTop.outerHeight() - jBottom.outerHeight() - 20;
                }

                jCenter.width(width).height(height);

                me.showroomViewer.resize(width, height);
            },
            onClickShowMaterialButton: function () {
                const me = this;

                const jButtonField = $(me.$refs.materialButtonField);
                const jWindow = $(window);

                let width = 700;
                let top = jWindow.height() - 138;

                if (jWindow.width() < 1160) {
                    width = jWindow.width() - 36;
                    top = top - 63;
                }

                let left = (jWindow.width() - width) / 2;

                jButtonField.width(width).css('top', top + 'px').css('left', left + 'px');

                me.isShowMaterialList = true;
            },
            onClickHideMaterialButton: function () {
                const me = this;

                me.isShowMaterialList = false;
            },
            showText: function () {
                const me = this;

                me.isSmallButton = false;

                setTimeout(function () {
                    const jButton = $(me.$refs.textButton);
                    const jText = $(me.$refs.textField);
                    const jWindow = $(window);

                    const position = jButton.position();

                    const width = jButton.width();
                    const top = jButton.outerHeight();
                    const left = position.left;

                    jText.width(width).css('top', top + 'px').css('left', left + 'px');

                    me.isShowText = true;
                }, 100);
            },
            hideText: function () {
                const me = this;

                me.isShowText = false;

                if (me.isFullScreen) {
                    me.isSmallButton = true;
                }
            },
            onClickShowroomText: function () {
                const me = this;

                if (me.isShowText) {
                    me.hideText();

                } else {
                    me.showText();
                }
            },
            onClickShowroomLink: function () {
                const me = this;

                if (me.showroom.link) {
                    window.open(me.showroom.link);
                }
            },
            onClickShowList: function () {
                const me = this;

                const jButton = $(me.$refs.productButton);
                const jListField = $(me.$refs.listField);
                const position = jButton.offset();
                const top = position.top - jListField.height() + jButton.height();

                // 전시장 설명 큰 버튼 폭에 맞춤.
                let width = 497;
                let left = position.left + jButton.width() - width - 1;

                if (me.isSmallWindow) {
                    width = jButton.width();
                    left = 18;
                }

                jListField.width(width).css('top', top + 'px').css('left', left + 'px');

                me.isShowList = true;
            },
            onClickHideList: function () {
                const me = this;

                me.isShowList = false;
            },
            onClickCover: function () {
                const me = this;

                me.isHiddenCover = true;
                me.isFullScreen = true;
                me.isSmallButton = true;

                me.onResizeViewer();
            },
            onClickMusic: function () {
                const me = this;

                const bgnEl = me.$refs.bgm;

                if (!me.isPlayMusic && me.showroom.bgmUrl) {
                    me.isPlayMusic = !me.isPlayMusic;

                    bgnEl.src = me.showroom.bgmUrl;
                    bgnEl.play();

                } else {
                    me.isPlayMusic = !me.isPlayMusic;
                    bgnEl.pause();
                    bgnEl.currentTime = 0;
                }
            },
            onClickLang: function () {
                const me = this;

                const lang = me.lang == 'ko' ? 'en' : 'ko';

                me.$router.push({name: 'view-lang', params:{id: me.id, lang: lang}});
            },
            onControlMove: function (info) {
                const me = this;

                const viewer = me.showroomViewer;

                viewer.moveStop();

                if (info.distance > 30) {
                    const deg = Utils.r2d(info.angle);

                    if (22.5 < deg && deg <= 67.5) {
                        viewer.moveForwardSwitch(true);
                        viewer.moveRightSwitch(true);

                    } else if (67.5 < deg && deg <= 112.5) {
                        viewer.moveRightSwitch(true);

                    } else if (112.5 < deg && deg <= 157.5) {
                        viewer.moveRightSwitch(true);
                        viewer.moveBackwardSwitch(true);

                    } else if (157.5 < deg && deg <= 202.5) {
                        viewer.moveBackwardSwitch(true);

                    } else if (202.5 < deg && deg <= 247.5) {
                        viewer.moveBackwardSwitch(true);
                        viewer.moveLeftSwitch(true);

                    } else if (247.5 < deg && deg <= 292.5) {
                        viewer.moveLeftSwitch(true);

                    } else if (292.5 < deg && deg <= 337.5) {
                        viewer.moveLeftSwitch(true);
                        viewer.moveForwardSwitch(true);

                    } else {
                        viewer.moveForwardSwitch(true);
                    }
                }
            },
            onControlHover: function (y) {
                const me = this;

                const viewer = me.showroomViewer;

                viewer.moveStop();

                if (y > 30) {
                    viewer.moveUpSwitch(true);

                } else if (y < -30) {
                    viewer.moveDownSwitch(true);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .view-page-field {
        width: 100vw;
        height: 100vh;
        background-color: #000000;

        .margin-x-0 {
            margin-left: 0px !important;
            margin-right: 0px !important;
        }

        .disable-user-select {
            cursor: default;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .logo {
            width: 97px;
            height: 60px;
            position: fixed;
            left: 18px;
            top: 18px;
            z-index: 4;
            background-image: url('../../../public/img/logo-n.png');
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100%;
        }

        .logo-sm {
            width: 87px;
            height: 54px;
            top: 18px;
            left: 100%;
            margin-left: -105px;
        }

        .logo-view-mode {
            background-image: url('../../../public/img/logo.png');
        }

        .menu-button {
            height: 90px;
            position: fixed;
            left: 18px;
            top: 0px;
            z-index: 4;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .bar {
                width: 30px;
                height: 3px;
                margin-bottom: 10px;
                background-color: #ffffff;
            }

            .bar:last-child {
                margin-bottom: 0px;
            }
        }

        .menu-button-view-mode .bar {
            background-color: #000000;
        }

        .showroom-button-field {
            position: fixed;
            left: 100%;
            top: 18px;
            margin-left: -830px;
            padding-right: 18px;
            z-index: 4;
            display: flex;
            justify-content: flex-end;

            .showroom-button {
                width: 397px;
                margin-right: 18px;
                padding: 0.5rem 1rem;
                color: #ffffff;
                background-color: #000000;
                border: 1px solid #ffffff;
                display: flex;
                justify-content: space-between;
                cursor: pointer;

                .icon {
                    width: 10%;
                    text-align: right;
                }
            }

            .showroom-button:last-child {
                margin-right: 0px;
            }

            .showroom-button-n {
                color:#000000;
                background-color: #ffffff;
                border-color: #000000;
            }

            .showroom-button-sm {
                width: 183px;
                margin-right: 18px;
                padding: 0.5rem 1rem;
                color: #ffffff;
                background-color: #000000;
                border: 1px solid #ffffff;
                display: flex;
                justify-content: space-between;
                cursor: pointer;

                .icon {
                    width: 10%;
                    text-align: right;
                }
            }

            .showroom-button-sm:last-child {
                margin-right: 0px;
            }

            .text-field {
                position: absolute;
                height: 30vh;
                min-height: 500px;
                padding: 16px;
                overflow-y: auto;
                background-color: #000000;
                border: 1px solid #ffffff;

                pre {
                    width: 100%;
                    white-space: pre-wrap;
                    color: #ffffff;
                }
            }
        }

        .showroom-button-field-sm {
            margin-left: -402px;
        }

        .top {
            width: 100%;
            height: 120px;
            padding: 0px 18px;
            padding-top: 102px;
            left: 0px;
            top: 0px;

            @media screen and (max-width: 950px) {
                height: 90px;
                padding: 0px;
            }

            .line {
                width: 100%;
                border-top: 1px solid #ffffff;

                @media screen and (max-width: 950px) {
                    display: none;
                }
            }
        }

        .center {
            margin: 0px 18px;
            width: 100%;
            overflow: hidden;
            position: relative;

            .cover {
                position: absolute;
                z-index: 3;
            }

            .view-field {
                left: 0px;
                top: 0px;

                .music-button {
                    width: 120px;
                    height: 45px;
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #ffffff;
                    background-color: #000000;
                    border: 1px solid #ffffff;
                    padding: 0.5rem 1rem;
                    left: 18px;
                    top: 100%;
                    margin-top: -63px;
                    cursor: pointer;
                    z-index: 2;

                    .content {
                        text-align: center;
                        overflow: hidden;
                        white-space:nowrap;
                        word-wrap:normal;
                        text-overflow:ellipsis;

                        audio {
                            display: none;
                        }
                    }
                }

                .music-button-active {
                    color: #000000;
                    border: 1px solid #000000;
                    background-color: #ffffff;
                }

                .object-button {
                    width: 210px;
                    height: 45px;
                    position: absolute;
                    left: 100%;
                    top: 100%;
                    margin-left: -228px;
                    margin-top: -63px;
                    cursor: pointer;
                    z-index: 2;

                    @media screen and (max-width: 950px) {
                        width: 100%;
                        left: 0px;
                        margin-left: 0px;
                        padding: 0px 18px;
                    }

                    .button-content-field {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        color: #ffffff;
                        background-color: #000000;
                        border: 1px solid #ffffff;
                        padding: 0.5rem 1rem;

                        @media screen and (max-width: 950px) {
                            .content {
                                width: 100%;
                                text-align: center;
                                font-size: 1.5rem;
                            }

                            .icon {
                                display: none;
                            }
                        }
                    }
                }

                .list-field {
                    position: absolute;
                    height: 245px;
                    overflow-y: auto;
                    font-weight: bold;
                    color: #000000;
                    background-color: #ffffff;
                    border: 1px solid #000000;
                    z-index: 2;

                    .list-header {
                        width: 100%;
                        height: 42px;
                        padding: 0rem 1rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 1.2rem;
                        cursor: pointer;

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

                    .product-body {
                        width: 100%;
                        height: 200px;
                    }
                }

                .material-button-field {
                    position: absolute;
                    z-index: 1;
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
            height: 37px;
            padding: 0px 18px;

            @media screen and (max-width: 950px) {
                padding: 0px;
            }

            .content {
                width: 100%;
                height: 100%;
                margin-top:18px;
                color: #ffffff;
                border-top: 1px solid #ffffff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.8rem;

                .lang-button {
                    cursor: pointer;
                }
            }
        }

        .move-left-control {
            position: absolute;
            left: 18px;
            top: 100%;
            margin-top: -220px;
            z-index: 1;
        }

        .move-right-control {
            position: absolute;
            left: 100%;
            top: 100%;
            margin-left: -48px;
            margin-top: -220px;
            z-index: 1;
        }
    }
</style>

<style lang="scss">
    // 화면에 표시되는 텍스트 아이템의 공통 스타일.
    @import "./assetItemText.scss";
</style>