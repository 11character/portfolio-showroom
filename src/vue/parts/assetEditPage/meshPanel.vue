<template>
    <div class="field">
        <div :id="accordionId" class="accordion">
            <!-- mesh -->
            <template v-for="(mesh, i) in meshArr">
                <!-- allay material -->
                <template v-if="Array.isArray(mesh.material)">
                    <div v-for="(material, j) in mesh.material" :key="i + '-' + j" class="card">
                        <div class="card-header">
                            <h2 class="mb-0">
                                <button :data-target="'#' + accordionId + '-' + i + '-' + j" class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" aria-expanded="true" aria-controls="collapseOne">
                                    <span>{{ mesh.name || 'noname' }}.{{ mesh.material[j].name || 'noname' }}</span>
                                </button>
                            </h2>
                        </div>
                    
                        <div :id="accordionId + '-' + i + '-' + j" :data-parent="'#' + accordionId" :class="{'show': (i == 0) && (j == 0)}" class="collapse">
                            <div class="card-body bg-dark">
                                <material-panel
                                    :id="i + '-' + j"
                                    :material="material"
                                    :asset-item="assetItem"
                                    @control="onControl">
                                </material-panel>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- END-allay material -->
                
                <!-- single material -->
                <template v-else>
                    <div :key="i" class="card">
                        <div class="card-header">
                            <h2 class="mb-0">
                                <button :data-target="'#' + accordionId + '-' + i" class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" aria-expanded="true" aria-controls="collapseOne">
                                    <span>{{ mesh.name || 'noname' }}.{{ mesh.material.name || 'noname' }}</span>
                                </button>
                            </h2>
                        </div>

                        <div :id="accordionId + '-' + i" :data-parent="'#' + accordionId" :class="{'show': (i == 0)}" class="collapse">
                            <div class="card-body bg-dark">
                                <material-panel
                                    :id="i + ''"
                                    :material="mesh.material"
                                    :asset-item="assetItem"
                                    @control="onControl">
                                </material-panel>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- END-single material -->
            </template>
            <!-- END-mesh -->
        </div>
    </div>
</template>

<script>
    import AssetItem from '../../../nemoShowroom/common/assetItem';
    import * as StaticVariable from '../../../nemoShowroom/common/staticVariable';

    import materialPanelVue from './materialPanel';

    /**
     * template event : control
     */
    export default {
        components: {
            'material-panel': materialPanelVue
        },
        props: {
            assetItem: {type: AssetItem}
        },
        data: function () {
            const me = this;

            return {
                accordionId: 'accordion-' + me._uid,
                meshArr: []
            }
        },
        watch: {
            assetItem: function (item) {
                const me = this;

                me.onChangeAssetItem(item);
            }
        },
        mounted: function () {
            const me = this;

            if (me.assetItem) {
                me.onChangeAssetItem(me.assetItem);
            }
        },
        methods: {
            onChangeAssetItem: function (assetItem) {
                const me = this;

                const arr = [];
                const is3d = StaticVariable.ITEM_3D_TYPES.indexOf(assetItem.type) > -1;

                if (is3d && assetItem.object3D) {
                    assetItem.object3D.traverse(function (object3D) {
                        if (object3D.isMesh) {
                            arr.push(object3D);
                        }
                    });
                }

                me.meshArr = arr;
            },
            onControl: function (type) {
                const me = this;

                me.$emit('control', type);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .accordion {
        .card {
            background-color: #8c8c8c;

            .btn-link {
                color: #ffffff;
                text-decoration: none;
            }
        }
    }
</style>