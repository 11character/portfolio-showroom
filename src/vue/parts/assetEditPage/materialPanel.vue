<template>
    <div v-if="material" class="material-panel-field">
        <div class="item-row">
            <label class="label">{{ material.type }}</label>
        </div>

        <div v-if="typeof material.roughness != 'undefined'" class="item-row">
            <input-slider v-model="materialOption.roughness" label="Roughness"></input-slider>
        </div>

        <div v-if="typeof material.metalness != 'undefined'" class="item-row">
            <input-slider v-model="materialOption.metalness" label="Metalness"></input-slider>
        </div>

        <div v-if="typeof material.color != 'undefined'" class="item-row">
            <input-color v-model="materialOption.color" label="Color"></input-color>
        </div>

        <div v-if="typeof material.map != 'undefined'" class="item-row">
            <input-image-select v-model="materialOption.map" :item-array="textureItemArr" label="Map"></input-image-select>
        </div>

        <div v-if="typeof material.normalMap != 'undefined'" class="item-row">
            <input-image-select v-model="materialOption.normalMap" :item-array="textureItemArr" label="Normal map"></input-image-select>
        </div>

        <div v-if="typeof material.roughnessMap != 'undefined'" class="item-row">
            <input-image-select v-model="materialOption.roughnessMap" :item-array="textureItemArr" label="Roughness map"></input-image-select>
        </div>

        <div v-if="typeof material.metalnessMap != 'undefined'" class="item-row">
            <input-image-select v-model="materialOption.metalnessMap" :item-array="textureItemArr" label="Metalness map"></input-image-select>
        </div>

        <div v-if="typeof material.emissive != 'undefined'" class="item-row">
            <input-color v-model="materialOption.emissive" label="Emissive"></input-color>
        </div>

        <div v-if="typeof material.envMap != 'undefined'" class="item-row">
            <input-cube-texture v-model="materialOption.envMap" :item-array="cubeTextureItemArr" label="Env map"></input-cube-texture>
        </div>

        <div v-if="typeof material.reflectivity != 'undefined'" class="item-row">
            <input-slider v-model="materialOption.reflectivity" label="Reflectivity"></input-slider>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../../class/apiUrl';
    import Utils from '../../../class/utils';
    import AssetItem from '../../../nemoShowroom/common/assetItem';
    import SelectItem from '../../../class/selectItem';
    import MaterialOption from '../../../nemoShowroom/common/materialOption';

    import inputSliderVue from '../inputItem/inputSlider.vue';
    import inputColorVue from '../inputItem/inputColor.vue';
    import inputImageSelectVue from '../inputItem/inputImageSelect';
    import inputCubeTextureVue from '../inputItem/inputCubeTexture';

    import * as THREE from 'three/build/three.module';

    /**
     * template event : control
     */
    export default {
        components: {
            'input-slider': inputSliderVue,
            'input-color': inputColorVue,
            'input-image-select': inputImageSelectVue,
            'input-cube-texture': inputCubeTextureVue
        },
        props: {
            index: {type: Number},
            material: {type: THREE.Material},
            assetItem: {type: AssetItem}
        },
        data: function () {
            return {
                materialOption: new MaterialOption(),
                textureItemArr: [],
                cubeTextureItemArr: []
            };
        },
        watch: {
            assetItem: function (assetItem) {
                const me = this;

                me.onChangeAssetItem(assetItem);
            },
            materialOption: {
                deep: true,
                handler: function (mtlOption) {
                    const me = this;

                    me.assetItem.setMaterialOption(mtlOption, me.index);

                    me.$emit('control', 'material');
                }
            }
        },
        mounted: function () {
            const me = this;

            me.onChangeAssetItem(me.assetItem);
        },
        methods: {
            loadTextureList: function (assetItem) {
                const me = this;

                const id = Utils.urlToParentName(assetItem.itemUrl);

                Utils.apiRequest(ApiUrl.TEXTURE_LIST, {id: id}).then(function (data) {
                    const dataArr = data.data;
                    const tempArr = [];

                    let url;

                    for (let i = 0; i < dataArr.length; i++) {
                        url = dataArr[i];

                        tempArr.push(new SelectItem({
                            name: Utils.urlToFileName(url),
                            value: url
                        }));
                    }

                    me.textureItemArr = tempArr;

                }).catch(function () {
                    me.textureItemArr = [];
                });
            },
            loadCubeTextureList: function (assetItem) {
                const me = this;

                const id = Utils.urlToParentName(assetItem.itemUrl);

                Utils.apiRequest(ApiUrl.CUBE_TEXTURE_LIST, {id: id}).then(function (data) {
                    const dataArr = data.data;
                    const tempArr = [];

                    let url;

                    for (let i = 0; i < dataArr.length; i++) {
                        url = dataArr[i];

                        tempArr.push(new SelectItem({
                            name: Utils.urlToFileName(url),
                            value: url
                        }));
                    }

                    me.cubeTextureItemArr = tempArr;

                }).catch(function () {
                    me.cubeTextureItemArr = [];
                });
            },
            onChangeAssetItem: function (assetItem) {
                const me = this;

                if (assetItem.itemUrl) {
                    me.materialOption = me.assetItem.materialOptions[me.index] || new MaterialOption();
                    me.loadTextureList(assetItem);
                    me.loadCubeTextureList(assetItem);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .material-panel-field {
        width: 100%;
        height: 100%;

        .item-row {
            width: 100%;
            margin-top: 1rem;

            .label {
                margin-bottom: 0px;
                font-size: 15px;
                font-weight: 600;
                color: #ffffff;
            }
        }

        .item-row:first-child {
            margin-top: 0px;
        }
    }
</style>