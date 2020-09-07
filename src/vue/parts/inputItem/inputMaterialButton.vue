<template>
    <div class="input-material-button-field">
        <div class="header">
            <div class="label">{{ label }}</div>

            <div @click="onClickAdd" class="item-btn">
                <font-awesome-icon :icon="['fas', 'plus-square']"></font-awesome-icon>
            </div>
        </div>

        <div class="body">
            <div v-for="(button, i) in value" :key="i" class="image-button">
                <div class="button-item">
                    <span @click="onClickDelete(i)" class="item-btn">
                        <font-awesome-icon :icon="['fas', 'minus-square']"></font-awesome-icon>
                    </span>

                    <div class="button-img">
                        <img v-if="button.url" :src="button.url">
                        <div v-else class="img-bg"></div>
                    </div>
                </div>

                <div class="button-item">
                    <button @click="onClickOpen(button)" type="button" class="modal-btn" tabindex="-1">{{ button.name || 'Noname' }}</button>
                </div>
            </div>
        </div>

        <div ref="materialModal" class="modal fade" tabindex="-1" data-backdrop="static">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="info-field">
                            <input-image-select v-model="imgUrl" :item-array="itemArr" class="button-info" label="Button image"></input-image-select>

                            <input-text v-model="name" class="button-info" label="Name"></input-text>
                        </div>

                        <input-material-options v-model="selectButton" :asset-item="viewAssetItem" @control="onControl" ref="inputMaterialOptions"></input-material-options>
                    </div>

                    <div class="modal-footer">
                        <button @click="onClickClose" type="button" class="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../../class/apiUrl';
    import Utils from '../../../class/utils';
    import AssetItem from '../../../nemoShowroom/common/assetItem';
    import MaterialButton from '../../../nemoShowroom/common/materialButton';
    import SelectItem from '../../../class/selectItem';

    import inputTextVue from '../inputItem/inputText.vue';
    import inputImageSelectVue from '../inputItem/inputImageSelect.vue';
    import inputMaterialButtonOptionsVue from '../inputItem/inputMaterialButtonOptions.vue';

    /**
     * template event : input, control
     */
    export default {
        components: {
            'input-text': inputTextVue,
            'input-image-select': inputImageSelectVue,
            'input-material-options': inputMaterialButtonOptionsVue
        },
        props: {
            label: {type: String},
            value: {type: Array, default: []},
            assetItem: {type: AssetItem}
        },
        data: function () {
            return {
                imgUrl: '',
                name: '',
                itemArr: [],
                viewAssetItem: null,
                selectButton: null
            }
        },
        watch: {
            imgUrl: function (url) {
                const me = this;

                if (me.selectButton) {
                    me.selectButton.url = url;
                }
            },
            name: function (name) {
                const me = this;

                if (me.selectButton) {
                    me.selectButton.name = name;
                }
            },
            selectButton: function (button) {
                const me = this;

                if (button) {
                    me.name = button.name;
                    me.imgUrl = button.url;
                }
            }
        },
        mounted: function () {
            const me = this;

            if (me.assetItem) {
                me.loadBtnImageList(me.assetItem);
            }

            $(me.$refs.materialModal).on('shown.bs.modal', function () {
                me.$refs.inputMaterialOptions.resize();
            });
        },
        methods: {
            loadBtnImageList: function (assetItem) {
                const me = this;

                const id = Utils.urlToParentName(assetItem.itemUrl);

                Utils.apiRequest(ApiUrl.THUMBNAIL_LIST, {id: id}).then(function (data) {
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

                    me.itemArr = tempArr;

                }).catch(function () {
                    me.itemArr = [];
                });
            },
            onClickAdd: function () {
                const me = this;

                me.value.push(new MaterialButton());
            },
            onClickDelete: function (index) {
                const me = this;

                me.value.splice(index, 1);
            },
            onClickOpen: function (button) {
                const me = this;

                me.viewAssetItem = me.assetItem;

                if (me.selectButton == button) {
                    me.$refs.inputMaterialOptions.cameraReset();

                } else {
                    me.selectButton = button;
                }

                me.$refs.inputMaterialOptions.viewStart();

                $(me.$refs.materialModal).modal('show');
            },
            onClickClose: function () {
                const me = this;

                me.$refs.inputMaterialOptions.viewStop();

                $(me.$refs.materialModal).modal('hide');
            },
            onControl: function (type) {
                const me = this;

                me.$emit('input', me.value);
                me.$emit('control', type);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-material-button-field {
        width: 100%;
        border: 1px solid #8c8c8c;
        border-radius: 0.25rem;
        padding: 1.25rem;

        .item-btn {
            color: #ffffff;
            font-size: 1.5rem;
            cursor: pointer;
        }

        .header {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            border-bottom: 1px solid #8c8c8c;

            .label {
                width: 80%;
                display: flex;
                justify-content: left;
                align-items: center;
                font-size: 15px;
                font-weight: 600;
                color: #ffffff;
            }
        }

        .body {
            .image-button {
                border: 1px solid #8c8c8c;
                border-radius: 0.25rem;
                padding: 1.25rem;
                padding-top: 0px;
                margin-top: 1rem;

                .button-item {
                    margin-top: 5px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .modal-btn {
                        width: 100%;
                        height: 36px;
                        border: 1px solid #5d5d5d;
                        background-color: #5d5d5d;
                        color: #bdbdbd;
                        border-radius: 0.25rem;
                        text-align: center;
                        overflow: hidden;
                        white-space:nowrap;
                        word-wrap:normal;
                        text-overflow:ellipsis;
                    }

                    .modal-btn:hover {
                        background-color: #8c8c8c;
                        color: #eaeaea;
                    }

                    .button-img {
                        width: 1.5rem;
                        height: 1.5rem;

                        img {
                            width: 100%;
                            height: 100%;
                        }

                        .img-bg {
                            width: 100%;
                            height: 100%;
                            background-color: #5d5d5d;
                            border-radius: 4px;
                            font-weight: bold;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                }

                .button-timw:first-child {
                    margin-top: 0px;
                }
            }
        }

        .modal-body {
            .info-field {
                padding: 1rem;
                background-color: #343a40;
                margin-bottom: 1rem;

                & > div:first-child {
                    margin-bottom: 1rem;
                }
            }
        }
    }
</style>