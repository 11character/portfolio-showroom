<template>
    <div class="product-table-field">
        <!-- 제거 모달 -->
        <confirm-modal @confirm="onConfirmDelete" ref="deleteModal">
            <template v-slot:content>
                <div class="h4 my-5 text-center">
                    <span>선택한 파일을 삭제하나요?</span>
                </div>
            </template>
        </confirm-modal>
        <!-- END-제거 모달 -->

        <!-- 링크 생성 모달 -->
        <confirm-modal @confirm="onConfirmLink" ref="createModal">
            <template v-slot:content>
                <div class="row">
                    <div class="col-12">
                        <h4>다운로드 링크 생성</h4>
                    </div>
                </div>

                <div class="row mt-3">
                    <div class="col-12 h3 text-truncate">
                        <span>{{ productFileInfo.name }}</span>
                    </div>
                </div>

                <div class="row mt-3">
                    <div class="col-12">
                        <label>기한</label>
                    </div>

                    <div class="col-6">
                        <input-date v-model="productKey.endDate" :disabled="disabled" type="text" class="p-0 form-control form-control-sm"></input-date>
                    </div>

                    <div class="col-6 text-left">
                        <span>까지</span>
                    </div>
                </div>

                <div class="row mt-3">
                    <div class="col-12">
                        <label>설명</label>
                    </div>

                    <div class="col-12">
                        <input v-model.trim="productKey.description" :disabled="disabled" type="text" class="form-control form-control-sm">
                    </div>
                </div>
            </template>
        </confirm-modal>
        <!-- END-링크 생성 모달 -->

        <!-- 링크 생성 완료 모달 -->
        <product-link-modal :productKey="alertProductKey" ref="linkModal"></product-link-modal>
        <!-- END-링크 생성 완료 모달 -->

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
                    <th>이름</th>
                    <th>설명</th>
                    <th>크기</th>
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
                <div class="col-12 p-1 py-lg-0 px-lg-2">
                    <button type="button" class="k-btn w-100 btn btn-sm btn-outline-primary">
                        <font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../../class/apiUrl';
    import Utils from '../../../class/utils';
    import ProductFileInfo from '../../../class/productFileInfo';
    import ProductKey from '../../../class/productKey';

    import confirmModalVue from '../confirmModal.vue';
    import inputDateVue from '../inputItem/inputDate.vue';
    import productLinkModalVue from '../productLinkPage/productLinkModal.vue';

    const Promise = window.Promise;

    export default {
        components: {
            'confirm-modal': confirmModalVue,
            'input-date': inputDateVue,
            'product-link-modal': productLinkModalVue
        },
        data: function () {
            return {
                productFileInfo: new ProductFileInfo(),
                productKey: new ProductKey(),
                alertProductKey: new ProductKey(),
                dataTable: null,
                selectAll: false,
                page: 0
            };
        },
        mounted: function () {
            const me = this;

            const editButtonsHtml = me.$refs.editButtons.innerHTML;
            const checkHtml = me.$refs.check.innerHTML;

            const sizeRender = function (data) {
                return Utils.sizeString(parseInt(data, 10));
            }

            me.dataTable = $(me.$refs.table).DataTable({
                ajax: {
                    url: ApiUrl.PRODUCT_FILE_LIST,
                    dataSrc: 'data'
                },
                order: [],
                autoWidth: false,
                pagingType: 'numbers',
                columns: [
                    {width: '5%', data: null, className:'text-center', searchable: false, orderable:false, defaultContent: checkHtml},
                    {width: '5%', data: 'SEQ_ID', className:'text-center'},
                    {width: '30%', data: 'NAME', className:'text-center'},
                    {width: '30%', data: 'DESCRIPTION', className:'text-center'},
                    {width: '10%', data: 'SIZE', className:'text-center', render: sizeRender},
                    {width: '15%', data: 'C_DATE', className:'text-center'},
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

            me.dataTable.on('click', '.k-btn', function () {
                const data = me.dataTable.row($(this).parents('tr')).data();

                me.productFileInfo = new ProductFileInfo(Utils.snakeObjToCamelObj(data));
                me.productKey = new ProductKey();

                let date = new Date();
                date.setMonth(date.getMonth() + 1);

                me.productKey.productId = me.productFileInfo.seqId;
                me.productKey.endDate = Utils.dateToDateString(date);

                me.$refs.createModal.open();
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
                        dataArr.push(new ProductFileInfo(Utils.snakeObjToCamelObj(data)));
                    });

                    const promiseArr = [];

                    for (let i = 0; i < dataArr.length; i++) {
                        const promise = Utils.apiRequest(ApiUrl.PRODUCT_FILE_DELETE, dataArr[i], 'post').catch(function () {
                            return Promise.resolve();
                        });

                        promiseArr.push(promise);
                    }

                    Promise.all(promiseArr).then(function () {
                        me.reloadTable(false);
                    });
                }
            },
            onConfirmLink: function (bool) {
                const me = this;
                const productKey = me.productKey;

                if (bool) {
                    Utils.apiRequest(ApiUrl.PRODUCT_KEY_CREATE, productKey, 'post').then(function () {
                        return Utils.apiRequest(ApiUrl.PRODUCT_KEY_DATA, {id: productKey.productId});

                    }).then(function (data) {
                        if (data.code == 0) {
                            const keyData = new ProductKey(Utils.snakeObjToCamelObj(data.data[0]));

                            // 다운로드 링크는 사용되는 페이지에서 생성.
                            const urlSplitArr = window.location.href.split('/');
                            const url = urlSplitArr.slice(0, urlSplitArr.length - 2).join('/');

                            keyData.downloadLink = url + '/download.php?id=' + keyData.downloadKey;

                            me.alertProductKey = keyData;
                            me.$refs.linkModal.open();
                        }
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