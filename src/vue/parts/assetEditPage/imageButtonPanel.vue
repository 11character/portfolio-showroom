<template>
    <div class="image-button-panel-field">
        <input-image-button v-model="textureBtnArr" :item-array="textureItemArr" :disable-link="true" label="Texture button"></input-image-button>

        <div class="divider"></div>

        <input-image-button v-model="linkBtnArr" :item-array="linkItemArr" :disable-link="false" label="Link button"></input-image-button>
    </div>
</template>

<script>
    import * as StaticVariable from '../../../nemoShowroom/common/staticVariable';
    import * as ApiUrl from '../../../class/apiUrl';
    import Utils from '../../../class/utils';
    import SelectItem from '../../../class/selectItem';
    import AssetItem from '../../../nemoShowroom/common/assetItem';

    import inputImageButtonVue from '../inputItem/inputImageButton.vue';

    /**
     * template event : control
     */
    export default {
        components: {
            'input-image-button': inputImageButtonVue
        },
        props: {
            assetItem: {type: AssetItem}
        },
        data: function () {
            return {
                lockEvent: false,
                linkItemArr: [],
                linkBtnArr: [],
                textureItemArr: [],
                textureBtnArr: []
            };
        },
        watch: {
            assetItem: function (item) {
                const me = this;

                me.onChangeAssetItem(item);
            },
            linkBtnArr: {
                deep: true,
                handler: function (arr) {
                    const me = this;

                    me.assetItem.linkButtonArray = arr;

                    if (!me.lockEvent) {
                        me.$emit('control', 'linkButton');
                    }
                }
            },
            textureBtnArr: {
                deep: true,
                handler: function (arr) {
                    const me = this;

                    me.assetItem.textureButtonArray = arr;

                    if (!me.lockEvent) {
                        me.$emit('control', 'textureButton');
                    }
                }
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

                me.lockEvent = true;

                me.linkBtnArr = assetItem.linkButtonArray;
                me.textureBtnArr = assetItem.textureButtonArray;

                me.loadLinkImageList(assetItem);
                me.loadTextureList(assetItem);

                setTimeout(function () {
                    me.lockEvent = false;
                }, StaticVariable.INPUT_CONTROL_LOCK_TIME);
            },
            loadLinkImageList: function (assetItem) {
                const me = this;

                const id = Utils.urlToParentName(assetItem.itemUrl);

                Utils.apiRequest(ApiUrl.SHOP_IMAGE_LIST, {id: id}).then(function (data) {
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

                    me.linkItemArr = tempArr;

                }).catch(function () {
                    me.linkItemArr = [];
                });
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
            onControl: function (type) {
                const me = this;

                me.$emit('control', type);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .image-button-panel-field {
        .divider {
            width: 100%;
            height: 2px;
            margin: 2rem 0rem;
            background-color: #ffffff;
        }
    }
</style>