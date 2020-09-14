<template>
    <div class="file-table-field">
        <!-- 제거 모달 -->
        <confirm-modal @confirm="onConfirmDelete" ref="deleteModal">
            <template v-slot:message>
                <div class="h4 my-5 text-center">
                    <span>해당 파일을 삭제하나요?</span>
                </div>
            </template>
        </confirm-modal>
        <!-- END-제거 모달 -->

        <!-- 뷰 모달 -->
        <asset-view-modal ref="viewModal"></asset-view-modal>
        <!-- END-뷰 모달 -->

        <table class="file-table table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>타입</th>
                    <th>이름</th>
                    <th>설명</th>
                    <th>생성일</th>
                    <th></th>
                </tr>
            </thead>
        </table>

        <div ref="buttons" hidden>
            <div class="row">
                <div class="col-lg-4 p-1 py-lg-0 pl-lg-2">
                    <button type="button" class="l-btn w-100 btn btn-sm btn-outline-primary">
                        <font-awesome-icon :icon="['fas', 'eye']"></font-awesome-icon>
                    </button>
                </div>

                <div class="col-lg-4 p-1 py-lg-0">
                    <button type="button" class="e-btn w-100 btn btn-sm btn-outline-primary">
                        <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                    </button>
                </div>

                <div class="col-lg-4 p-1 py-lg-0 pr-lg-2">
                    <button type="button" class="d-btn w-100 btn btn-sm btn-outline-danger">
                        <font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>
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
    import assetViewModalVue from './assetViewModal.vue';

    export default {
        components: {
            'confirm-modal': confirmModalVue,
            'asset-view-modal': assetViewModalVue
        },
        data: function () {
            return {
                dataTable: null,
                modelFileInfo: null
            };
        },
        mounted: function () {
            const me = this;

            const buttonsHtml = me.$refs.buttons.innerHTML;

            me.dataTable = $('.file-table').DataTable({
                ajax: {
                    url: ApiUrl.MODEL_FILE_LIST,
                    dataSrc: 'data'
                },
                order: [],
                autoWidth: false,
                pagingType: 'numbers',
                columns: [
                    {width: '5%', data: 'SEQ_ID', className:'text-center'},
                    {width: '8%', data: 'EXT', className:'text-center'},
                    {width: '20%', data: 'NAME', className:'text-center'},
                    {width: '32%', data: 'DESCRIPTION', className:'text-center'},
                    {width: '20%', data: 'C_DATE', className:'text-center'},
                    {width: '15%', data: null, className:'text-center', orderable:false, defaultContent: buttonsHtml}
                ]
            });

            me.dataTable.on('click', '.l-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();

                me.$refs.viewModal.open(new ModelFileInfo(Utils.snakeObjToCamelObj(data)));
            });

            me.dataTable.on('click', '.e-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();

                me.$router.push({name: 'asset-edit', params:{id: data['SEQ_ID']}});
            });

            me.dataTable.on('click', '.d-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();

                me.modelFileInfo = new ModelFileInfo(Utils.snakeObjToCamelObj(data));

                me.$refs.deleteModal.open();
            });
        },
        methods: {
            tableReload: function () {
                const me = this;

                me.dataTable.ajax.reload();
            },
            onConfirmDelete: function (bool) {
                const me = this;

                if (bool) {
                    Utils.apiRequest(ApiUrl.MODEL_FILE_DELETE, me.modelFileInfo, 'post').catch(function () {
                        return Promise.resolve();

                    }).then(function () {
                        me.tableReload();
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .file-table-field {
        overflow-x: auto;
    }
</style>