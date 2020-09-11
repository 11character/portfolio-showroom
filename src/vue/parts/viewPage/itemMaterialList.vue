<template>
    <div class="item-material-list-field disable-user-select">
        <div class="item-material-list">
            <div v-for="(button, i) in buttonArray" :key="i" class="texture-button">
                <img v-if="button.url" :src="button.url" :alt="i" @click="onClickMaterial(button)" class="texture-button-img">

                <div v-else @click="onClickMaterial(button)" class="texture-button-none-img">
                    <font-awesome-icon :icon="['fas', 'paint-brush']"></font-awesome-icon>&nbsp;{{ i + 1 }}
                </div>
            </div>
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
            onClickMaterial: function (button) {
                const me = this;

                me.assetItem.setMaterialOptions(button.materialOptions);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item-material-list-field {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;

        .disable-user-select {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .item-material-list {
            height: 100%;
            margin: 0px auto;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            overflow-x: auto;
            padding: 0rem 1rem;

            .texture-button {
                width: 90px;
                min-width: 90px;
                height: 90px;
                border-radius: 50%;
                margin: 8px 16px;
                background-color: #000000;
                cursor: pointer;

                .texture-button-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }

                .texture-button-none-img {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #ffffff;
                    font-size: 1.5rem;
                }
            }

            .texture-button:hover {
                border: 3px solid #ffffff;
                border-width: 3px;
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