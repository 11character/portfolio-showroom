<template>
    <div class="input-material-options">
        <loading :hidden="!disabled" ref="loading"></loading>

        <div class="view-field" ref="viewField"></div>

        <div ref="controlField" class="control-field">
            <mesh-panel :asset-item="viewAssetItem" @control="onControl"></mesh-panel>
        </div>
    </div>
</template>

<script>
    import AssetItem from '../../../nemoShowroom/common/assetItem';
    import MaterialButton from '../../../nemoShowroom/common/materialButton';

    import meshPanelVue from '../assetEditPage/meshPanel.vue';
    import loadingVue from '../loading.vue';

    import NemoAssetEditor from '../../../nemoShowroom/nemoAssetEditor/nemoAssetEditor';

    /**
     * template event : input, control
     */
    export default {
        components: {
            'mesh-panel': meshPanelVue,
            'loading': loadingVue
        },
        props: {
            value: {type: MaterialButton, default: new MaterialButton()},
            assetItem: {type: AssetItem}
        },
        data: function () {
            return {
                disabled: true,
                assetView: null,
                viewAssetItem: null
            };
        },
        watch: {
            value: function (button) {
                const me = this;

                me.onChangeButton(button);
            }
        },
        mounted: function () {
            const me = this;

            me.assetView = new NemoAssetEditor({
                el: me.$refs.viewField,
                width: 100,
                height: 100
            });

            if (me.value) {
                me.onChangeButton(me.value);
            }

            me.resize();

            $(window).on('resize.mtloption.page', me.resize);
        },
        beforeDestroy: function () {
            const me = this;

            me.assetView.destroy();
            me.assetView = null;

            $(window).off('resize.mtloption.page');
        },
        methods: {
            resize: function () {
                const me = this;

                const jView = $(me.$refs.viewField);
                const jControl = $(me.$refs.controlField);
                const vW = jView.outerWidth();
                const vH = vW * (9 / 16);
                const cW = jControl.outerWidth();

                $(me.$refs.loading.$el).css('width', vW + cW + 'px').css('height', vH + 'px');

                jView.css('height', vH + 'px');
                jControl.css('height', vH + 'px');

                me.assetView.resize(vW, vH);
            },
            onChangeButton: function (button) {
                const me = this;

                const Object = window.Object;

                if (me.assetItem) {
                    me.disabled = true;

                    me.assetView.openItem(me.assetItem).then(function (item) {
                        let materialOptions = button.materialOptions;

                        // 버튼 정보에 설정값이 없는 경우, 아이템의 설정값을 버튼정보에 넣는다.
                        if (Object.keys(materialOptions).length == 0) {
                            button.materialOptions = item.materialOptions;

                        } else {
                            item.setMaterialOptions(materialOptions);
                        }

                        me.viewAssetItem = item;

                        me.disabled = false;
                    });
                }
            },
            onControl: function (type) {
                const me = this;

                me.value.materialOptions = me.viewAssetItem.materialOptions;

                me.$emit('input', me.value);
                me.$emit('control', type);
            }
        }
    }
</script>

<style lang="scss">
    .input-material-options {
        width: 100%;
        min-height: 100px;
        display: flex;
        flex-wrap: wrap;

        .view-field {
            width: 70%;
        }

        .control-field {
            width: 30%;
            padding-left: 1rem;
            overflow-y: auto;
        }
    }
</style>