<template>
    <div class="input-number-field">
        <div v-if="label" class="label">{{ label }}</div>

        <div :class="inputFieldStyle">
            <div v-if="subLabel" class="label">{{ subLabel }}</div>

            <button @mousedown="onMousedown(-1)" @mouseup="onMouseup" @mouseleave="onMouseup" type="button" class="num-btn num-btn-left" tabindex="-1">-</button>

            <input v-model.number="value" type="number" class="input-number">

            <button @mousedown="onMousedown(1)" @mouseup="onMouseup" @mouseleave="onMouseup" type="button" class="num-btn num-btn-right" tabindex="-1">＋</button>
        </div>
    </div>
</template>

<script>
    /**
     * template event : input
     */
    export default {
        props: {
            label: {type: String, default: ''},
            subLabel: {type: String, default: ''},
            value: {type: Number, default: 0},
            step: {type: Number, default: 1}
        },
        data: function () {
            const me = this;

            return {
                inputFieldStyle: {
                    'input-field': true,
                    'sub-label': !me.subLabel
                },
                btnTimeout: null,
                btnInterval: null
            };
        },
        watch: {
            value: function (num) {
                const me = this;

                me.$emit('input', num);
            }
        },
        methods: {
            onMousedown: function (sign) {
                const me = this;

                me.value += (me.step * sign);

                clearTimeout(me.btnTimeout);
                clearInterval(me.btnInterval);

                me.btnTimeout = setTimeout(function () {
                    me.autoAction(sign);
                }, 500);
            },
            onMouseup: function () {
                const me = this;

                clearTimeout(me.btnTimeout);
                clearInterval(me.btnInterval);
            },
            autoAction: function (sign) {
                const me = this;

                me.btnInterval = setInterval(function () {
                    let val = me.value;

                    val += (me.step * sign);
                    me.value = val.toFixed(3);
                }, 10);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-number-field {
        width: 100%;

        .label {
            width: 100%;
            font-size: 15px;
            font-weight: 600;
            text-align: left;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }

        .input-field {
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;

            .label {
                width: 20%;
                margin-bottom: 0px;
                text-align: center;
            }

            .num-btn {
                width: 15%;
                height: 25px;
                border: 1px solid #5d5d5d;
                background-color: #5d5d5d;
                color: #ffffff;
                font-weight: bold;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .num-btn:hover {
                background-color: #8c8c8c;
            }

            .num-btn-left {
                border-top-left-radius: 0.25rem;
                border-bottom-left-radius: 0.25rem;
            }

            .num-btn-right {
                border-top-right-radius: 0.25rem;
                border-bottom-right-radius: 0.25rem;
            }

            .input-number {
                width: 50%;
                height: 25px;
                background-color: #f6f6f6;
                border: 0px;
                text-align: center;
                font-size: 14px;
                -moz-appearance: textfield;
            }

            .input-number::-webkit-outer-spin-button,
            .input-number::-webkit-inner-spin-button {
                -webkit-appearance: none;
            }
        }

        .sub-label {
            .input-number {
                width: 70%;
            }
        }
    }
</style>