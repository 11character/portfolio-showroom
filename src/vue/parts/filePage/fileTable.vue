<template>
    <div class="table-filed">
        <table class="file-table table table-bordered table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>타입</th>
                    <th>이름</th>
                    <th>설명</th>
                    <th>생성일</th>
                </tr>
            </thead>
        </table>
    </div>
</template>

<script>
    import * as ApiUrl from '../../../class/apiUrl';
    import Utils from '../../../class/utils';
    import ModelFileInfo from '../../../class/modelFileInfo';

    export default {
        data: function () {
            return {
                dataTable: null
            };
        },
        mounted: function () {
            const me = this;

            me.dataTable = $('.file-table').DataTable({
                ajax: {
                    url: ApiUrl.FILE_LIST,
                    dataSrc: 'data'
                },
                order: [],
                autoWidth: false,
                pagingType: 'numbers',
                columns: [
                    {width: '5%', data: 'SEQ_ID', className:'text-center'},
                    {width: '8%', data: 'TYPE_CODE', className:'text-center', render: function (data) {
                        return data == 0 ? '벽' : '물건';
                    }},
                    {width: '30%', data: 'NAME', className:'text-center'},
                    {width: '37%', data: 'MEMO', className:'text-center'},
                    {width: '20%', data: 'C_DATE', className:'text-center'}
                ]
            });
        },
        methods: {
            tableReload: function () {
                const me = this;

                me.dataTable.ajax.reload();
            }
        }
    }
</script>