<template>
    <div class="field">
        <label :for="inputId" class="label">{{ label }}</label>
        <input v-model.trim="value" :id="inputId" type="text" class="input">
    </div>
</template>

<script>
    export default {
        props: {
            label: {type: String, default: ''},
            value: {type: String, default: ''}
        },
        watch: {
            value: function () {
                const me = this;

                me.$emit('input', me.value);
            }
        },
        data: function () {
            const me = this;

            return {
                inputId: 'input-' + me._uid
            }
        }
    }
</script>

<style lang="scss" scoped>
    .field {
        width: 100%;

        .label {
            width: 38%;
            font-size: 15px;
            font-weight: 600;
            color: #ffffff;
        }

        .input {
            width: 60%;
            border: 0px;
        }
    }
</style>