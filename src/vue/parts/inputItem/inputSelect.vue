<template>
    <div class="input-select-field">
        <div v-if="label" class="label">{{ label }}</div>

        <select v-if="itemArray.length" v-model="value" class="select">
            <option v-for="(item, i) in itemArray" :key="i" :value="item.value">{{ item.name }}</option>
        </select>

        <div v-else class="none-item">None item</div>
    </div>
</template>

<script>
    /**
     * template event : input
     */
    import Utils from '../../../class/utils';

    export default {
        props: {
            label: {type: String, default: ''},
            value: {type: String, default: ''},
            itemArray: {type: Array, default: []}
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
    .input-select-field {
        width: 100%;

        .label {
            width: 100%;
            margin-bottom: 0px;
            font-size: 15px;
            font-weight: 600;
            text-align: left;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }

        .select {
            width: 100%;
            border-radius: 0.25rem;
        }

        .none-item {
            width: 100%;
            border: 1px solid #5d5d5d;
            border-radius: 0.25rem;
            background-color: #5d5d5d;
            color: #bdbdbd;
            text-align: center;
        }
    }
</style>