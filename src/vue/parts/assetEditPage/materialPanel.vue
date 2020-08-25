<template>
    <div v-if="material" class="material-panel-field">
        <div class="item-row">
            <label class="label">{{ material.type }}</label>
        </div>

        <div v-if="typeof material.roughness != 'undefined'" class="item-row">
            <input-slider v-model="mtlRoughness" label="Roughness"></input-slider>
        </div>

        <div v-if="typeof material.metalness != 'undefined'" class="item-row">
            <input-slider v-model="mtlMetalness" label="Metalness"></input-slider>
        </div>

        <div v-if="typeof material.color != 'undefined'" class="item-row">
            <input-color v-model="mtlColor" label="Color"></input-color>
        </div>

        <div v-if="typeof material.map != 'undefined'" class="item-row">
            <input-image-select v-model="mtlMap" :item-array="textureItemArr" label="Map"></input-image-select>
        </div>

        <div v-if="typeof material.normalMap != 'undefined'" class="item-row">
            <input-image-select v-model="mtlNormalMap" :item-array="textureItemArr" label="Normal map"></input-image-select>
        </div>

        <div v-if="typeof material.roughnessMap != 'undefined'" class="item-row">
            <input-image-select v-model="mtlRoughnessMap" :item-array="textureItemArr" label="Roughness map"></input-image-select>
        </div>

        <div v-if="typeof material.metalnessMap != 'undefined'" class="item-row">
            <input-image-select v-model="mtlMetalnessMap" :item-array="textureItemArr" label="Metalness map"></input-image-select>
        </div>

        <div v-if="typeof material.emissive != 'undefined'" class="item-row">
            <input-color v-model="mtlEmissive" label="Emissive"></input-color>
        </div>

        <div v-if="typeof material.envMap != 'undefined'" class="item-row">
            <input-cube-texture v-model="mtlEnvMap" :item-array="cubeTextureItemArr" label="Env map"></input-cube-texture>
        </div>

        <div v-if="typeof material.reflectivity != 'undefined'" class="item-row">
            <input-slider v-model="mtlReflectivity" label="Reflectivity"></input-slider>
        </div>
    </div>
</template>

<script>
    import * as StaticVariable from '../../../nemoShowroom/common/staticVariable';
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
                lockInputEvent: false,
                materialOption: new MaterialOption(),
                textureItemArr: [],
                cubeTextureItemArr: [],
                mtlRoughness: 1,
                mtlMetalness: 0.5,
                mtlColor: 'rgb(255, 255, 255)',
                mtlMap: '',
                mtlNormalMap: '',
                mtlMetalnessMap: '',
                mtlRoughnessMap: '',
                mtlEmissive: 'rgb(0, 0, 0)',
                mtlEnvMap: [],
                mtlReflectivity: 0
            };
        },
        watch: {
            assetItem: function (assetItem) {
                const me = this;

                me.onChangeAssetItem(assetItem);
            },
            mtlRoughness: function (roughness) {
                const me = this;

                me.setMtlOption();
            },
            mtlMetalness: function (metalness) {
                const me = this;

                me.setMtlOption();
            },
            mtlColor: function (color) {
                const me = this;

                me.setMtlOption();
            },
            mtlMap: function (map) {
                const me = this;

                me.setMtlOption();
            },
            mtlNormalMap: function (normalMap) {
                const me = this;

                me.setMtlOption();
            },
            mtlMetalnessMap: function (metalnessMap) {
                const me = this;

                me.setMtlOption();
            },
            mtlRoughnessMap: function (roughnessMap) {
                const me = this;

                me.setMtlOption();
            },
            mtlEmissive: function (emissive) {
                const me = this;

                me.setMtlOption();
            },
            mtlEnvMap: function (envMap) {
                const me = this;

                me.setMtlOption();
            },
            mtlReflectivity: function (reflectivity) {
                const me = this;

                me.setMtlOption();
            }
        },
        mounted: function () {
            const me = this;

            me.onChangeAssetItem(me.assetItem);
        },
        methods: {
            setMtlOption: function () {
                const me = this;

                if (!me.lockInputEvent) {
                    const materialOption = new MaterialOption({
                        roughness: me.mtlRoughness,
                        metalness: me.mtlMetalness,
                        color: me.mtlColor,
                        map: me.mtlMap,
                        normalMap: me.mtlNormalMap,
                        metalnessMap: me.mtlMetalnessMap,
                        roughnessMap: me.mtlRoughnessMap,
                        emissive: me.mtlEmissive,
                        envMap: me.mtlEnvMap,
                        reflectivity: me.mtlReflectivity
                    });
    
                    me.assetItem.setMaterialOption(materialOption, me.index);
    
                    me.$emit('control', 'material');
                }
            },
            setMtlData: function (materialOption) {
                const me = this;

                me.lockInputEvent = true;

                me.mtlRoughness = materialOption.roughness;
                me.mtlMetalness = materialOption.metalness;
                me.mtlColor = materialOption.color;
                me.mtlMap = materialOption.map;
                me.mtlNormalMap = materialOption.normalMap;
                me.mtlMetalnessMap = materialOption.metalnessMap;
                me.mtlRoughnessMap = materialOption.roughnessMap;
                me.mtlEmissive = materialOption.emissive;
                me.mtlEnvMap = materialOption.envMap;
                me.mtlReflectivity = materialOption.reflectivity;

                setTimeout(function () {
                    me.lockInputEvent = false;
                }, StaticVariable.INPUT_CONTROL_LOCK_TIME);
            },
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
                    me.loadTextureList(assetItem);
                    me.loadCubeTextureList(assetItem);

                    const materialOption = assetItem.materialOptions[me.index] || new MaterialOption();

                    me.setMtlData(materialOption);
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