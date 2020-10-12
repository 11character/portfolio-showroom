<template>
    <div class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <slot name="content"></slot>
                </div>

                <div class="modal-footer">
                    <button :disabled="disabled" @click="onClickOk" type="button" class="btn btn-primary">OK</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * template event : confirm
     */
    export default {
        props: {
            disableOkHide: {type: Boolean, default: false},
            disabled: {type: Boolean, default: false}
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

                me.close();

                me.$emit('confirm', true);
            }
        },
    }
</script>