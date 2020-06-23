<template>
    <div class="import-modal modal fade" tabindex="-1" role="dialog" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-content-model-file">
                <div class="modal-head">
                    <p class="modal-title">
                        <img :src="'./img/icon-model-file.png'" class="modal-title-img modal-title-img-model-file"> Model
                    </p>
                </div>
                <div class="modal-body">
                    <div class="row w-100">
                        <div class="col-12">
                            <div class="table-background col-12">
                                <table class="model-file-table table table-striped" style="width: 100%;">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Type</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
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
    import ObjectFile from '../../../class/objectFile';

    export default {
        data: function () {
            return {
                disabled: false,
                selectObjectFile: new ObjectFile(),
                fileArr: [],
                search: ''
            };
        },
        mounted: function () {
            const me = this;

            $('.model-file-table').DataTable({
                ajax: {
                    url: ApiUrl.FILE_LIST,
                    dataSrc: 'data'
                },
                autoWidth: false,
                lengthChange: false,
                info: false,
                pagingType: 'numbers',
                select: {
                    style: 'multi',
                    items: 'row'
                },
                columns: [
                    {className: 'column-text column-text-user', width: '20%', data: 'TYPE_CODE', render: function (data) {
                        return data == 0 ? '벽' : '물건';
                    }},
                    {className: 'column-text column-text-name', width: '60%', data: 'NAME'},
                    {className: 'column-text column-text-type', width: '20%', data: 'EXT'}
                ]

            }).on('init.dt', function () {
                // 스카일을 적용하기 위한 클래스 삽입.
                // 브라우저의 개발자 모드에서 구조를 확인하면서 값을 변경.
                const $search = $('.dataTables_filter').parent();
                const $paginate = $('.dataTables_paginate.paging_numbers').parent();

                $search.prev().remove();
                $paginate.prev().remove();

                $search.attr('class', 'search-field');
                $paginate.attr('class', 'paginate-field');

            }).on('page.dt search.dt', function () {
                const table = $('.model-file-table').DataTable();

                table.rows().deselect();
            });

            $('.import-modal').on('show.bs.modal', function () {
                me.loadFileList();
            });
        },
        methods: {
            loadFileList: function () {
                const me = this;

                const Promise = window.Promise;
                const param = {
                    s: me.search
                };

                return Utils.apiRequest(ApiUrl.FILE_LIST, param).catch(function () {
                    return Promise.resolve({data: []});

                }).then(function (data) {
                    const arr = data.data;
                    const dataArr = [];

                    for (let i = 0; i < arr.length; i++) {
                        dataArr.push(new ObjectFile(Utils.snakeObjToCamelObj(arr[i])));
                    }

                    me.fileArr = dataArr;

                    return Promise.resolve(dataArr);
                });
            },
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