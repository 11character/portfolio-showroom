<template>
    <div class="item-link-list-field">
        <div class="item-link-list">
            <div v-for="(button, i) in buttonArray" :key="i" class="link-button">
                <img v-if="button.url" :src="button.url" :alt="button.name" @click="onClickLink(button.link)">

                <div v-else @click="onClickLink(button.link)" class="none-img">
                    <font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon>&nbsp;{{ i + 1 }}
                </div>
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

                } else {
                    me.buttonArray = [];
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

<style lang="scss" scoped>
    .item-link-list-field {
        width: 100%;
        height: 100%;

        .item-link-list {
            width: 100%;
            height: 100%;
            overflow-x: auto;
            display: flex;

            .link-button {
                width: 200px;
                min-width: 200px;
                height: 100%;
                border: 1px solid #8d8d8d;
                cursor: pointer;

                img {
                    width: 100%;
                    height: 100%;
                }

                .none-img {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
</style>