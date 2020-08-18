<template>
    <div class="input-cube-texture-field">
        <label v-if="label" class="label">{{ label }}</label>

        <div class="select-field">
            <input-image-select v-model="urls.px" :item-array="itemArray" label="Px" class="img-select"></input-image-select>
            <input-image-select v-model="urls.nx" :item-array="itemArray" label="Nx" class="img-select"></input-image-select>
            <input-image-select v-model="urls.py" :item-array="itemArray" label="Py" class="img-select"></input-image-select>
            <input-image-select v-model="urls.ny" :item-array="itemArray" label="Ny" class="img-select"></input-image-select>
            <input-image-select v-model="urls.pz" :item-array="itemArray" label="Pz" class="img-select"></input-image-select>
            <input-image-select v-model="urls.nz" :item-array="itemArray" label="Nz" class="img-select"></input-image-select>
        </div>
    </div>
</template>

<script>
    import inputImageSelectVue from './inputImageSelect.vue';

    export default {
        components: {
            'input-image-select': inputImageSelectVue
        },
        props: {
            label: {type: String, default: ''},
            itemArray: {type: Array, default: []},
            value: {type: Array, default: []}
        },
        data: function () {
            return {
                urls: {
                    px: '',
                    nx: '',
                    py: '',
                    ny: '',
                    pz: '',
                    nz: ''
                }
            };
        },
        watch: {
            value: {
                deep: true,
                handler: function (arr) {
                    const me = this;

                    me.onChangeValue(arr);
                }
            },
            urls: {
                deep: true,
                handler: function (obj) {
                    const me = this;

                    const arr = [];

                    for (let key in obj) {
                        if (obj[key]) {
                            arr.push(obj[key]);
                        }
                    }

                    if (arr.length == 6) {
                        me.$emit('input', arr);
                    }
                }
            }
        },
        mounted: function () {
            const me = this;

            me.onChangeValue(me.value);
        },
        methods: {
            onChangeValue: function (arr) {
                const me = this;

                me.urls.px = arr[0] || '';
                me.urls.nx = arr[1] || '';
                me.urls.py = arr[2] || '';
                me.urls.ny = arr[3] || '';
                me.urls.pz = arr[4] || '';
                me.urls.nz = arr[5] || '';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-cube-texture-field {
        width: 100%;

        .label {
            width: 100%;
            margin-bottom: 0px;
            font-size: 15px;
            font-weight: 600;
            color: #ffffff;
        }

        .select-field {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .img-select {
                width: 47%;
                margin-top: 0.5rem;
            }
        }
    }
</style>