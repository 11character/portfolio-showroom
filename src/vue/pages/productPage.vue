<template>
    <div class="product-page-field">
        <top-nav page-name="product"></top-nav>

        <!-- 업로드 모달 -->
        <confirm-modal :disabled="disabled" :disable-ok-hide="true" @confirm="onConfirmUpload" ref="uploadModal">
            <template v-slot:message>
                <div class="row">
                   <div class="col-12">
                        <div class="row mt-3">
                            <div class="col-12">
                                <label>파일 업로드</label>
                            </div>
                        </div>

                        <div class="row my-3">
                            <div class="col-12">
                                <input :disabled="disabled" @change="onChangefile" ref="uploadFile" type="file" class="w-100 border rounded">
                            </div>
                        </div>

                        <div class="row my-3">
                            <div class="col-12">
                                <label>이름</label>
                                <input v-model.trim="modelFileInfo.name" :disabled="disabled" type="text" class="form-control form-control-sm">
                            </div>
                        </div>

                        <div class="row my-3">
                            <div class="col-12">
                                <label>설명</label>
                                <input v-model.trim="modelFileInfo.description" :disabled="disabled" type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </confirm-modal>
        <!-- END-업로드 모달 -->

        <div class="container mt-5">
            <div class="row">
                <div class="offset-lg-3 col-lg-6">
                    <button @click="onClickUpload" type="button" class="w-100 btn btn-sm btn-outline-primary">파일 올리기</button>
                </div>
            </div>

            <div class="row mt-5">
                <div class="col-12">
                    <product-table ref="productTable"></product-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../class/apiUrl';
    import Utils from '../../class/utils';
    import ModelFileInfo from '../../class/modelFileInfo';

    import topNavVue from '../parts/topNav.vue';
    import confirmModalVue from '../parts/confirmModal.vue';
    import productTableVue from '../parts/productPage/productTable.vue';

    const Promise = window.Promise;

    export default {
        components: {
            'top-nav': topNavVue,
            'confirm-modal': confirmModalVue,
            'product-table': productTableVue
        },
        data: function () {
            return {
                disabled: false,
                modelFileInfo: new ModelFileInfo()
            };
        },
        methods: {
            clear: function () {
                const me = this;

                me.modelFileInfo = new ModelFileInfo();

                me.$refs.uploadFile.value = '';
            },
            onChangefile: function (evt) {
                const me = this;

                me.modelFileInfo.name = evt.currentTarget.files.length ? evt.currentTarget.files[0].name : '';
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

                        const name = me.modelFileInfo.name || file.name;
                        const description = me.modelFileInfo.description;
                        const formData = new FormData();

                        formData.append('file', file);
                        formData.append('name', name);
                        formData.append('description', description);

                        $.ajax({
                            method: 'post',
                            url: ApiUrl.MODEL_FILE_UPLOAD,
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