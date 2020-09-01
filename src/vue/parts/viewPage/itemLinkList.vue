<template>
    <div class="item-link-list-field">
        <div class="item-link-list">
            <div v-for="(button, i) in buttonArray" :key="i" class="link-button">
                <img :src="button.url" :alt="button.name" @click="onClickLink(button.link)">
            </div>
        </div>
    </div>
</template>

<script>
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
                    me.buttonArray = item.linkButtonArray;
                }
            }
        },
        methods: {
            onClickLink: function (link) {
                window.open(link);
            }
        }
    }
</script>

<style lang="scss">
    .item-link-list-field {
        width: 100%;
        height: 100%;

        .item-link-list {
            width: 100%;
            height: 100%;
            overflow-x: auto;
            display: flex;
            flex-wrap: nowrap;

            .link-button {
                min-width: 200px;
                height: 100%;
                border: 1px solid #8d8d8d;
                cursor: pointer;

                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>