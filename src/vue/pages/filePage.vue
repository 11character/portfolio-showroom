<template>
    <div>
        <top-nav page-name="file"></top-nav>

        <!-- 업로드 모달 -->
        <confirm-modal :disabled="disabled" :disable-ok-hide="true" @confirm="onConfirmUpload" class="upload-modal">
            <template v-slot:message>
                <div class="row">
                   <div class="col-12">
                        <div class="row mt-3">
                            <div class="col-12">
                                <label>파일 업로드</label>
                            </div>
                        </div>

                        <div class="row my-3">
                            <div class="col-3">
                                <select class="upload-type form-control form-control-sm">
                                    <option value="1" selected>물건</option>
                                    <option value="0">벽</option>
                                </select>
                            </div>

                            <div class="col-9">
                                <input :disabled="disabled" type="file" class="w-100 border rounded" ref="upload-file">
                            </div>
                        </div>

                        <div class="row my-3">
                            <div class="col-12">
                                <label>메모</label>
                                <input :disabled="disabled" type="text" class="upload-memo form-control form-control-sm">
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </confirm-modal>
        <!-- END-업로드 모달 -->

        <!-- 제거 모달 -->
        <confirm-modal @confirm="onConfirmDelete" class="delete-modal">
            <template v-slot:message>
                <div class="h4 my-5 text-center">
                    <span>파일을 삭제합니까?</span>
                </div>
            </template>
        </confirm-modal>
        <!-- END-제거 모달 -->

        <div class="container mt-5">
            <div class="row">
                <div class="offset-lg-3 col-lg-6">
                    <button :disabled="disabled" @click="onClickUpload" type="button" class="w-100 btn btn-sm btn-outline-primary">파일 올리기</button>
                </div>
            </div>

            <div class="row mt-5">
                <div class="order-lg-last col-lg-4">
                    <div class="row">
                        <div class="col-8">
                            <input v-model.trim="search" type="text" class="form-control form-control-sm">
                        </div>

                        <div class="col-4">
                            <button @click="loadFileList" type="button" class="w-100 btn btn-sm btn-outline-secondary">검색</button>
                        </div>
                    </div>
                </div>

                <div class="order-lg-first col-lg-8 mt-3 mt-lg-0">
                    <button @click="onClickRefresh" type="button" class="mr-3 btn btn-sm btn-outline-secondary">
                        <font-awesome-icon :icon="['fas', 'sync-alt']"></font-awesome-icon>
                    </button>

                    <label class="form-label">개수 : {{ fileArr.length }}</label>
                </div>
            </div>

            <div class="row mt-3">
                <div class="table-field col-12">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 10%">ID</th>
                                <th style="width: 15%">타입</th>
                                <th style="width: 30%">이름</th>
                                <th style="width: 30%">설명</th>
                                <th style="width: 15%">날짜</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(objectFile, i) in fileArr" :key="i">
                                <td>
                                    <div class="pt-1 text-truncate">{{ objectFile.seqId }}</div>
                                </td>

                                <td>
                                    <div class="pt-1 text-truncate">{{ objectFile.ext }}</div>
                                </td>

                                <td>
                                    <div class="pt-1 text-truncate">{{ objectFile.name }}</div>
                                </td>

                                <td>
                                    <div class="pt-1 text-truncate">{{ objectFile.memo }}</div>
                                </td>

                                <td>
                                    <div class="pt-1 text-truncate">{{ dateToDateString(objectFile.cDate) }}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../class/apiUrl';
    import Utils from '../../class/utils';
    import ObjectFile from '../../class/objectFile';

    import topNavVue from '../parts/topNav.vue';
    import confirmModalVue from '../parts/confirmModal.vue';

    export default {
        components: {
            'top-nav': topNavVue,
            'confirm-modal': confirmModalVue
        },
        data: function () {
            return {
                disabled: false,
                selectObjectFile: new ObjectFile(),
                fileArr: [],
                search: ''
            };
        },
        mounted: function () {
            const me = this;

            me.loadFileList();
        },
        methods: {
            dateToDateString: function (date) {
                return Utils.dateToDateString(new Date(date))
            },
            loadFileList: function () {
                const me = this;

                const Promise = window.Promise;
                const param = {
                    s: me.search
                };

                return Utils.apiRequest(ApiUrl.FILE_LIST, param).catch(function () {
                    return Promise.resolve({data: []});

                }).then(function (data) {
                    const arr = data.data;
                    const dataArr = [];

                    for (let i = 0; i < arr.length; i++) {
                        dataArr.push(new ObjectFile(Utils.snakeObjToCamelObj(arr[i])));
                    }

                    me.fileArr = dataArr;

                    return Promise.resolve(dataArr);
                });
            },
            onClickRefresh: function () {
                const me = this;

                me.search = '';
                me.loadFileList();
            },
            onClickUpload: function () {
                const me = this;

                me.selectObjectFile = new ObjectFile();

                $('.upload-modal').modal('show');
            },
            onConfirmUpload: function (bool) {
                const me = this;

                if (bool) {
                    const el = me.$refs['upload-file'];
                    let file = el.files[0];

                    const memeType = 'application/zip application/octet-stream application/x-zip-compressed multipart/x-zip';

                    if (file && memeType.indexOf(file.type) > -1) {
                        me.disabled = true;

                        const type = $('.upload-type').val();
                        const memo = $('.upload-memo').val();
                        const formData = new FormData();

                        formData.append('file', file);
                        formData.append('type', type);
                        formData.append('memo', memo);

                        $.ajax({
                            method: 'post',
                            url: ApiUrl.FILE_UPLOAD,
                            processData: false,
                            contentType: false,
                            data: formData,
                            dataType: 'json'

                        }).fail(function () {
                            alert('저장에 실패했습니다.');

                        }).done(function (data) {
                            if (data.code == 0) {
                                el.value = '';
                                $('.upload-modal').modal('hide');

                            } else {
                                alert('저장에 실패했습니다.');
                            }

                        }).always(function () {
                            me.disabled = false;
                            me.loadFileList();
                        });
                    } else {
                        alert('ZIP 압축파일만 업로드가 가능합니다.');
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .table-field {
        overflow-y: auto;
    }

    .table-field table {
        table-layout: fixed;
        min-width: 768px;
    }
</style>