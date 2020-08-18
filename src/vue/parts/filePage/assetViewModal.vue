<template>
    <div class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-body">
                    <loading :hidden="!disabled" ref="loading"></loading>

                    <div class="view-field" ref="viewField"></div>

                    <div class="link-field">
                        <div class="link-text">{{ linkUrl }}</div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="onClickClose" type="button" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Utils from '../../../class/utils';

    import loadingVue from '../loading.vue';

    import NemoAssetEditor from '../../../nemoShowroom/nemoAssetEditor/nemoAssetEditor';

    export default {
        components: {
            'loading': loadingVue
        },
        data: function () {
            return {
                disabled: true,
                assetView: null,
                linkUrl: ''
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
                    const jEl = $(me.$refs.viewField);
                    const w = jEl.outerWidth();
                    const h = w * (9 / 16);

                    $(me.$refs.viewField).css('height', h + 'px');
                    $(me.$refs.loading.$el).css('width', w + 'px').css('height', h + 'px');

                    me.assetView.resize(w, h);
                }, 100);
            });

            $(window).trigger('resize.assetview.page');
        },
        beforeDestroy: function () {
            const me = this;

            me.assetView.destroy();
            me.assetView = null;

            $(window).off('resize.assetview.page').off('beforeunload.assetview.page');
        },
        methods: {
            onModelItemLoad: function (assetItem) {
                const me = this;

                const box3 = assetItem.getBox3();
                const scale = 1 / (box3.max.y - box3.min.y);

                assetItem.object3D.scale.set(scale, scale, scale);
                assetItem.syncTransformMembers();

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

                    me.assetView.openItem(item).then(me.onModelItemLoad);
                });
            },
            load3d: function (data) {
                const me = this;

                const item = {
                    name: data.name,
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
            open: function (modelFileInfo) {
                const me = this;

                const url = window.location.href.substring(0, window.location.href.lastIndexOf('#'));
                const assetViewRoute = me.$router.resolve({name: 'asset-view', params: {id: modelFileInfo.seqId}}).route;

                me.linkUrl = url + 'showroom.php#' + assetViewRoute.fullPath;

                $(me.$el).modal('show');

                setTimeout(function () {
                    $(window).trigger('resize.assetview.page');

                    me.disabled = true;
                }, 100);

                setTimeout(function () {
                    if (modelFileInfo.data) {
                        me.assetView.openJson(modelFileInfo.data).then(function (assetItem) {
                            me.disabled = false;
                        });
    
                    } else {
                        me.loadModel(modelFileInfo);
                    }
                }, 500);
            },
            close: function () {
                const me = this;

                $(me.$el).modal('hide');

                me.assetView.removeAll();
                me.assetView.viewDefault();
            },
            onClickClose: function() {
                const me = this;

                me.close();

                me.$emit('confirm', false);
            }
        },
    }
</script>

<style lang="scss" scoped>
    .view-field {
        position: relative;
    }

    .link-field {
        width: 100%;

        .link-text {
            width: 100%;
            margin-top: 1rem;
            padding: 0.5rem;
            border: 1px solid #bdbdbd;
            border-radius: 0.25rem;
        }
    }
</style>