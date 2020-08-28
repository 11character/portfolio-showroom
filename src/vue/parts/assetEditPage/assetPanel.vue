<template>
    <div class="asset-panel-field">
        <div class="item-row">
            <input-world-light :editor="editor" @control="onControl" label="World light"></input-world-light>
        </div>

        <div class="item-row">
            <input-text v-model="name" label="Asset name"></input-text>
        </div>

        <div class="item-row">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a ref="firstTabBtn" class="nav-link active" data-toggle="tab" href=".tab-1">Material</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href=".tab-2">Buttons</a>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-1 tab-pane fade show active">
                    <div class="asset-material-field">
                        <mesh-panel :asset-item="assetItem" @control="onControl"></mesh-panel>
                    </div>
                </div>

                <div class="tab-2 tab-pane fade">
                    <div class="asset-material-field">
                        <image-button-panel :asset-item="assetItem" @control="onControl"></image-button-panel>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as StaticVariable from '../../../nemoShowroom/common/staticVariable';
    import AssetItem from '../../../nemoShowroom/common/assetItem';

    import inputWorldLightVue from '../inputItem/inputWorldLight.vue';
    import inputTextVue from '../inputItem/inputText.vue';
    import meshPanelVue from './meshPanel.vue';
    import imageButtonPanelVue from './imageButtonPanel.vue';

    import EditorInterface from '../../../nemoShowroom/common/editorInterface';

    /**
     * template event : control
     */
    export default {
        components: {
            'input-world-light': inputWorldLightVue,
            'image-button-panel': imageButtonPanelVue,
            'input-text': inputTextVue,
            'mesh-panel': meshPanelVue
        },
        props: {
            editor: {type: EditorInterface},
            assetItem: {type: AssetItem}
        },
        data: function () {
            return {
                lockEvent: false,
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

                if (!me.lockEvent) {
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

                me.lockEvent = true;

                me.name = assetItem.name;

                setTimeout(function () {
                    me.lockEvent = false;
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

        .nav-tabs {
            margin-bottom: 0.5rem;

            .nav-item {
                width: 33.33%;

                .nav-link {
                    color: #ffffff;
                    padding: 0.5rem;
                    text-align: center;
                }

                .nav-link.active {
                    color: #000000;
                }
            }
        }
    }
</style>