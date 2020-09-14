<template>
    <div class="asset-view-page-field font-neuemachina">
        <loading :hidden="!disabled" ref="loading"></loading>

        <div class="view-field" ref="viewField"></div>

        <div :hidden="!isShowMaterialList" class="material-button-field">
            <item-material-list :asset-item="assetItem"></item-material-list>
        </div>
    </div>
</template>

<script>
    import Utils from '../../class/utils';
    import * as ApiUrl from '../../class/apiUrl';
    import ModelFileInfo from '../../class/modelFileInfo';

    import loadingVue from '../parts/loading.vue';
    import itemMaterialListVue from '../parts/viewPage/itemMaterialList.vue';

    import NemoAssetEditor from '../../nemoShowroom/nemoAssetEditor/nemoAssetEditor';

    export default {
        components: {
            'loading': loadingVue,
            'item-material-list': itemMaterialListVue
        },
        props: ['id'],
        data: function () {
            return {
                disabled: true,
                assetView: null,
                assetItem: null,
                isShowMaterialList: false
            };
        },
        mounted: function () {
            const me = this;

            // 보는 용도로만 사용
            me.assetView = new NemoAssetEditor({
                el: me.$refs.viewField,
                width: 100,
                height: 100
            });

            $(window).on('resize.assetview.page', function () {
                setTimeout(function () {
                    const jWin = $(window);
                    const w = jWin.width();
                    const h = jWin.height();

                    me.assetView.resize(w, h);
                }, 100);
            });

            $(window).trigger('resize.assetview.page');

            // 크기가 변경된 이후에 처리.
            setTimeout(function () {
                me.loadFileData();
            }, 100);
        },
        beforeDestroy: function () {
            const me = this;

            me.assetView.destroy();
            me.assetView = null;

            $(window).off('resize.assetview.page');
        },
        methods: {
            onModelItemLoad: function (assetItem) {
                const me = this;

                me.assetItem = assetItem;
                me.isShowMaterialList = (assetItem.materialButtonArray.length != 0);
                me.disabled = false;
            },
            load2d: function (data) {
                const me = this;

                Utils.sizeFromImageUrl(data.url).then(function (info) {
                    const item = {
                        name: data.name,
                        description: data.description,
                        type: 'image',
                        itemUrl: data.url,
                        width: info.width / 500,
                        height: info.height / 500
                    };

                    me.assetView.openItem(item).then(me.onModelItemLoad);
                });
            },
            load3d: function (data) {
                const me = this;

                const item = {
                    name: data.name,
                    description: data.description,
                    type: data.ext,
                    itemUrl: data.url
                };

                me.assetView.openItem(item).then(me.onModelItemLoad);
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
                    me.assetView.openJson(modelFileInfo.data).then(me.onModelItemLoad);

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
        },
    }
</script>

<style lang="scss" scoped>
    .asset-view-page-field {
        .material-button-field {
            width: 80%;
            height: 120px;
            position: absolute;
            left: 50%;
            top: 100%;
            margin-left: -40%;
            margin-top: -150px;
        }
    }
</style>

<style lang="scss">
    // 화면에 표시되는 텍스트 아이템의 공통 스타일.
    @import "./assetItemText.scss";
</style>