<template>
    <div class="import-modal modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-content-text disable-user-select">
                <div class="modal-head">
                    <div class="modal-title">
                        <img :src="'img/icon-text.png'" class="modal-title-img modal-title-img-text"> Text
                    </div>
                </div>

                <div class="modal-body">
                    <div class="row w-100">
                        <div class="col-12">
                            <input-color v-model="bgColor" label="배경색"></input-color>
                        </div>

                        <div class="col-12 mt-3 font-showroom">
                            <textarea class="col-12" style="resize:none;"></textarea>
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

    import InputColorVue from '../inputItem/inputColor.vue';

    import 'summernote/dist/summernote-bs4';
    import 'summernote/dist/summernote-bs4.css';

    import '@simonwep/pickr/dist/themes/monolith.min.css';

    /**
    * template event : apply
    */
    export default {
        components: {
            'input-color': InputColorVue
        },
        data: function () {
            return {
                disabled: false,
                bgColor: 'rgba(255, 255, 255, 1)',
                jTextEditor: null
            };
        },
        watch: {
            bgColor: function (color) {
                const me = this;

                $(me.$el).find('.note-editable').css('backgroundColor', color);
            }
        },
        mounted: function () {
            const me = this;

            // Text editor ====================================================================================================
            me.jTextEditor = $(me.$el).find('textarea').summernote({
                height: 180,
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['fontsize', ['fontsize']],
                    ['color', ['color']],
                    ['para', ['paragraph']],
                    ['height', ['height']]
                ]
            });
            // END-Text editor ====================================================================================================

            $(me.$el).on('hidden.bs.modal', function () {
                me.jTextEditor.summernote('code', '');
            });
        },
        beforeDestroy: function () {
            const me = this;

            me.jTextEditor.summernote('destroy');
            me.jTextEditor = null;
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
            onClickClose: function () {
                const me = this;

                me.close();
            },
            onClickOk: function () {
                const me = this;

                const data = {
                    html: me.jTextEditor.summernote('code'),
                    backgroundColor: me.bgColor
                };

                me.$emit('apply', data);

                me.close();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./modalStyle.scss";
</style>