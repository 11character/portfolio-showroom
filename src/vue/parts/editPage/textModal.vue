<template>
    <div class="import-modal modal fade" tabindex="-1" role="dialog" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-content-text">
                <div class="modal-head">
                    <div class="modal-title">
                        <img :src="'img/icon-text.png'" class="modal-title-img modal-title-img-text"> Text
                    </div>
                </div>

                <div class="modal-body">
                    <div class="row w-100">
                        <div class="col-12">
                            <button type="button" class="text-page-color w-100 btn btn-outline-secondary">배경색</button>
                        </div>

                        <div class="col-12 mt-3 font-neuemachina">
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

    import 'summernote/dist/summernote-bs4';
    import 'summernote/dist/summernote-bs4.css';

    import Pickr from '@simonwep/pickr';
    import '@simonwep/pickr/dist/themes/monolith.min.css';

    /**
    * template event : apply
    */
    export default {
        data: function () {
            return {
                disabled: false,
                colorPickr: null,
                jTextEditor: null
            };
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

            // Color picker ====================================================================================================
            me.colorPickr = Pickr.create({
                el: '.text-page-color',
                useAsButton: true,
                theme: 'monolith',
                default: '#ffffff',
                components: {
                    preview: true,
                    opacity: true,
                    hue: true,
                    interaction: {
                        hex: true,
                        rgba: true,
                        input: true
                    }
                }
            }).on('change', function (color) {
                $(me.$el).find('.note-editable').css('backgroundColor', color.toHEXA());

            }).on('show', function (instance) {
                const color = '#ffffff';

                $(me.$el).find('.note-editable').css('backgroundColor', color);
                instance.setColor(color);
            });
            // END-Color picker ====================================================================================================

            $(me.$el).on('hidden.bs.modal', function () {
                me.jTextEditor.summernote('code', '');
            });
        },
        beforeDestroy: function () {
            const me = this;

            me.colorPickr.destroy();
            me.colorPickr = null;

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
                    backgroundColor: me.colorPickr.getColor().toHEXA()
                };

                me.$emit('apply', data);

                me.close();
            }
        }
    }
</script>

<style lang="scss" scope>
    @import "./modalStyle.scss";
</style>