<template>
    <div class="input-image-select-field">
        <div v-if="label" class="label">{{ label }}</div>

        <div class="img-field">
            <div v-if="itemArray.length" class="img-bg">&times;</div>
            <div v-else class="img-bg none-item">&times;</div>

            <div ref="img" class="img"></div>
        </div>

        <div class="select-field">
            <input-select v-model="value" :item-array="itemArray"></input-select>
        </div>
    </div>
</template>

<script>
    import inputSelectVue from './inputSelect.vue';

    /**
     * template event : input
     */
    export default {
        components: {
            'input-select': inputSelectVue
        },
        props:  {
            label: {type: String, default: ''},
            value: {type: String, default: ''},
            itemArray: {type: Array, default: []}
        },
        watch: {
            value: function (val) {
                const me = this;

                me.onChangeValue(val);
            }
        },
        mounted: function () {
            const me = this;

            me.onChangeValue(me.value);
        },
        methods: {
            onChangeValue: function (url) {
                const me = this;

                if (url) {
                    $(me.$refs.img).css('backgroundImage', 'url(' + url + ')');

                } else {
                    $(me.$refs.img).css('backgroundImage', '');
                }

                me.$emit('input', url);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-image-select-field {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;

        .label {
            margin-bottom: 0px;
            font-size: 15px;
            font-weight: 600;
            color: #ffffff;
        }

        .img-field {
            width: 2rem;
            height: 2rem;
            position: relative;

            .img {
                width: 100%;
                height: 100%;
                position: absolute;
                margin-left: auto;
                border-radius: 0.25rem;
                background-size: 100%;
                background-position: center;
            }

            .img-bg {
                width: 100%;
                height: 100%;
                position: absolute;
                background-color: #ffffff;
                border-radius: 4px;
                font-weight: bold;
                display: flex;
                justify-content: center;
                align-items: center;
            };

            .none-item {
                background-color: #5d5d5d;
                color: #bdbdbd;
            }
        }

        .select-field {
            width: 100%;
            margin-top: 5px;
        }
    }
</style>