<template>
    <div class="showroom-table-field">
        <!-- 기본 전시장 선택 모달 -->
        <confirm-modal @confirm="onConfirmMainShowroom" ref="mainShowroomModal">
            <template v-slot:content>
                <div class="h4 my-5 text-center">
                    <span>기본 전시장으로 선택합니까?</span>
                </div>
            </template>
        </confirm-modal>
        <!-- END-기본 전시장 선택 모달 -->

        <!-- 제거 모달 -->
        <confirm-modal @confirm="onConfirmDelete" ref="deleteModal">
            <template v-slot:content>
                <div class="h4 my-5 text-center">
                    <span>해당 전시장을 삭제하나요?</span>
                </div>
            </template>
        </confirm-modal>
        <!-- END-제거 모달 -->

        <table ref="table" class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th></th>
                    <th>ID</th>
                    <th>이름</th>
                    <th>설명</th>
                    <th>생성일</th>
                    <th></th>
                </tr>
            </thead>
        </table>

        <div ref="selectButton" hidden>
            <div class="row">
                <div class="col-12 px-1 py-lg-0 px-lg-2">
                    <button type="button" class="s-btn w-100 btn btn-sm btn-outline-primary">
                        <font-awesome-icon :icon="['fas', 'store']"></font-awesome-icon>
                    </button>
                </div>
            </div>
        </div>

        <div ref="editButtons" hidden>
            <div class="row">
                <div class="col-lg-4 p-1 py-lg-0 pl-lg-2">
                    <button type="button" class="v-btn w-100 btn btn-sm btn-outline-primary">
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
    import Showroom from '../../../class/showroom';

    import confirmModalVue from '../../parts/confirmModal.vue';

    /**
     * template event : mainShowroom
     */
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

            const selectButtonHtml = me.$refs.selectButton.innerHTML;
            const editButtonsHtml = me.$refs.editButtons.innerHTML;

            me.dataTable = $(me.$refs.table).DataTable({
                ajax: {
                    url: ApiUrl.SHOWROOM_LIST,
                    dataSrc: 'data'
                },
                order: [],
                autoWidth: false,
                pagingType: 'numbers',
                buttons: ['copy'],
                columns: [
                    {width: '5%', data: null, className:'text-center', orderable:false, defaultContent: selectButtonHtml},
                    {width: '5%', data: 'SEQ_ID', className:'text-center'},
                    {width: '25%', data: 'NAME', className:'text-center'},
                    {width: '35%', data: 'DESCRIPTION', className:'text-center'},
                    {width: '15%', data: 'C_DATE', className:'text-center'},
                    {width: '15%', data: null, className:'text-center', orderable:false, defaultContent: editButtonsHtml}
                ]
            });

            me.dataTable.on('click', '.s-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();

                me.showroom = new Showroom(Utils.snakeObjToCamelObj(data));

                me.$refs.mainShowroomModal.open();
            });

            me.dataTable.on('click', '.v-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();

                const urlSplitArr = window.location.href.split('/');
                const url = urlSplitArr.slice(0, urlSplitArr.length - 2).join('/');

                window.location.href = url + '/showroom.php#/view/' + data['SEQ_ID'];
            });

            me.dataTable.on('click', '.e-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();

                me.$router.push({name: 'edit', params:{id: data['SEQ_ID']}});
            });

            me.dataTable.on('click', '.d-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();

                me.showroom = new Showroom(Utils.snakeObjToCamelObj(data));

                me.$refs.deleteModal.open();
            });
        },
        methods: {
            reloadTable: function () {
                const me = this;

                me.dataTable.ajax.reload();
            },
            onConfirmMainShowroom: function (bool) {
                const me = this;

                if (bool) {
                    Utils.apiRequest(ApiUrl.MAIN_SHOWROOM_UPDATE, {id: me.showroom.seqId}, 'post').then(function () {
                        me.$emit('mainShowroom', me.showroom);
                    });
                }
            },
            onConfirmDelete: function (bool) {
                const me = this;

                if (bool) {
                    Utils.apiRequest(ApiUrl.SHOWROOM_DELETE, me.showroom, 'post').catch(function () {
                        return Promise.resolve();

                    }).then(function () {
                        me.reloadTable();
                    });
                }
            }
        }
    }
</script>

<style lang="scss">
    // 테이블은 외부 소스라서 스코프 없이 설정.
    .showroom-table-field .dataTables_wrapper.dt-bootstrap4.no-footer > .row:nth-child(2) > div {
        padding: 0px;
        overflow-x: auto;

        table {
            width: 1138px;

            td {
                vertical-align: middle;
                word-break:break-all;
            }
        }
    }
</style>