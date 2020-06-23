<template>
    <div :class="className" tabindex="-1" data-backdrop="static">
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
     * template event names : confirm
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
                className: 'modal fade confirm-modal-' + me._uid,
                disableOkHide: false
            };
        },
        methods: {
            onClickOk: function() {
                const me = this;

                if (!me.disableOkHide) {
                    $('.confirm-modal-' + me._uid).modal('hide');
                }

                me.$emit('confirm', true);
            },
            onClickClose: function() {
                const me = this;

                $('.confirm-modal-' + me._uid).modal('hide');

                me.$emit('confirm', false);
            }
        },
    }
</script>