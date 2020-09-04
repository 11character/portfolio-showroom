<template>
    <div class="item-material-list-field disable-user-select">
        <div class="item-material-list">
            <img v-for="(button, i) in buttonArray" :key="i" :src="button.url" :alt="button.name" @click="onClickMaterial(button)" class="texture-button">
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
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid #ffffff;
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
                display: block;
                width: 90px;
                min-width: 90px;
                height: 90px;
                border: 1px solid #000000;
                margin: 8px 8px;
                float: left;
                cursor: pointer;
            }

            .texture-button:hover {
                border-color: #ffffff;
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