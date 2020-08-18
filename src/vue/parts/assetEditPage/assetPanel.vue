<template>
    <div class="asset-panel-field">
        <div class="item-row">
            <input-light :editor="editor" @control="onControl" label="World light"></input-light>
        </div>

        <div class="item-row">
            <input-text v-model="assetItem.name" label="Asset name" @input="onControl"></input-text>
        </div>

        <div class="item-row">
            <mesh-panel :asset-item="assetItem" @control="onControl"></mesh-panel>
        </div>
    </div>
</template>

<script>
    import AssetItem from '../../../nemoShowroom/common/assetItem';

    import inputLightVue from '../inputItem/inputLight.vue';
    import inputTextVue from '../inputItem/inputText.vue';
    import meshPanelVue from './meshPanel.vue';

    import EditorInterface from '../../../nemoShowroom/common/editorInterface';

    /**
     * template event : control
     */
    export default {
        components: {
            'input-light': inputLightVue,
            'input-text': inputTextVue,
            'mesh-panel': meshPanelVue,
        },
        props: {
            editor: {type: EditorInterface},
            assetItem: {type: AssetItem}
        },
        methods: {
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