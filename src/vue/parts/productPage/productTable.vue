<template>
    <div class="file-table-field">
        <!-- 제거 모달 -->
        <confirm-modal @confirm="onConfirmDelete" ref="deleteModal">
            <template v-slot:message>
                <div class="h4 my-5 text-center">
                    <span>선택한 파일을 삭제하나요?</span>
                </div>
            </template>
        </confirm-modal>
        <!-- END-제거 모달 -->

        <div class="w-100 mb-3">
            <div class="row">
                <div class="col-lg-1">
                    <button @click="onClickDelete" type="button" class="d-btn w-100 btn btn-sm btn-outline-danger">
                        <font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>
                    </button>
                </div>
            </div>
        </div>

        <table ref="table" class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>
                        <input v-model="selectAll" type="checkbox" class="data-select-all">
                    </th>
                    <th>ID</th>
                    <th>타입</th>
                    <th>이름</th>
                    <th>설명</th>
                    <th>생성일</th>
                    <th></th>
                </tr>
            </thead>
        </table>

        <div ref="check" hidden>
            <input type="checkbox" class="data-select">
        </div>

        <div ref="editButtons" hidden>
            <div class="row">
                <div class="col-lg-6 p-1 py-lg-0 pl-lg-2">
                    <button type="button" class="v-btn w-100 btn btn-sm btn-outline-primary">
                        <font-awesome-icon :icon="['fas', 'eye']"></font-awesome-icon>
                    </button>
                </div>

                <div class="col-lg-6 p-1 py-lg-0 pr-lg-2">
                    <button type="button" class="e-btn w-100 btn btn-sm btn-outline-primary">
                        <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../../class/apiUrl';
    import Utils from '../../../class/utils';
    import ModelFileInfo from '../../../class/modelFileInfo';

    import confirmModalVue from '../../parts/confirmModal.vue';

    const Promise = window.Promise;

    export default {
        components: {
            'confirm-modal': confirmModalVue
        },
        data: function () {
            return {
                dataTable: null,
                selectAll: false,
                page: 0
            };
        },
        mounted: function () {
            const me = this;

            const editButtonsHtml = me.$refs.editButtons.innerHTML;
            const checkHtml = me.$refs.check.innerHTML;

            me.dataTable = $(me.$refs.table).DataTable({
                ajax: {
                    url: ApiUrl.MODEL_FILE_LIST,
                    dataSrc: 'data'
                },
                order: [],
                autoWidth: false,
                pagingType: 'numbers',
                columns: [
                    {width: '5%', data: null, className:'text-center', searchable: false, orderable:false, defaultContent: checkHtml},
                    {width: '5%', data: 'SEQ_ID', className:'text-center'},
                    {width: '8%', data: 'EXT', className:'text-center'},
                    {width: '20%', data: 'NAME', className:'text-center'},
                    {width: '32%', data: 'DESCRIPTION', className:'text-center'},
                    {width: '20%', data: 'C_DATE', className:'text-center'},
                    {width: '10%', data: null, className:'text-center', searchable: false, orderable:false, defaultContent: editButtonsHtml}
                ]
            });

            me.dataTable.on('change', '.data-select-all', function () {
                $(me.$el).find('.table .data-select').prop('checked', me.selectAll);
            });

            me.dataTable.on('change', '.data-select', function () {
                const selectCount = $(me.$el).find('.table .data-select:checked').length;
                const info = me.dataTable.page.info();

                $(me.$el).find('.data-select-all').prop('checked', selectCount >= (info.end - info.start));
            });

            // me.dataTable.on('click', '.v-btn', function () {
            //     const data = me.dataTable.row($(this).parents('tr')).data();
            //     me.$refs.viewModal.open(new ModelFileInfo(Utils.snakeObjToCamelObj(data)));
            // });

            me.dataTable.on('click', '.e-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();
                me.$router.push({name: 'asset-edit', params:{id: data['SEQ_ID']}});
            });

            me.dataTable.on('click', '.d-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();
                me.modelFileInfo = new ModelFileInfo(Utils.snakeObjToCamelObj(data));
                me.$refs.deleteModal.open();
            });

            me.dataTable.on('page', function () {
                $(me.$el).find('.data-select').prop('checked', false);
                me.selectAll = false;
                me.page = me.dataTable.page();
            });

            me.dataTable.on('length', function () {
                $(me.$el).find('.data-select').prop('checked', false);
                me.selectAll = false;
                me.page = me.dataTable.page();
            });

            me.dataTable.on('xhr', function () {
                me.dataTable.page(me.page).draw(false);
            });
        },
        methods: {
            reloadTable: function (bool) {
                const me = this;

                bool = (typeof bool == 'boolean') ? bool : true;

                me.dataTable.ajax.reload(null, bool);
            },
            onClickDelete: function () {
                const me = this;

                me.$refs.deleteModal.open();
            },
            onConfirmDelete: function (bool) {
                const me = this;

                if (bool) {
                    const dataArr = [];

                    $(me.$el).find('.data-select:checked').each(function (i, el) {
                        const data = me.dataTable.row($(el).parents('tr')).data();
                        dataArr.push(new ModelFileInfo(Utils.snakeObjToCamelObj(data)));
                    });

                    const promiseArr = [];

                    for (let i = 0; i < dataArr.length; i++) {
                        const promise = Utils.apiRequest(ApiUrl.MODEL_FILE_DELETE, dataArr[i], 'post').catch(function () {
                            return Promise.resolve();
                        });

                        promiseArr.push(promise);
                    }

                    Promise.all(promiseArr).then(function () {
                        me.reloadTable(false);
                    });
                }
            }
        }
    }
</script>

<style lang="scss">
    // 테이블은 외부 소스라서 스코프 없이 설정
    .dataTables_wrapper.dt-bootstrap4.no-footer > .row:nth-child(2) > div {
        overflow-x: auto;
    }
</style>