<template>
    <div class="modal fade" tabindex="-1" data-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <slot name="message"></slot>
                </div>

                <div class="modal-footer">
                    <button :disabled="disabled" @click="onClickOk" type="button" class="btn btn-primary">OK</button>
                    <button :disabled="disabled" @click="onClickClose" type="button" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';

    /**
     * template event : confirm
     */
    export default {
        props: {
            disableOkHide: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            const me = this;

            return {
                disableOkHide: false
            };
        },
        methods: {
            open: function () {
                const me = this;

                $(me.$el).modal('show');
            },
            close: function () {
                const me = this;

                $(me.$el).modal('hide');
            },
            onClickOk: function() {
                const me = this;

                if (!me.disableOkHide) {
                    me.close();
                }

                me.$emit('confirm', true);
            },
            onClickClose: function() {
                const me = this;

                me.close();

                me.$emit('confirm', false);
            }
        },
    }
</script>