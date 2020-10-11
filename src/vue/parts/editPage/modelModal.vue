<template>
    <div class="model-modal-field import-modal modal fade" tabindex="-1" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-content-model-file disable-user-select">
                <div class="modal-head">
                    <p class="modal-title">
                        <img :src="'./img/icon-model-file.png'" class="modal-title-img modal-title-img-model-file"> Model
                    </p>
                </div>

                <div class="modal-body">
                    <div class="row">
                        <div class="col-12">
                            <div class="table-background">
                                <table class="model-file-table table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Memo</th>
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
    import ModelFileInfo from '../../../class/modelFileInfo';

    const Promise = window.Promise;

    /**
    * template event : apply
    */
    export default {
        data: function () {
            return {
                disabled: false,
                dataTable: null
            };
        },
        mounted: function () {
            const me = this;

            me.dataTable = $('.model-file-table').DataTable({
                ajax: {
                    url: ApiUrl.MODEL_FILE_LIST,
                    dataSrc: 'data'
                },
                order: [],
                autoWidth: false,
                lengthChange: false,
                info: false,
                pagingType: 'numbers',
                select: {
                    style: 'multi',
                    items: 'row'
                },
                columns: [
                    {className: 'column-text column-text-name', width: '35%', data: 'NAME'},
                    {className: 'column-text column-text-name', width: '45%', data: 'DESCRIPTION'},
                    {className: 'column-text column-text-type', width: '20%', data: 'EXT'}
                ]
            });

            me.dataTable.on('init.dt', function () {
                // 스카일을 적용하기 위한 클래스 삽입.
                // 브라우저의 개발자 모드에서 구조를 확인하면서 값을 변경.
                const $search = $('.dataTables_filter').parent();
                const $paginate = $('.dataTables_paginate.paging_numbers').parent();

                $search.prev().remove();
                $paginate.prev().remove();

                $search.attr('class', 'search-field');
                $paginate.attr('class', 'paginate-field');

            }).on('page.dt search.dt', function () {
                $('.model-file-table').DataTable().rows().deselect();
            });

            $(me.$el).on('hidden.bs.modal', function () {
                $('.model-file-table').DataTable().ajax.reload();
            });
        },
        beforeDestroy: function () {
            const me = this;

            me.dataTable.destroy();
            me.dataTable = null;

            $(me.$el).off('hidden.bs.modal');
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

                const rows = me.dataTable.rows({selected: true}).data();
                const arr = [];

                for (let i = 0; i < rows.length; i++) {
                    arr.push(new ModelFileInfo(Utils.snakeObjToCamelObj(rows[i])));
                }

                me.$emit('apply', arr);

                me.close();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./modalStyle.scss";

    .model-modal-field .table-background {
        padding: 15px 0px;
    }
</style>

<style lang="scss">
    // 테이블은 외부 소스라서 스코프 없이 설정.
    .dataTables_wrapper > div{
        justify-content: center;
    }
</style>