<template>
    <div class="table-filed">
        <!-- 제거 모달 -->
        <confirm-modal @confirm="onConfirmDelete" class="delete-modal">
            <template v-slot:message>
                <div class="h4 my-5 text-center">
                    <span>해당 전시장을 삭제하나요?</span>
                </div>
            </template>
        </confirm-modal>
        <!-- END-제거 모달 -->

        <table class="file-table table table-bordered table-striped">
            <thead>
                <tr>
                    <th style="width: 10%">ID</th>
                    <th style="width: 20%">이름</th>
                    <th style="width: 40%">설명</th>
                    <th style="width: 15%">생성일</th>
                    <th style="width: 15%"></th>
                </tr>
            </thead>
        </table>

        <div ref="buttons" hidden>
            <div class="row">
                <div class="col-6 pr-1">
                    <button type="button" class="e-btn w-100 btn btn-sm btn-outline-primary">
                        <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                    </button>
                </div>

                <div class="col-6 pl-1">
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
    import Showroom from '../../../class/showroom';

    import confirmModalVue from '../../parts/confirmModal.vue';

    export default {
        components: {
            'confirm-modal': confirmModalVue
        },
        data: function () {
            return {
                dataTable: null,
                showroom: null
            };
        },
        mounted: function () {
            const me = this;

            const buttonsHtml = me.$refs.buttons.innerHTML;

            me.dataTable = $('.file-table').DataTable({
                ajax: {
                    url: ApiUrl.SHOWROOM_LIST,
                    dataSrc: 'data'
                },
                order: [],
                autoWidth: false,
                pagingType: 'numbers',
                buttons: ['copy'],
                columns: [
                    {width: '5%', data: 'SEQ_ID', className:'text-center'},
                    {width: '20%', data: 'NAME', className:'text-center'},
                    {width: '40%', data: 'MEMO', className:'text-center'},
                    {width: '20%', data: 'C_DATE', className:'text-center'},
                    {width: '15%', data: null, className:'text-center', orderable:false, defaultContent: buttonsHtml}
                ]
            });

            me.dataTable.on('click', '.e-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();

                me.$router.push({name: 'edit', params:{id: data['SEQ_ID']}});
            });

            me.dataTable.on('click', '.d-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();

                me.showroom = new Showroom(Utils.snakeObjToCamelObj(data));

                $('.delete-modal').modal('show');
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
                    Utils.apiRequest(ApiUrl.SHOWROOM_DELETE, me.showroom, 'post');

                    me.tableReload();
                }
            }
        }
    }
</script>