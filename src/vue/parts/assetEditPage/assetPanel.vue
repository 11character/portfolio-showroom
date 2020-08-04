<template>
    <div class="field">
        <div class="item-row">
            <input-text v-model="assetItem.name" label="Name"></input-text>
        </div>

        <div class="item-row">
            <mesh-panel :asset-item="assetItem"></mesh-panel>
        </div>
    </div>
</template>

<script>
    import inputTextVue from '../inputItem/inputText.vue';
    import meshPanelVue from './meshPanel.vue';

    import AssetItem from '../../../nemoShowroom/common/assetItem';

    export default {
        components: {
            'input-text': inputTextVue,
            'mesh-panel': meshPanelVue
        },
        props: {assetItem: {type: AssetItem, default: new AssetItem()}
        }
    }
</script>

<style lang="scss" scoped>
    .field {
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