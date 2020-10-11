<template>
    <div class="input-date-field">
        <div v-if="label" class="label">{{ label }}</div>

        <input v-model="value" type="text" ref="inputDate" class="input-date">
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
                me.setDate(me);
            }
        },
        mounted: function () {
            const me = this;

            $(me.$refs.inputDate).datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (dateStr) {
                    me.$emit('input', dateStr);
                }
            });

            me.setDate(me.value);
        },
        methods: {
            setDate(d) {
                const me = this;

                if (typeof d == 'string') {
                    d = d.replace('-', '/');
                }

                const date = new Date(d);

                $(me.$refs.inputDate).datepicker('setDate', date);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-date-field {
        width: 100%;

        .label {
            width: 100%;
            font-size: 15px;
            font-weight: 600;
            text-align: left;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }

        .input-date {
            width: 100%;
            height: 25px;
            text-align: center;
            border: 0px;
            border-radius: 0.25rem;
        }
    }
</style>