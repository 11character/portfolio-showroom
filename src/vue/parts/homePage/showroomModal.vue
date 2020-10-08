<template>
    <div class="showroom-modal-field">
        <confirm-modal :disabled="disabled" :disable-ok-hide="true" @confirm="onConfirmCreate" ref="createModal">
            <template v-slot:message>
                <div class="row">
                    <label class="col-12 form-label">이름</label>
                    <div class="col-12">
                        <input v-model.trim="showroom.name" :disabled="disabled" type="text" class="w-100 form-control form-control-sm">
                    </div>
                </div>

                <div class="row mt-3">
                    <label class="col-12 form-label">설명</label>
                    <div class="col-12">
                        <input v-model.trim="showroom.description" :disabled="disabled" type="text" class="w-100 form-control form-control-sm">
                    </div>
                </div>

                <div class="row mt-3">
                    <label class="col-12 form-label">링크</label>
                    <div class="col-12">
                        <input v-model.trim="showroom.link" :disabled="disabled" type="text" class="w-100 form-control form-control-sm">
                    </div>
                </div>

                <div class="row mt-3">
                    <label class="col-12 form-label">
                        <span>이미지</span>
                        <span v-if="showroom.imgUrl">(사용중인 파일)</span>
                    </label>

                    <div v-if="showroom.imgUrl" class="col-12 mb-1">
                        <div class="w-100 border img-view">
                            <img :src="showroom.imgUrl" class="w-100">
                        </div>
                    </div>

                    <div class="col-12">
                        <input :disabled="disabled" ref="imgFile" type="file" class="w-100 border rounded" accept="image/*">
                    </div>
                </div>

                <div class="row mt-3">
                    <label class="col-12 form-label">
                        <span>음악</span>
                        <span v-if="showroom.bgmUrl">(사용중인 파일)</span>
                    </label>
                    
                    <div v-if="showroom.bgmUrl" class="col-12 mb-1">
                        <audio :src="showroom.bgmUrl" class="w-100" controls></audio>
                    </div>

                    <div class="col-12">
                        <input :disabled="disabled" ref="bgmFile" type="file" class="w-100 border rounded" accept="audio/mpeg">
                    </div>
                </div>

                <div class="row mt-3">
                    <label class="col-12 form-label">내용</label>

                    <div class="col-12">
                        <div class="form-check form-check-inline">
                            <label class="form-check-label">
                                <input v-model="contentLang" class="form-check-input" type="radio" name="lang" value="ko">
                                <span>한국어</span>
                            </label>
                        </div>

                        <div class="form-check form-check-inline">
                            <label class="form-check-label">
                                <input v-model="contentLang" class="form-check-input" type="radio" name="lang" value="en">
                                <span>영어</span>
                            </label>
                        </div>
                    </div>

                    <div v-if="contentLang == 'ko'" class="col-12">
                        <textarea v-model.trim="showroom.contentKo" class="form-control"></textarea>
                    </div>

                    <div v-if="contentLang == 'en'" class="col-12">
                        <textarea v-model.trim="showroom.contentEn" class="form-control"></textarea>
                    </div>
                </div>
            </template>
        </confirm-modal>
    </div>
</template>

<script>
    import * as ApiUrl from '../../../class/apiUrl';
    import Utils from '../../../class/utils';
    import Showroom from '../../../class/showroom';

    import confirmModalVue from '../confirmModal.vue';

    /**
     * template event : create, update
     */
    export default {
        components: {
            'confirm-modal': confirmModalVue
        },
        data: function () {
            return {
                disabled: false,
                showroom: new Showroom(),
                imgFile: null,
                bgmFile: null,
                contentLang: 'ko'
            };
        },
        methods: {
            open: function (showroom) {
                const me = this;

                me.showroom = new Showroom(showroom);

                me.$refs.createModal.open();
            },
            close: function () {
                const me = this;

                me.$refs.createModal.close();
            },
            clear: function () {
                const me = this;

                me.showroom = new Showroom();

                me.$refs.imgFile.value = '';
                me.$refs.bgmFile.value = '';
            },
            onConfirmCreate: function (bool) {
                const me = this;

                if (bool) {
                    const imgFile = me.$refs.imgFile.files[0];
                    const bgmFile = me.$refs.bgmFile.files[0];

                    let message = me.showroom.validate();

                    if (bgmFile && bgmFile.type.indexOf('audio/mpeg') != 0) {
                        message = "오디오에는 MP3 파일만 들어갈 수 있습니다.";
                    }

                    if (imgFile && imgFile.type.indexOf('image/') != 0) {
                        message = "이미지에는 이미지 파일만 들어갈 수 있습니다.";
                    }

                    if (message) {
                        alert(message);

                    } else {
                        me.disabled = true;

                        const formData = new FormData();

                        for (let key in me.showroom) {
                            if (me.showroom.hasOwnProperty(key)) {
                                formData.append(key, me.showroom[key]);
                            }
                        }

                        if (imgFile) {
                            formData.append('imgFile', imgFile);
                        }

                        if (bgmFile) {
                            formData.append('bgmFile', bgmFile);
                        }

                        let apiUrl = ApiUrl.SHOWROOM_UPDATE;

                        if (me.showroom.seqId == 0) {
                            apiUrl = ApiUrl.SHOWROOM_CREATE;
                        }

                        $.ajax({
                            method: 'post',
                            url: apiUrl,
                            processData: false,
                            contentType: false,
                            data: formData,
                            dataType: 'json'

                        }).fail(function () {
                            alert('저장에 실패했습니다.');

                        }).done(function (data) {
                            if (data.code != 99) {
                                if (data.code != 0) {
                                    alert('전시장을 만들었지만 파일을 저장하지 못했습니다.\n전시장을 열어 수정해 주세요.');
                                }

                                me.close();

                                if (me.showroom.seqId == 0) {
                                    me.$emit('create', me.showroom);

                                } else {
                                    me.$emit('update', me.showroom);
                                }

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

<style lang="scss" scoped>
    .showroom-modal-field {
        .img-view {
            max-height: 300px;
            overflow-y: auto;
        }
    }
</style>