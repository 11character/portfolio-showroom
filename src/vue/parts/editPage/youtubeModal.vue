<template>
    <div class="import-modal modal fade" tabindex="-1" role="dialog" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-content-url">
                <div class="modal-head">
                    <div class="modal-title">
                        <img :src="'img/icon-youtube.png'" class="modal-title-img modal-title-img-youtube"> YouTube
                    </div>
                </div>

                <div class="modal-body">
                    <div class="row w-100">
                        <div class="col-12">
                            <input v-model.trim="content" type="text" class="modal-input col-12">
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <div @click="onClickClose" class="modal-footer-btn">
                        <span>취소</span>
                    </div>

                    <div @click="onClickOk" class="modal-footer-btn">
                        <span>확인</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../../class/apiUrl';
    import Utils from '../../../class/utils';

    /**
     * template event : apply
     */
    export default {
        data: function () {
            return {
                disabled: false,
                content: ''
            };
        },
        mounted: function () {
            const me = this;

            $(me.$el).on('hidden.bs.modal', function () {
                me.content = '';
            });
        },
        methods: {
            onClickClose: function () {
                const me = this;

                $(me.$el).modal('hide');
            },
            onClickOk: function () {
                const me = this;

                me.$emit('apply', me.content);

                $(me.$el).modal('hide');
            }
        }
    }
</script>

<style lang="scss" scope>
    @import "./modalStyle.scss";
</style>