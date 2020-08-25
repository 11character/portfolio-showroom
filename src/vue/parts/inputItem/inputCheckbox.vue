<template>
    <div class="input-checkbox-field">
        <div v-if="label" class="label">{{ label }}</div>

        <input v-model="value" type="checkbox" class="input-checkbox">
    </div>
</template>

<script>
    /**
     * template event : input
     */
    export default {
        props: {
            label: {type: String, default: ''},
            value: {type: Boolean, default: ''}
        },
        watch: {
            value: function (bool) {
                const me = this;

                me.$emit('input', bool);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-checkbox-field {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        .label {
            width: 100%;
            font-size: 15px;
            font-weight: 600;
            text-align: center;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }

        .input-checkbox {
            -ms-transform: scale(2); /* IE */
            -moz-transform: scale(2); /* FF */
            -webkit-transform: scale(2); /* Safari and Chrome */
            -o-transform: scale(2); /* Opera */
            transform: scale(2);
        }
    }
</style>