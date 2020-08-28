<template>
    <div>
        <loading :hidden="!disabled"></loading>

        <top-nav separate-page="Asset Edit"></top-nav>

        <div ref="editorField" class="editor-field">

            <nav class="nav-field">
                <div @click="onClickSave" class="nav-btn nav-btn-sm">
                    <div class="nav-btn-font">SAVE</div>
                </div>

                <div @click="onClickMtlClear" class="nav-btn nav-btn-sm">
                    <div class="nav-btn-font">MTL CLEAR</div>
                </div>
            </nav>

            <div ref="viewField" class="font-neuemachina"></div>

            <div class="control-field">
                <asset-panel :editor="assetEditor" :asset-item="assetItem" @control="onControl"></asset-panel>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../class/apiUrl';
    import Utils from '../../class/utils';
    import ModelFileInfo from '../../class/modelFileInfo';
    import AssetItem from '../../nemoShowroom/common/assetItem';

    import topNavVue from '../parts/topNav.vue';
    import loadingVue from '../parts/loading.vue';
    import assetPanelVue from '../parts/assetEditPage/assetPanel.vue';

    import NemoAssetEditor from '../../nemoShowroom/nemoAssetEditor/nemoAssetEditor';

    export default {
        components: {
            'top-nav': topNavVue,
            'loading': loadingVue,
            'asset-panel': assetPanelVue
        },
        props: ['id'],
        data: function () {
            return {
                disabled: true,
                isConfigEdited: false,
                modelFileInfo: new ModelFileInfo(),
                assetItem: null,
                assetEditor: new NemoAssetEditor({
                    width: 100,
                    height: 100
                })
            };
        },
        beforeRouteLeave: function (to, from, next) {
            const me = this;

            if (me.isConfigEdited && !confirm('변경사항이 저장되지 않았을 수도 있습니다.\n나가시겠습니까?')) {
                next(false);

            } else {
                next();
            }
        },
        mounted: function () {
            const me = this;

            // 에디터 객체는 mounted 실행시 초기화 하여 자식 컴포넌트에 넘겨주려고 하면 오류가 발생한다.
            // data 초기화 후에 에디터의 위치를 이동하는 식으로 처리한다.
            me.$refs.viewField.appendChild(me.assetEditor.rootEl);

            $(window).on('resize.assetedit.page', function () {
                setTimeout(function () {
                    const jWin = $(window);
                    const w = jWin.width() - $('.nav-field').outerWidth() - $('.control-field').outerWidth();
                    const h = jWin.height() - $('.navbar').outerHeight();

                    $(me.$refs.editorField).css('width', w + 'px').css('height', h + 'px');
                    me.assetEditor.resize(w, h);
                }, 100);
            });

            $(window).on('beforeunload.assetedit.page', function (jEvt) {
                if (me.isConfigEdited) {
                    // 반환값이 있으면 무조건 페이지 이동을 경고.
                    return true;
                }
            });

            // 에디터의 위치가 변경되기를 기다렸다가 처리.
            setTimeout(function () {
                $(window).trigger('resize.assetedit.page');

                // 크기가 변경된 이후에 처리.
                setTimeout(function () {
                    me.loadFileData();
                }, 100);
            }, 100);

        },
        beforeDestroy: function () {
            const me = this;

            me.assetEditor.destroy();
            me.assetEditor = null;

            $(window).off('resize.assetedit.page').off('beforeunload.assetedit.page');
        },
        methods: {
            onModelItemLoad: function (assetItem) {
                const me = this;

                me.assetItem = me.assetEditor.assetItem;
                me.disabled = false;
            },
            load2d: function (data) {
                const me = this;

                Utils.sizeFromImageUrl(data.url).then(function (info) {
                    const item = {
                        name: data.name,
                        type: 'image',
                        itemUrl: data.url,
                        width: info.width / 500,
                        height: info.height / 500
                    };

                    me.assetEditor.openItem(item).then(me.onModelItemLoad);
                });
            },
            load3d: function (data) {
                const me = this;

                const item = {
                    name: data.name,
                    type: data.ext,
                    itemUrl: data.url
                };

                me.assetEditor.openItem(item).then(me.onModelItemLoad);
            },
            loadModel: function (modelFileInfo) {
                const me = this;

                const typesStr = 'jpeg, jpg, png, gif';

                if (typesStr.indexOf(modelFileInfo.ext) > -1) {
                    me.load2d(modelFileInfo);

                } else {
                    me.load3d(modelFileInfo);
                }
            },
            openData: function (modelFileInfo) {
                const me = this;

                if (modelFileInfo.data) {
                    me.assetEditor.openJson(modelFileInfo.data).then(function (assetItem) {
                        me.assetItem = assetItem;
                        me.disabled = false;
                    });

                } else {
                    me.loadModel(modelFileInfo);
                }
            },
            loadFileData: function () {
                const me = this;

                Utils.apiRequest(ApiUrl.MODEL_FILE_DATA, {seqId: me.id}).then(function (data) {
                    if (data.data.length > 0) {
                        me.modelFileInfo = new ModelFileInfo(Utils.snakeObjToCamelObj(data.data[0]));

                        me.openData(me.modelFileInfo);

                    } else {
                        alert('해당 정보가 없습니다.');
                    }
                });
            },
            onControl: function (type) {
                const me = this;

                me.isConfigEdited = true;

            },
            onClickSave: function () {
                const me = this;

                me.modelFileInfo.data = me.assetEditor.exportJson();

                Utils.apiRequest(ApiUrl.MODEL_FILE_UPDATE, me.modelFileInfo, 'post').then(function () {
                    me.isConfigEdited = false;

                    alert('저장 완료.');

                }).catch(function () {
                    alert('오류!')
                });
            },
            onClickMtlClear: function () {
                const me = this;

                if (confirm('Material 설정을 초기화 합니다.')) {
                    me.disabled = true;

                    setTimeout(function () {
                        me.modelFileInfo.data = '';
                        me.openData(me.modelFileInfo);
                    }, 1000);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .editor-field {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        -ms-user-select: none;
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        user-select: none;

        /* nav ==================================================================================================== */
        $nav-field-w: 120;

        .nav-field {
            border-top: solid 1px #8c8c8c;
            min-width: $nav-field-w + px;
            height: 100%;
            background-color: #343a40;
            overflow-x: hidden;
            overflow-y: auto;
        }

        .nav-btn {
            width: $nav-field-w + px;
            height: $nav-field-w + px;
            border-bottom: solid 1px #8c8c8c;
            text-align: center;
            cursor: pointer;
        }

        .nav-btn-sm {
            width: $nav-field-w + px;
            height: ($nav-field-w / 3) + px;
            border-bottom: solid 1px #8c8c8c;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .nav-btn:hover {
            background-color: #8c8c8c;
        }

        .nav-btn-font {
            font-size: 17px;
            color: #ffffff;
        }
        /* END-nav ==================================================================================================== */


        /* control ==================================================================================================== */
        $control-field-w: 300;

        .control-field {
            min-width: $control-field-w + px;
            max-width: $control-field-w + px;
            height: 100%;
            background-color: #343a40 ;
            overflow-x: hidden;
            overflow-y: auto;
        }
        /* END-control ==================================================================================================== */
    }
</style>

<style lang="scss">
    // 화면에 표시되는 텍스트 아이템의 공통 스타일.
    @import "./assetItemText.scss";
</style>