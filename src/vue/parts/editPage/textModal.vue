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

                        <div class="col-12 mt-3">
                            <textarea class="col-12" style="resize:none;"></textarea>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <div @click="onClickClose" class="modal-footer-btn">
                        <span>취소</span>
                    </div>

                    <div @click="onClickClose" class="modal-footer-btn">
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
                instance.setColor($(me.$el).find('.note-editable').css('backgroundColor') || '#ffffff');
            });
            // END-Color picker ====================================================================================================
        },
        beforeDestroy: function () {
            const me = this;

            me.colorPickr.destroy();
            me.colorPickr = null;

            me.jTextEditor.summernote('destroy');
            me.jTextEditor = null;
        },
        methods: {
            onClickClose: function () {
                const me = this;

                $(me.$el).modal('hide');
            },
            onClickOk: function () {
                const me = this;

                $(me.$el).modal('hide');
            }
        }
    }
</script>

<style lang="scss" scope>
    .import-modal {
        .modal-title-img {
            margin-right: 10px;
        }

        .modal-body {
            display: flex;
            justify-content: center;
            align-items: center;

            .modal-input {
                height: 36px;
                display: block;
                border-radius: 3px;
                background-color: #ffffff;
                border: solid 1px #d8e0eb;
                padding: 0px 1rem;
            }
        }

        .modal-footer {
            padding: 0px;
            display: flex;
            justify-content: space-around;
            align-content: center;

            .modal-footer-btn {
                width: 200px;
                height: 58px;
                display: inline-block;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                font-style: normal;
                font-stretch: normal;
                line-height: 57px;
                letter-spacing: 0.2px;
                color: #bdbdbd;
                cursor: pointer;
            }

            .modal-footer-btn:hover {
                color: #ffffff;
            }
        }

        .modal-content-url {
            border-radius: 3px;
            background-color: rgba(60, 65, 80, 0.8);
            box-shadow: 0 2px 24px 0 rgba(74, 78, 90, 0.4);
            user-select: none;

            .modal-title {
                color: #ffffff;
                font-size: 15pt;
                margin-top: 30px;
                margin-left: 24px;
            }

            .modal-title-img-webpage {
                width: 32px;
                height: 32px;
            }

            .modal-title-img-youtube {
                width: 32px;
                height: 22px;
            }
        }

        .modal-content-text {
            border-radius: 3px;
            background-color: rgba(60, 65, 80, 0.8);
            box-shadow: 0 2px 24px 0 rgba(74, 78, 90, 0.4);
            user-select: none;

            .modal-title {
                color: #ffffff;
                font-size: 15pt;
                margin-top: 30px;
                margin-left: 24px;
            }

            .modal-title-img-text {
                width: 32px;
                height: 22px;
            }
        }

        .modal-content-model-file {
            border-radius: 3px;
            background-color: rgba(60, 65, 80, 0.8);
            box-shadow: 0 2px 24px 0 rgba(74, 78, 90, 0.4);
            user-select: none;

            .modal-title {
                color: #ffffff;
                font-size: 15pt;
                margin-top: 30px;
                margin-left: 24px;
            }

            .modal-title-img-model-file {
                width: 35px;
                height: 39px;
            }

            .table-background {
                border-radius: 3px;
                background-color: #ffffff;

                table {
                    table-layout: fixed;
                }

                .search-field {
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: 10px;

                    label {
                        width: 225px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        input {
                            width: 168px;
                        }
                    }
                }

                .paginate-field {
                    margin-left: auto;
                    margin-right: auto;
                    margin-bottom: 10px;

                    .page-link {
                        color: #3c4150;
                    }

                    .page-item.active .page-link {
                        background-color: #3c4150;
                        border-color: #3c4150;
                        color: #ffffff;
                    }
                }

                table.dataTable tbody>tr.selected,
                table.dataTable tbody>tr>.selected {
                    background-color: #3c4150;
                    color: #ffffff;
                }

                .column-text {
                    white-space : nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .column-text-type {
                    text-align: center;
                }
            }
        }
    }
</style>