<template>
    <div class="input-image-button-field">
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
                </div>

                <input-image-select v-model="button.url" :item-array="itemArray" class="button-item" label="Image"></input-image-select>
                <input-text v-model="button.name" class="button-item" label="Name"></input-text>
                <input-text v-if="!disableLink" v-model="button.link" class="button-item" label="Link"></input-text>
            </div>
        </div>
    </div>
</template>

<script>
    import ImageButton from '../../../nemoShowroom/common/imageButton';

    import inputTextVue from '../inputItem/inputText.vue';
    import inputImageSelectVue from '../inputItem/inputImageSelect.vue';

    /**
     * template event : input
     */
    export default {
        components: {
            'input-text': inputTextVue,
            'input-image-select': inputImageSelectVue
        },
        props: {
            label: {type: String},
            value: {type: Array, default: []},
            itemArray: {type: Array, default: []},
            disableLink: {type: Boolean, default: false}
        },
        watch: {
            value: {
                deep: true,
                handler: function (arr) {
                    const me = this;

                    me.$emit('input', arr);
                }
            }
        },
        methods: {
            onClickAdd: function () {
                const me = this;

                me.value.push(new ImageButton());
            },
            onClickDelete: function (index) {
                const me = this;

                me.value.splice(index, 1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-image-button-field {
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
                }

                .button-timw:first-child {
                    margin-top: 0px;
                }
            }
        }
    }
</style>