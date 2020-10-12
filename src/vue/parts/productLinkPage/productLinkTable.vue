<template>
    <div class="product-table-field">
        <!-- 제거 모달 -->
        <confirm-modal @confirm="onConfirmDelete" ref="deleteModal">
            <template v-slot:content>
                <div class="h4 my-5 text-center">
                    <span>선택한 다운로드 키를 삭제하나요?</span>
                </div>
            </template>
        </confirm-modal>
        <!-- END-제거 모달 -->

        <!-- 정보 보기 모달 -->
        <product-link-modal :productKey="productKey" ref="linkModal"></product-link-modal>
        <!-- END-정보 보기 모달 -->

        <div class="w-100 mb-3">
            <div class="row">
                <div class="col-lg-1">
                    <button @click="onClickDelete" type="button" class="w-100 btn btn-sm btn-outline-danger">
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
                    <th>상품명</th>
                    <th>링크</th>
                    <th>설명</th>
                    <th>종료일</th>
                    <th></th>
                </tr>
            </thead>
        </table>

        <div ref="check" hidden>
            <input type="checkbox" class="data-select">
        </div>

        <div ref="editButtons" hidden>
            <div class="row">
                <div class="col-12 p-1 py-lg-0 px-lg-2">
                    <button type="button" class="v-btn w-100 btn btn-sm btn-outline-primary">
                        <font-awesome-icon :icon="['fas', 'eye']"></font-awesome-icon>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../../class/apiUrl';
    import Utils from '../../../class/utils';
    import ProductKey from '../../../class/productKey';

    import confirmModalVue from '../confirmModal.vue';
    import inputDateVue from '../inputItem/inputDate.vue';
    import productLinkModalVue from './productLinkModal.vue';

    const Promise = window.Promise;

    export default {
        components: {
            'confirm-modal': confirmModalVue,
            'input-date': inputDateVue,
            'product-link-modal': productLinkModalVue
        },
        data: function () {
            return {
                productKey: new ProductKey(),
                linkUrl: '',
                dataTable: null,
                selectAll: false,
                page: 0
            };
        },
        mounted: function () {
            const me = this;

            const editButtonsHtml = me.$refs.editButtons.innerHTML;
            const checkHtml = me.$refs.check.innerHTML;

            const linkRender = function (data) {
                const urlSplitArr = window.location.href.split('/');
                const url = urlSplitArr.slice(0, urlSplitArr.length - 2).join('/');

                return url + '/download.php?id=' + data;
            }

            me.dataTable = $(me.$refs.table).DataTable({
                ajax: {
                    url: ApiUrl.PRODUCT_KEY_LIST,
                    dataSrc: 'data'
                },
                order: [],
                autoWidth: false,
                pagingType: 'numbers',
                columns: [
                    {width: '5%', data: null, className:'text-center', searchable: false, orderable:false, defaultContent: checkHtml},
                    {width: '5%', data: 'PRODUCT_ID', className:'text-center'},
                    {width: '15%', data: 'PRODUCT_NAME', className:'text-center text-break'},
                    {width: '30%', data: 'DOWNLOAD_KEY', className:'text-center', render: linkRender},
                    {width: '30%', data: 'DESCRIPTION', className:'text-center text-break'},
                    {width: '10%', data: 'END_DATE', className:'text-center'},
                    {width: '5%', data: null, className:'text-center', searchable: false, orderable:false, defaultContent: editButtonsHtml}
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

            me.dataTable.on('click', '.v-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();
                const keyData = new ProductKey(Utils.snakeObjToCamelObj(data));

                // 다운로드 링크는 사용되는 페이지에서 생성.
                keyData.downloadLink = linkRender(keyData.downloadKey);

                me.productKey = keyData;
                me.$refs.linkModal.open();
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

                $(me.$el).find('.data-select-all:checked').prop('checked', false);
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
                        dataArr.push(new ProductKey(Utils.snakeObjToCamelObj(data)));
                    });

                    const promiseArr = [];

                    for (let i = 0; i < dataArr.length; i++) {
                        const promise = Utils.apiRequest(ApiUrl.PRODUCT_KEY_DELETE, dataArr[i], 'post').catch(function () {
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
    // 테이블은 외부 소스라서 스코프 없이 설정.
    .product-table-field .dataTables_wrapper.dt-bootstrap4.no-footer > .row:nth-child(2) > div {
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