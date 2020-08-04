<template>
    <div class="field">
        <div :id="accordionId" class="accordion">
            <!-- mesh -->
            <div v-for="(mesh, i) in meshArr" :key="i" class="card">
                <div class="card-header">
                    <h2 class="mb-0">
                        <button :data-target="'#' + accordionId + '-' + i" class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" aria-expanded="true" aria-controls="collapseOne">
                            <span>{{ mesh.name || 'none' }}</span>
                        </button>
                    </h2>
                </div>

                <div :id="accordionId + '-' + i" :data-parent="'#' + accordionId" :class="{'show': (i == 0)}" class="collapse">
                    <div class="card-body bg-dark">
                        <material-panel :material="mesh.material"></material-panel>
                    </div>
                </div>
            </div>
            <!-- END-mesh -->
        </div>
    </div>
</template>

<script>
    import AssetItem from '../../../nemoShowroom/common/assetItem';

    import materialPanelVue from './materialPanel';

    export default {
        components: {
            'material-panel': materialPanelVue
        },
        props: {
            assetItem: {type: AssetItem, default: new AssetItem()}
        },
        data: function () {
            const me = this;

            return {
                accordionId: 'accordion-' + me._uid,
                meshArr: []
            }
        },
        watch: {
            assetItem: {
                deep: true,
                handler: function (assetItem) {
                    const me = this;

                    const arr = [];

                    if (assetItem.object3D) {
                        assetItem.object3D.traverse(function (object3D) {
                            if (object3D.isMesh) {
                                arr.push(object3D);
                            }
                        });
                    }

                    me.meshArr = arr;
                }
            }
        }
    }
</script>