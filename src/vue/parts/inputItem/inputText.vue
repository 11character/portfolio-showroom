<template>
    <div class="input-text-field">
        <div v-if="label" class="label">{{ label }}</div>

        <input v-model.trim="value" type="text" class="input-text">
    </div>
</template>

<script>
    /**
     * template event : input
     */
    export default {
        props: {
            label: {type: String, default: ''},
            value: {type: String, default: ''}
        },
        watch: {
            value: function (val) {
                const me = this;

                me.$emit('input', val);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-text-field {
        width: 100%;

        .label {
            width: 100%;
            font-size: 15px;
            font-weight: 600;
            text-align: left;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }

        .input-text {
            width: 100%;
            height: 25px;
            padding: 0rem 0.5rem;
            border: 0px;
            border-radius: 0.25rem;
        }
    }
</style>