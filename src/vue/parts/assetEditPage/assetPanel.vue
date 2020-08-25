<template>
    <div class="asset-panel-field">
        <div class="item-row">
            <input-world-light :editor="editor" @control="onControl" label="World light"></input-world-light>
        </div>

        <div class="item-row">
            <input-text v-model="name" label="Asset name"></input-text>
        </div>

        <div class="item-row">
            <mesh-panel :asset-item="assetItem" @control="onControl"></mesh-panel>
        </div>
    </div>
</template>

<script>
    import * as StaticVariable from '../../../nemoShowroom/common/staticVariable';
    import AssetItem from '../../../nemoShowroom/common/assetItem';

    import inputWorldLightVue from '../inputItem/inputWorldLight.vue';
    import inputTextVue from '../inputItem/inputText.vue';
    import meshPanelVue from './meshPanel.vue';

    import EditorInterface from '../../../nemoShowroom/common/editorInterface';

    /**
     * template event : control
     */
    export default {
        components: {
            'input-world-light': inputWorldLightVue,
            'input-text': inputTextVue,
            'mesh-panel': meshPanelVue,
        },
        props: {
            editor: {type: EditorInterface},
            assetItem: {type: AssetItem}
        },
        data: function () {
            return {
                lockInputEvent: false,
                name: ''
            };
        },
        watch: {
            assetItem: function () {
                const me = this;

                me.onChangeAssetItem();
            },
            name: function (name) {
                const me = this;

                if (!me.lockInputEvent) {
                    me.assetItem.name = name;

                    me.onControl('assetName');
                }
            }
        },
        mounted: function () {
            const me = this;

            if (me.assetItem) {
                me.onChangeAssetItem();
            }
        },
        methods: {
            onChangeAssetItem: function () {
                const me = this;

                const assetItem = me.assetItem;

                me.lockInputEvent = true;

                me.name = assetItem.name;

                setTimeout(function () {
                    me.lockInputEvent = false;
                }, StaticVariable.INPUT_CONTROL_LOCK_TIME);
            },
            onControl: function (type) {
                const me = this;

                me.$emit('control', type);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .asset-panel-field {
        width: 100%;
        height: 100%;
        overflow-y: auto;

        .item-row {
            width: 100%;
            padding: 0px 1rem;
            margin-top: 1rem;
        }

        .item-row:first-child {
            margin-top: 0px;
        }
    }
</style>