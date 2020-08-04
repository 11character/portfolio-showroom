<template>
    <div class="field">
        <div class="label">{{ label }}</div>
        <div class="value">{{ value }}</div>
        <div ref="slider" class="slider"></div>
    </div>
</template>

<script>
    export default {
        props: {
            min: {default: 0},
            max: {default: 1},
            step: {default: 0.1},
            value: {default: 0.5},
            label: {default: ''},
        },
        watch: {
            value: function (val) {
                const me = this;

                val = val < me.min ? me.min : val;
                val = val > me.max ? me.max : val;

                $(me.$refs.slider).slider('value', val);
            }
        },
        mounted: function () {
            const me = this;

            $(me.$refs.slider).slider({
                min: me.nim,
                max: me.max,
                step: me.step,
                value: me.value

            }).on('slide', function (evt, ui) {
                me.$emit('input', ui.value);
            });
        }
    }
</script>

<style lang="scss" scoped>
    .field {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;

        .label {
            width: 70%;
            font-size: 15px;
            font-weight: 600;
            text-align: left;
            color: #ffffff;
        }

        .value {
            width: 30%;
            border-radius: 2px;
            background-color: #5d5d5d;
            border: solid 1px #5d5d5d;
            color: #bdbdbd;
            text-align: center;
            font-size: 14px;
        }

        .slider {
            margin-top: 10px;
            width: 100%;
        }
    }
</style>