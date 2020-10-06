<template>
    <div class="view-page-field">
        <youtube-view-modal @hidden="onHiddenYoutubeModal" ref="youtubeViewModal"></youtube-view-modal>

        <div :class="{'logo-view-mode': isFullScreen, 'logo-sm': isSmallWindow}" class="logo"></div>

        <!-- small window -->
        <template v-if="isSmallWindow">
            <div :class="{'menu-open-view-mode': isFullScreen}" @click="onClickMenuOpen" class="menu-open-button disable-user-select">
                <div class="box">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
            </div>

            <!-- 메뉴모달 -->
            <div :hidden="!isShowMenu" class="menu-field">
                <!-- 상단 -->
                <div ref="menuTop" class="menu-top">
                    <div class="menu-top-logo"></div>

                    <div @click="onClickHideMenu" class="menu-close-button disable-user-select">
                        <div class="box">
                            <div class="bar"></div>
                            <div class="bar"></div>
                        </div>
                    </div>
                </div>
                <!-- END-상단 -->

                <!-- 내용 -->
                <div :hidden="isShowInfo" class="menu-center disable-user-select">
                    <div @click="onClickShopLink" class="menu-item">
                        <div class="content font-showroom-bold">
                            <span>Shop</span>
                        </div>
                    </div>

                    <div @click="onClickShowroomInfo" class="menu-item">
                        <div class="content font-showroom-bold">
                            <span>Info</span>
                        </div>
                    </div>

                    <div v-if="showroom.bgmUrl" :class="{'menu-item-n': isPlayMusic}" @click="onClickMusic" class="menu-item">
                        <!-- 배경음악 -->
                        <div class="content font-showroom-bold">
                            <span v-if="isPlayMusic">Music On</span>
                            <span v-else>Music Off</span>
                            <audio ref="bgm"></audio>
                        </div>
                        <!-- END-배경음악 -->
                    </div>
                </div>
                <!-- END-내용 -->

                <!-- 설명 텍스트 -->
                <div :hidden="!isShowInfo" ref="menuInfoField" class="menu-info-field font-showroom">
                    <pre v-if="lang == 'ko'">{{ showroom.contentKo }}</pre>
                    <pre v-else>{{ showroom.contentEn }}</pre>
                </div>
                <!-- END-설명 텍스트 -->
            </div>
            <!-- END-메뉴모달 -->
        </template>
        <!-- END-small window -->

        <!-- default window -->
        <template v-if="!isSmallWindow">
            <div :class="{'showroom-button-field-sm': isSmallButton}" class="showroom-button-field">
                <!-- 설명 텍스트 -->
                <div :hidden="!isShowInfo" ref="infoField" class="info-field font-showroom">
                    <pre v-if="lang == 'ko'">{{ showroom.contentKo }}</pre>
                    <pre v-else>{{ showroom.contentEn }}</pre>
                </div>
                <!-- END-설명 텍스트 -->

                <!-- 시작화면 -->
                <template v-if="!isSmallButton">
                    <div :class="{'showroom-button-n': isFullScreen}" @click="onClickShopLink" class="showroom-button disable-user-select font-showroom-bold">
                        <div class="content">
                            <span>Selective Art Shop</span>
                            <br>
                            <text-slider class="text-slider">
                                <span>Enter to Art Shop&nbsp;&nbsp;&nbsp;-</span>
                            </text-slider>
                        </div>
                    </div>

                    <div :class="{'showroom-button-n': isFullScreen}" @click="onClickShowroomInfo" ref="textButton" class="showroom-button disable-user-select font-showroom-bold">
                        <div class="content">
                            <span>Selected Text:</span>
                            <br>
                            <span>Introduction / Artist Statement</span>
                        </div>

                        <div v-if="isShowInfo" class="icon">
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
                    <div @click="onClickShopLink" class="showroom-button-sm disable-user-select font-showroom-bold">
                        <div class="content">
                            <span>Enter to Art Shop</span>
                        </div>
                    </div>

                    <div @click="onClickShowroomInfo" class="showroom-button-sm disable-user-select font-showroom-bold">
                        <div class="content">
                            <span>Selected Text</span>
                        </div>

                        <div v-if="isShowInfo" class="icon">
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
        <!-- END-default window -->

        <div ref="top" class="top">
            <div class="line"></div>
        </div>

        <div :class="{'center-full': isFullScreen, 'margin-x-0': isSmallWindow}" ref="center" class="center">
            <cover :hidden="isHiddenCover" :percent="loadingPercent" :img="showroom.imgUrl" @enter="onClickCover" class="cover"></cover>

            <div ref="viewField" class="view-field disable-user-select">
                <div v-if="isMobile && !isShowMaterialList" class="move-left-control">
                    <move-control @control="onControlMove"></move-control>
                </div>

                <div v-if="isMobile && !isShowMaterialList" class="move-right-control">
                    <hover-control @control="onControlHover"></hover-control>
                </div>

                <!-- 배경음악 -->
                <div v-if="!isSmallWindow && showroom.bgmUrl" :class="{'music-button-active': isPlayMusic}" @click="onClickMusic" class="music-button">
                    <div class="content font-showroom-bold">
                        <span v-if="isPlayMusic">Music On</span>
                        <span v-else>Music Off</span>
                        <audio ref="bgm"></audio>
                    </div>
                </div>
                <!-- END-배경음악 -->

                <!-- 연관상품 -->
                <div @click="onClickShowProduct" ref="productButton" class="product-button">
                    <div class="button-content-field">
                        <div class="content font-showroom-bold">
                            <span>Available Product</span>
                        </div>

                        <div class="icon">
                            <font-awesome-icon :icon="['fas', 'plus-square']"></font-awesome-icon>
                        </div>
                    </div>
                </div>

                <div :hidden="!isShowProduct" ref="productField" class="product-field">
                    <div @click="onClickHideProduct" class="product-header">
                        <div class="content font-showroom-bold">
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
                <div class="text">{{ pageText[lang].bottom1 }}</div>
                <div class="text">{{ pageText[lang].bottom2 }}</div>
                <div @click="onClickLang" class="lang-button">KR / ENG</div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as StaticVariable from '../../nemoShowroom/common/staticVariable';
    import * as ApiUrl from '../../class/apiUrl';
    import Utils from '../../class/utils';
    import Showroom from '../../class/showroom';

    import coverVue from '../parts/viewPage/cover.vue';
    import itemLinkListVue from '../parts/viewPage/itemLinkList.vue';
    import itemMaterialListVue from '../parts/viewPage/itemMaterialList.vue';
    import moveControlVue from '../parts/viewPage/moveControl.vue';
    import hoverControlVue from '../parts/viewPage/hoverControl.vue';
    import textSliderVue from '../parts/textSlider.vue';
    import youtubeViewModalVue from '../parts/viewPage/youtubeViewModal.vue';

    import NemoShowroomViewer from '../../nemoShowroom/nemoShowroomViewer/nemoShowroomViewer';

    import checkMobile from 'is-mobile';

    export default {
        components: {
            'cover': coverVue,
            'item-link-list': itemLinkListVue,
            'item-material-list': itemMaterialListVue,
            'move-control': moveControlVue,
            'hover-control': hoverControlVue,
            'text-slider': textSliderVue,
            'youtube-view-modal': youtubeViewModalVue
        },
        props: ['id', 'lang'],
        data: function () {
            const me = this;

            let youtubeTimeout;

            return {
                pageText: {ko: {}, en: {}},
                showroom: new Showroom(),
                isShowMenu: false,
                isShowInfo: false,
                isSmallButton: false,
                isFullScreen: false,
                isSmallWindow: false,
                isMobile: false,
                isPlayMusic: false,
                isShowProduct: false,
                isShowMaterialList: false,
                isHiddenCover: false,
                loadingPercent: 0,
                selectedItem: null,
                mobileWidth: 1090,
                showroomViewer: new NemoShowroomViewer({
                    width: 100,
                    height: 100,
                    autoStart: false,
                    onClick: function (assetItem) {
                        me.selectedItem = assetItem;

                        if (assetItem && assetItem.materialButtonArray.length != 0) {
                            me.onClickShowMaterialButton();

                        } else {
                            me.onClickHideMaterialButton();
                        }

                        if (assetItem && assetItem.linkButtonArray.length) {
                            me.onClickShowProduct();

                        } else {
                            me.onClickHideProduct();
                        }

                        if (assetItem && assetItem.type == StaticVariable.ITEM_TYPE_YOUTUBE) {
                            youtubeTimeout = setTimeout(me.onClickYoutube, 500);
                        }
                    },
                    onMoveCamera: function () {
                        clearTimeout(youtubeTimeout);
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

            me.loadPageText();

            me.isMobile = checkMobile();

            me.showroomViewer.centerFocus(me.isMobile);

            // 뷰어 객체는 mounted 실행시 초기화 하여 자식 컴포넌트에 넘겨주려고 하면 오류가 발생한다.
            // data 초기화 후에 에디터의 위치를 이동하는 식으로 처리한다.
            me.$refs.viewField.appendChild(me.showroomViewer.rootEl);

            $(window).on('resize.view.page', function () {
                const bool = $(window).width() < me.mobileWidth;

                // 모바일 화면으로 전환시 꺼지는 음악을 다시 켠다.
                if (bool != me.isSmallWindow) {
                    setTimeout(function () {
                        me.onClickMusic(me.isPlayMusic);
                    }, 100);
                }

                me.isSmallWindow = bool;

                me.onResizeViewer();
            });

            let promise;

            if (me.id == 0) {
                promise = Utils.apiRequest(ApiUrl.MAIN_SHOWROOM_DATA);
            } else {

                promise = Utils.apiRequest(ApiUrl.SHOWROOM_DATA, {seqId: me.id});
            }

            promise.then(function (data) {
                // 뷰어의 위치가 변경되기를 기다렸다가 처리.
                setTimeout(function () {
                    $(window).trigger('resize.view.page');

                    if (data.data.length > 0) {
                        me.showroom = new Showroom(Utils.snakeObjToCamelObj(data.data[0]));

                        // 크기가 변경된 이후에 처리.
                        setTimeout(function () {
                            me.showroomViewer.openJson(me.showroom.data || '{}');
                        }, 1000);

                    } else {
                        me.$router.replace({name: 'empty'});
                    }
                }, 50);
            });

            // 모바일 브라우저 확대, 축소, 어색한 조작 방지.
            $(me.$el).on('touchmove.view.page', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            });
        },
        beforeDestroy: function () {
            const me = this;

            me.showroomViewer.destroy();
            me.showroomViewer = null;

            $(window).off('resize.view.page');
            $(me.$el).off('touchmove.view.page');
        },
        methods: {
            loadPageText: function () {
                const me = this;

                Utils.apiRequest(ApiUrl.PAGE_TEXT).then(function (data) {
                    if (data.code == 0) {
                        me.pageText = data.data;
                    }
                });
            },
            onClickMenuOpen: function () {
                const me = this;

                $(me.$refs.menuInfoField).height($(window).height() - $(me.$refs.menuTop).height());

                me.isShowMenu = true;
            },
            onClickHideMenu: function () {
                const me = this;

                if (me.isShowInfo) {
                    me.hideInfo();
                }

                me.isShowMenu = false;
            },
            onResizeViewer: function () {
                const me = this;

                me.hideInfo();
                me.onClickHideMenu();
                me.onClickHideProduct();
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
                    height = height - jTop.outerHeight() - jBottom.outerHeight();
                }

                jCenter.width(width).height(height);

                me.showroomViewer.resize(width, height);
            },
            onClickShowMaterialButton: function () {
                const me = this;

                const jWindow = $(window);
                const jButtonField = $(me.$refs.materialButtonField);

                let width = 700;
                let top = jWindow.height() - 141;

                if (jWindow.width() < me.mobileWidth) {
                    const jProductButton = $(me.$refs.productButton);

                    width = jWindow.width() - 36;
                    top = top - jProductButton.outerHeight();
                }

                let left = (jWindow.width() - width) / 2;

                jButtonField.width(width).css('top', top + 'px').css('left', left + 'px');

                me.isShowMaterialList = true;
            },
            onClickHideMaterialButton: function () {
                const me = this;

                me.isShowMaterialList = false;
            },
            showInfo: function () {
                const me = this;

                if (me.isSmallWindow) {
                    me.isShowInfo = true;

                } else {
                    me.isSmallButton = false;

                    setTimeout(function () {
                        const jButton = $(me.$refs.textButton);
                        const jText = $(me.$refs.infoField);
                        const jWindow = $(window);

                        const position = jButton.position();

                        const width = jButton.width();
                        const top = jButton.outerHeight();
                        const left = position.left;

                        jText.width(width).css('top', top + 'px').css('left', left + 'px');

                        me.isShowInfo = true;
                    }, 100);
                }
            },
            hideInfo: function () {
                const me = this;

                me.isShowInfo = false;

                if (me.isFullScreen) {
                    me.isSmallButton = true;
                }
            },
            onClickShowroomInfo: function () {
                const me = this;

                if (me.isShowInfo) {
                    me.hideInfo();

                } else {
                    me.showInfo();
                }
            },
            onClickShopLink: function () {
                const me = this;

                if (me.showroom.link) {
                    window.open(me.showroom.link);
                }
            },
            onClickShowProduct: function () {
                const me = this;

                if (me.selectedItem && me.selectedItem.linkButtonArray.length) {
                    const jButton = $(me.$refs.productButton);
                    const jProductField = $(me.$refs.productField);
                    const position = jButton.offset();
                    const top = position.top - jProductField.outerHeight() + jButton.outerHeight();

                    // 전시장 설명 큰 버튼 폭에 맞춤.
                    let width = 497;
                    let left = position.left + jButton.width() - width - 1;

                    if (me.isSmallWindow) {
                        width = jButton.width();
                        left = 18;
                    }

                    jProductField.width(width).css('top', top + 'px').css('left', left + 'px');

                    me.isShowProduct = true;
                }
            },
            onClickHideProduct: function () {
                const me = this;

                me.isShowProduct = false;
            },
            onClickCover: function () {
                const me = this;

                me.isHiddenCover = true;
                me.isFullScreen = true;
                me.isSmallButton = true;

                me.onClickMusic();
                me.onResizeViewer();

                me.showroomViewer.start();
            },
            onClickMusic: function (bool) {
                const me = this;

                const bgnEl = me.$refs.bgm;

                if (me.showroom.bgmUrl) {
                    if (typeof bool == 'boolean') {
                        me.isPlayMusic = !bool;
                    }

                    if (!me.isPlayMusic) {
                        bgnEl.loop = true;
                        bgnEl.src = me.showroom.bgmUrl;
                        bgnEl.play();

                    } else {
                        bgnEl.pause();
                        bgnEl.currentTime = 0;
                    }

                    me.isPlayMusic = !me.isPlayMusic;
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
            },
            onClickYoutube: function () {
                const me = this;

                if (me.selectedItem && me.selectedItem.type == StaticVariable.ITEM_TYPE_YOUTUBE) {
                    const index = me.selectedItem.content.lastIndexOf('/');

                    let youtubeId = me.selectedItem.content;

                    if (index > -1) {
                        youtubeId = youtubeId.substring(index + 1);
                    }

                    me.$refs.youtubeViewModal.open(youtubeId);

                    me.showroomViewer.cssRenderer.pauseYoutube();
                    me.onClickMusic(false);
                }
            },
            onHiddenYoutubeModal: function () {
                const me = this;

                me.showroomViewer.cssRenderer.playYoutube();
                me.onClickMusic(true);
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
            left: 18px;
        }

        .logo-view-mode {
            background-image: url('../../../public/img/logo.png');
        }

        .menu-open-button {
            width: 35px;
            height: 90px;
            position: fixed;
            left: 100%;
            top: 0px;
            margin-left: -53px;
            z-index: 4;
            display: flex;
            align-items: center;

            .box {
                width: 35px;
                height: 45px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                cursor: pointer;

                .bar {
                    width: 100%;
                    height: 2px;
                    background-color: #ffffff;
                }
            }
        }

        .menu-open-view-mode .box .bar {
            height: 3px;
            background-color: #000000;
        }

        .menu-field {
            width: 100vw;
            height: 100vh;
            position: fixed;
            left: 0px;
            top: 0px;
            z-index: 5;
            background-color: #ffffff;

            .menu-top {
                width: 100%;
                height: 90px;
                position: relative;
                border-bottom: 2px solid #000000;

                .menu-top-logo {
                    width: 87px;
                    height: 54px;
                    position: absolute;
                    top: 18px;
                    left: 18px;
                    background-image: url('../../../public/img/logo.png');
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: 100%;
                }

                .menu-close-button {
                    width: 35px;
                    height: 90px;
                    position: absolute;
                    left: 100%;
                    top: 0px;
                    margin-left: -53px;
                    display: flex;
                    align-items: center;

                    .box {
                        width: 35px;
                        height: 35px;
                        position: relative;
                        cursor: pointer;

                        .bar {
                            width: 100%;
                            height: 3px;
                            position: absolute;
                            left: 0px;
                            top: 17px;
                            background-color: #000000;
                        }

                        .bar:first-child {
                            transform: rotate(45deg);
                        }

                        .bar:last-child {
                            transform: rotate(-45deg);
                        }
                    }
                }
            }

            .menu-center {
                padding: 18px;

                .menu-item {
                    width: 100%;
                    text-align: center;
                    font-size: 2rem;
                    margin-bottom: 18px;
                    border: 3px solid #000000;
                }

                .menu-item:last-child {
                    margin-bottom: 0px;
                }

                .menu-item-n {
                    color: #ffffff;
                    background-color: #000000;
                }
            }

            .menu-info-field {
                overflow-y: auto;
                padding: 18px;
                background-color: #000000;

                pre {
                    width: 100%;
                    white-space: pre-wrap;
                    color: #ffffff;
                    padding-bottom: 18px;
                }
            }
        }

        .showroom-button-field {
            position: fixed;
            left: 100%;
            top: 18px;
            margin-left: -964px;
            padding-right: 18px;
            z-index: 4;
            display: flex;
            justify-content: flex-end;

            .showroom-button {
                width: 464px;
                height: 69px;
                margin-right: 18px;
                padding: 6px 18px;
                color: #ffffff;
                background-color: #000000;
                border: 2px solid #ffffff;
                display: flex;
                justify-content: space-between;
                cursor: pointer;
                font-size: 18px;

                .content {
                    width: 100%;

                    .icon {
                        width: 10%;
                        text-align: right;
                    }

                    .text-slider {
                        width: 100%;
                    }
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
                width: 189px;
                margin-right: 18px;
                padding: 9px 18px;
                color: #ffffff;
                background-color: #000000;
                border: 2px solid #000000;
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

            .info-field {
                position: absolute;
                height: 30vh;
                min-height: 500px;
                padding: 18px;
                overflow-y: auto;
                background-color: #000000;
                border: 2px solid #000000;

                pre {
                    width: 100%;
                    white-space: pre-wrap;
                    color: #ffffff;
                }
            }
        }

        .showroom-button-field-sm {
            margin-left: -414px;
        }

        .top {
            width: 100%;
            height: 120px;
            padding: 0px 18px;
            padding-top: 102px;
            left: 0px;
            top: 0px;

            @media screen and (max-width: 1090px) {
                height: 90px;
                padding: 0px;
            }

            .line {
                width: 100%;
                border-top: 2px solid #ffffff;

                @media screen and (max-width: 1090px) {
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
                    width: 124px;
                    height: 45px;
                    padding: 0px 18px;
                    position: absolute;
                    left: 18px;
                    top: 100%;
                    margin-top: -63px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #000000;
                    background-color: #ffffff;
                    border: 2px solid #000000;
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
                    color: #ffffff;
                    background-color: #000000;
                }

                .product-button {
                    width: 216px;
                    height: 45px;
                    position: absolute;
                    left: 100%;
                    top: 100%;
                    margin-left: -234px;
                    margin-top: -63px;
                    cursor: pointer;
                    z-index: 2;

                    @media screen and (max-width: 1090px) {
                        width: 100%;
                        left: 0px;
                        margin-left: 0px;
                        padding: 0px 18px;
                    }

                    .button-content-field {
                        width: 100%;
                        height: 100%;
                        padding: 0px 18px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: #ffffff;
                        background-color: #000000;
                        border: 2px solid #000000;

                        @media screen and (max-width: 1090px) {
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

                .product-field {
                    position: absolute;
                    height: 246px;
                    overflow-y: auto;
                    font-weight: bold;
                    color: #000000;
                    background-color: #ffffff;
                    border: 2px solid #000000;
                    z-index: 2;

                    .product-header {
                        width: 100%;
                        height: 42px;
                        padding: 0px 18px;
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
            padding: 18px 18px;

            .content {
                width: 100%;
                // margin-top:18px;
                color: #ffffff;
                border-top: 1px solid #ffffff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.8rem;

                @media screen and (max-width: 1090px) {
                    border: none;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-end;
                    font-size: 0.5rem;
                }

                .text {
                    padding-right: 1rem;

                    @media screen and (max-width: 1090px) {
                        width: 100%;
                        padding: 0px;
                    }
                }

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