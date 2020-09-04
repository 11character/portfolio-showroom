<template>
    <div class="item-texture-list-field">
        <div class="item-texture-list">
            <img v-for="(button, i) in buttonArray" :key="i" :src="button.url" :alt="button.name" @click="onClickTexture(button.url)" class="texture-button">
        </div>
    </div>
</template>

<script>
    import MaterialOption from '../../../nemoShowroom/common/materialOption';
    import ImageButton from '../../../nemoShowroom/common/imageButton';

    export default {
        props: ['assetItem'],
        data: function () {
            return {
                buttonArray: []
            };
        },
        watch: {
            assetItem: function (item) {
                const me = this;

                if (item) {
                    me.buttonArray = item.materialButtonArray;
                }
            }
        },
        methods: {
            onClickTexture: function (url) {
                const me = this;

                const materialOption = new MaterialOption({
                    map: url
                });

                me.assetItem.setMaterialOption(materialOption, 0);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item-texture-list-field {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid #ffffff;
        display: flex;
        justify-content: center;

        .item-texture-list {
            height: 100%;
            margin: 0px auto;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            overflow-x: auto;

            .texture-button {
                display: block;
                width: 70px;
                min-width: 70px;
                height: 70px;
                border: 1px solid #000000;
                margin: 8px 8px;
                float: left;
            }

            .texture-button:hover {
                border-color: #ffffff;
                box-shadow: 0px 0px 5px 3px #ffffff;
            }

            .texture-button:first-child {
                margin-left: 0rem;
            }

            .texture-button:last-child {
                margin-right: 0rem;
            }
        }
    }
</style>