<template>
    <div class="product-page-field">
        <top-nav page-name="product-link"></top-nav>

        <div class="container mt-5">
            <div class="row">
                <div class="col-12">
                    <product-link-table ref="productTable"></product-link-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../class/apiUrl';
    import Utils from '../../class/utils';
    import ProductFileInfo from '../../class/productFileInfo';

    import topNavVue from '../parts/topNav.vue';
    import confirmModalVue from '../parts/confirmModal.vue';
    import productLinkTableVue from '../parts/productLinkPage/productLinkTable.vue';

    const Promise = window.Promise;

    export default {
        components: {
            'top-nav': topNavVue,
            'confirm-modal': confirmModalVue,
            'product-link-table': productLinkTableVue
        },
        data: function () {
            return {
                disabled: false,
                productFileInfo: new ProductFileInfo()
            };
        },
        methods: {
            clear: function () {
                const me = this;

                me.productFileInfo = new ProductFileInfo();

                me.$refs.uploadFile.value = '';
            },
            onChangefile: function (evt) {
                const me = this;

                me.productFileInfo.name = evt.currentTarget.files.length ? evt.currentTarget.files[0].name : '';
            },
            onClickUpload: function () {
                const me = this;

                me.$refs.uploadModal.open();
            },
            onConfirmUpload: function (bool) {
                const me = this;

                if (bool) {
                    const el = me.$refs.uploadFile;
                    const file = el.files[0];

                    if (file) {
                        me.disabled = true;

                        const name = me.productFileInfo.name || file.name;
                        const description = me.productFileInfo.description;
                        const formData = new FormData();

                        formData.append('file', file);
                        formData.append('name', name);
                        formData.append('description', description);

                        $.ajax({
                            method: 'post',
                            url: ApiUrl.PRODUCT_FILE_UPLOAD,
                            processData: false,
                            contentType: false,
                            data: formData,
                            dataType: 'json'

                        }).fail(function () {
                            alert('저장에 실패했습니다.');

                        }).done(function (data) {
                            if (data.code == 0) {
                                me.$refs.productTable.reloadTable();

                                $(me.$refs.uploadModal.$el).modal('hide');

                                me.clear();

                            } else {
                                alert('저장에 실패했습니다.');
                            }

                        }).always(function () {
                            me.disabled = false;
                        });
                    }
                } else {
                    me.clear();
                }
            }
        }
    }
</script>