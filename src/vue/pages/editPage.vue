<template>
    <div>
        <top-nav separate-page="Edit"></top-nav>

        <model-modal @apply="onApplyModel" class="model-modal"></model-modal>

        <text-modal @apply="onApplyText" class="text-modal"></text-modal>

        <web-modal @apply="onApplyWeb" class="web-modal"></web-modal>

        <youtube-modal @apply="onApplyYouTube" class="youtube-modal"></youtube-modal>

        <div ref="editorField" class="editor-field">
            <nav class="nav-field">
                <div @click="onClickSave" class="nav-btn nav-btn-sm">
                    <div class="nav-btn-font">SAVE</div>
                </div>

                <div @click="onClickModelModalOpen" class="nav-btn" data-toggle="modal">
                    <img :src="'./img/icon-model-file.png'" class="nav-btn-img nav-btn-img-model-file">
                    <div class="nav-btn-font">Model</div>
                </div>

                <div @click="onClickTextModalOpen" class="nav-btn" data-toggle="modal">
                    <img :src="'./img/icon-text.png'" class="nav-btn-img nav-btn-img-text">
                    <div class="nav-btn-font">Text</div>
                </div>

                <div @click="onClickWebModalOpen" class="nav-btn" data-toggle="modal">
                    <img :src="'./img/icon-web.png'" class="nav-btn-img nav-btn-img-webpage">
                    <div class="nav-btn-font">Web Page</div>
                </div>

                <div  @click="onClickYoutubeModalOpen" class="nav-btn" data-toggle="modal">
                    <img :src="'./img/icon-youtube.png'" class="nav-btn-img nav-btn-img-youtube">
                    <div class="nav-btn-font">YouTube</div>
                </div>

                <div @click="onClickLight" class="nav-btn" data-toggle="modal">
                    <img :src="'./img/icon-model-file.png'" class="nav-btn-img nav-btn-img-model-file">
                    <div class="nav-btn-font">Light</div>
                </div>
            </nav>

            <div ref="viewField"></div>

            <div class="control-field">
                <control-panel @control="onControl" v-bind:editor="showroomEditor"></control-panel>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../class/apiUrl';
    import Utils from '../../class/utils';
    import Showroom from '../../class/showroom';

    import topNavVue from '../parts/topNav.vue';
    import controlPanelVue from '../parts/editPage/controlPanel.vue';
    import modelModalVue from '../parts/editPage/modelModal.vue';
    import textModalVue from '../parts/editPage/textModal.vue';
    import webModalVue from '../parts/editPage/webModal.vue';
    import youtubeModalVue from '../parts/editPage/youtubeModal.vue';

    import NemoShowroomEditor from '../../nemoShowroom/nemoShowroomEditor/nemoShowroomEditor';

    export default {
        props: ['id'],
        components: {
            'top-nav': topNavVue,
            'control-panel': controlPanelVue,
            'model-modal': modelModalVue,
            'text-modal': textModalVue,
            'web-modal': webModalVue,
            'youtube-modal': youtubeModalVue
        },
        data: function () {
            return {
                disabled: false,
                isConfigEdited: false,
                isTextEdit: false,
                showroom: new Showroom(),
                showroomEditor: new NemoShowroomEditor({
                    width: 100,
                    height: 100
                })
            };
        },
        beforeRouteLeave: function (to, from, next) {
            const me = this;

            if (me.isConfigEdited && !confirm('변경사항이 저장되지 않을 수 있습니다.\n나가시겠습니까?')) {
                next(false);

            } else {
                next();
            }
        },
        mounted: function () {
            const me = this;

            // 에디터 객체는 mounted 실행시 초기화 하여 자식 컴포넌트에 넘겨주려고 하면 오류가 발생한다.
            // data 초기화 후에 에디터의 위치를 이동하는 식으로 처리한다.
            me.$refs.viewField.appendChild(me.showroomEditor.rootEl);

            $(window).on('resize.edit.page', function () {
                setTimeout(function () {
                    const w = $(window).width() - $('.nav-field').outerWidth() - $('.control-field').outerWidth();
                    const h = $(window).height() - $('.navbar').outerHeight();

                    $(me.$refs.editorField).css('width', w + 'px').css('height', h + 'px');

                    me.showroomEditor.resize(w, h);
                }, 100);
            });

            $(window).on('beforeunload.edit.page', function (jEvt) {
                if (me.isConfigEdited) {
                    // 반환값이 있으면 무조건 페이지 이동을 경고.
                    return true;
                }
            });

            // 에디터의 위치가 변경되기를 기다렸다가 처리.
            setTimeout(function () {
                $(window).trigger('resize.edit.page');
                
                // 크기가 변경된 이후에 처리.
                setTimeout(function () {
                    me.openData();
                }, 100);
            }, 100);

        },
        beforeDestroy: function () {
            const me = this;

            me.showroomEditor.stop();
            me.showroomEditor = null;

            $(window).off('resize.edit.page').off('beforeunload.edit.page');
        },
        methods: {
            openData: function () {
                const me = this;

                Utils.apiRequest(ApiUrl.SHOWROOM_DATA, {seqId: me.id}).then(function (data) {
                    if (data.data.length > 0) {
                        me.showroom = new Showroom(Utils.snakeObjToCamelObj(data.data[0]));

                        me.showroomEditor.openJson(me.showroom.data || '[]');

                    } else {
                        alert('해당 정보가 없습니다.');
                    }
                });
            },
            onClickLight: function () {
                const me = this;

                me.showroomEditor.addSpotLight();
            },
            onClickModelModalOpen: function () {
                $('.model-modal').modal('show');
            },
            onClickTextModalOpen: function () {
                $('.text-modal').modal('show');
            },
            onClickWebModalOpen: function () {
                $('.web-modal').modal('show');
            },
            onClickYoutubeModalOpen: function () {
                $('.youtube-modal').modal('show');
            },
            onControl: function (type) {
                const me = this;

                if (type == 'textEdit') {
                    me.isTextEdit = true;
                    me.onClickTextModalOpen();
                }

                me.isConfigEdited = true;
            },
            load2d: function (data) {
                const me = this;

                Utils.sizeFromImageUrl('./' + data.url).then(function (info) {
                    const item = {
                        name: data.name,
                        type: 'image',
                        itemUrl: data.url,
                        width: info.width / 500,
                        height: info.height / 500
                    };

                    me.showroomEditor.import(item).then(me.onModelItemLoad);
                });
            },
            load3d: function (data) {
                const me = this;

                const item = {
                    name: data.name,
                    type: data.ext,
                    itemUrl: data.url
                };

                me.showroomEditor.import(item).then(me.onModelItemLoad);
            },
            onModelItemLoad: function (assetItem) {
                const me = this;

                const box3 = assetItem.getBox3();
                const scale = 1 / (box3.max.y - box3.min.y);

                assetItem.object3D.scale.set(scale, scale, scale);
                assetItem.syncMembers();

                me.isConfigEdited = true;
            },
            onApplyModel: function (dataArr) {
                const me = this;

                const typesStr = 'jpeg, jpg, png, gif';

                let data, ext;

                for (let i = 0; i < dataArr.length; i++) {
                    data = dataArr[i];

                    if (typesStr.indexOf(data.ext) > -1) {
                        me.load2d(data);

                    } else {
                        me.load3d(data);
                    }
                }
            },
            onApplyText: function (data) {
                const me = this;

                const html = data.html;
                const backgroundColor = data.backgroundColor;
                const scale = 0.005;

                // 텍스트 에디터에서 출력값 마지막 라인 아래에 여백이 없도록 처리.
                const content = '<div class="asset-text-item" data-type="text" style="word-wrap:break-word; overflow:hidden; background-color:' + backgroundColor + ';">' + html + '</div>';

                const item = {
                    name: 'Text',
                    type: 'html',
                    content: content,
                    scale: {x: scale, y: scale, z: scale},
                    zeroScale: {x: scale, y: scale, z: scale}
                };

                const prevItem = me.showroomEditor.selectedItem;

                if (me.isTextEdit && prevItem) {
                    item.isSprite = prevItem.isSprite;
                }

                me.showroomEditor.import(item).then(function (assetItem) {
                    me.isConfigEdited = true;

                    if (me.isTextEdit && prevItem) {
                        me.showroomEditor.attach(prevItem);
                        me.showroomEditor.remove();

                        const prevScale = prevItem.object3D.scale;
                        const prevPostion = prevItem.object3D.position;
                        const prevRotation = prevItem.object3D.rotation;

                        assetItem.object3D.scale.copy(prevScale);
                        assetItem.object3D.position.copy(prevPostion);
                        assetItem.object3D.rotation.copy(prevRotation);
                        assetItem.syncMembers();

                        const historyManager = me.showroomEditor.historyManager;
                        const undoHistory = historyManager.getHistory();
                        const redoHistory = historyManager.getHistory(historyManager.cursor - 1);

                        undoHistory.onUndo = function () {
                            historyManager.undo();
                        };

                        redoHistory.onRedo = function () {
                            historyManager.redo();
                        };
                    }
                });
            },
            onApplyWeb: function (url) {
                const me = this;

                const scale = 0.001;
                const apiUrl = './api/page-item.php?url=' + url;

                const item = {
                    name: 'Web Page',
                    type: 'html',
                    content: '<iframe data-type="webpage" frameBorder="0" style="border 0 none;background-color:#FFFFFF;width:1920px;height:1080px;overflow:hidden;" scrolling="no" src="' + apiUrl + '"></iframe>',
                    width: 1920,
                    height: 1080,
                    scale: {x: scale, y: scale, z: scale},
                    zeroScale: {x: scale, y: scale, z: scale}
                };

                me.showroomEditor.import(item).then(function () {
                    me.isConfigEdited = true;
                });
            },
            onApplyYouTube: function (url) {
                const me = this;

                const scale = 0.001;

                if (url) {
                    const item = {
                        nwme: 'YouTube',
                        type: 'youtube',
                        content: url,
                        scale: {x: scale, y: scale, z: scale},
                        zeroScale: {x: scale, y: scale, z: scale}
                    };

                    me.showroomEditor.import(item).then(function () {
                        me.isConfigEdited = true;
                    });
                }
            },
            onClickSave: function () {
                const me = this;

                me.showroom.data = me.showroomEditor.exportJson();

                Utils.apiRequest(ApiUrl.SHOWROOM_UPDATE, me.showroom, 'post').then(function () {
                    me.isConfigEdited = false;

                    alert('저장에 성공했습니다.');

                }).catch(function () {
                    alert('저장에 실패했습니다.');
                });
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

        .nav-btn-img {
            width: 40px;
            height: 40px;
            margin-top: 25px;
            color: #ffffff;
        }

        .nav-btn-img-model-file {
            width: 40px;
            height: 45px;
            margin-bottom: 10px;
        }

        .nav-btn-img-text {
            width: 44px;
            height: 27px;
            margin-bottom: 23px;
        }

        .nav-btn-img-webpage {
            width: 40px;
            height: 40px;
            margin-bottom: 10px;
        }

        .nav-btn-img-youtube {
            width: 40px;
            height: 27px;
            margin-bottom: 23px;
        }

        .nav-btn-font {
            font-size: 17px;
            color: #ffffff;
        }
        /* END-nav ==================================================================================================== */


        /* control ==================================================================================================== */
        $control-field-w: 220;

        .control-field {
            min-width: $control-field-w + px;
            height: 100%;
            background-color: #343a40 ;
            overflow-x: hidden;
            overflow-y: auto;
        }
        /* END-control ==================================================================================================== */
    }
</style>

<style lang="scss">
    /* 화면에 표시되는 asset-text-item 스타일 통일 */
        .asset-text-item {
            padding-left: 0.25rem !important;

            padding-right: 0.25rem !important;

            & > * {
                margin-bottom: 0px !important;
            }
        }

        .note-editable {
            -webkit-user-select: initial;
            user-select: initial;

            & > * {
                margin-bottom: 0px !important;
            }
        }
</style>