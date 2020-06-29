<template>
    <div>
        <top-nav separate-page="Edit"></top-nav>

        <model-modal @select="onSelectModel" class="model-modal"></model-modal>

        <text-modal class="text-modal"></text-modal>

        <web-modal class="web-modal"></web-modal>

        <youtube-modal class="youtube-modal"></youtube-modal>

        <div class="editor-field">
            <nav class="nav-field">
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

                <div  @click="onClickTest" class="nav-btn" data-toggle="modal">
                    <img :src="'./img/icon-youtube.png'" class="nav-btn-img nav-btn-img-youtube">
                    <div class="nav-btn-font">TEST</div>
                </div>
            </nav>

            <div class="view-field"></div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../class/apiUrl';
    import Utils from '../../class/utils';

    import topNavVue from '../parts/topNav.vue';
    import modelModalVue from '../parts/editPage/modelModal.vue';
    import textModalVue from '../parts/editPage/textModal.vue';
    import webModalVue from '../parts/editPage/webModal.vue';
    import youtubeModalVue from '../parts/editPage/youtubeModal.vue';

    import NemoShowroomEditor from '../../NemoShowroom/nemoShowroomEditor/nemoShowroomEditor';

    export default {
        props: ['id'],
        components: {
            'top-nav': topNavVue,
            'model-modal': modelModalVue,
            'text-modal': textModalVue,
            'web-modal': webModalVue,
            'youtube-modal': youtubeModalVue
        },
        data: function () {
            return {
                disabled: false,
                showroomEditor: null,
                isConfigEdited: false
            };
        },
        beforeRouteLeave: function (to, from, next) {
            const me = this;

            if (me.isConfigEdited && !confirm('변경사항이 저장되지 않을 수 있습니다.')) {
                next(false);

            } else {
                next();
            }
        },
        mounted: function () {
            const me = this;

            me.isConfigEdited = false;

            me.showroomEditor = new NemoShowroomEditor({
                el: $('.view-field').get(0),
                mode: 'edit'
            });

            $(window).on('resize.edit.page', function () {
                setTimeout(function () {
                    const w = $(window).width() - $('.nav-field').outerWidth();
                    const h = $(window).height() - $('.navbar').outerHeight();

                    $('.editor-field').css('width', w + 'px').css('height', h + 'px');

                    me.showroomEditor.resize(w, h);
                }, 100);
            }).trigger('resize.edit.page');

            $(window).on('beforeunload.edit.page', function (jEvt) {
                if (me.isConfigEdited) {
                    // 반환값이 있으면 무조건 창 띄움.
                    return true;
                }
            });
        },
        beforeDestroy: function () {
            const me = this;

            me.showroomEditor.stop();
            me.showroomEditor = null;

            $(window).off('resize.edit.page').off('beforeunload.edit.page');
        },
        methods: {
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
            onSelectModel: function (dataArr) {
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    /* nav ==================================================================================================== */
    $nav-field-w: 120;

    .editor-field {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .nav-field {
            min-width: $nav-field-w + px;
            height: 100%;
            background-color: #343a40 ;
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
    }
    /* END-nav ==================================================================================================== */
</style>