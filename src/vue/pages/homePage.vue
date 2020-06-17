<template>
    <div>
        <top-nav page-name="home"></top-nav>

        <!-- 생성 모달 -->
        <confirm-modal :disable-ok-hide="true" @confirm="onConfirmCreate" class="create-modal">
            <template v-slot:message>
                <div class="row">
                    <label class="col-12 form-label">이름</label>
                    <div class="col-12">
                        <input v-model.trim="selectShowroom.name" :disabled="disabled" type="text" class="w-100 form-control form-control-sm">
                    </div>
                </div>
                <div class="row mt-3">
                    <label class="col-12 form-label">메모</label>
                    <div class="col-12">
                        <input v-model.trim="selectShowroom.memo" :disabled="disabled" type="text" class="w-100 form-control form-control-sm">
                    </div>
                </div>
            </template>
        </confirm-modal>
        <!-- END-생성 모달 -->

        <!-- 제거 모달 -->
        <confirm-modal @confirm="onConfirmDelete" class="delete-modal">
            <template v-slot:message>
                <div class="h4 my-5 text-center">
                    <span>해당 전시장을 삭제하나요?</span>
                </div>
            </template>
        </confirm-modal>
        <!-- END-제거 모달 -->

        <div class="container mt-5">
            <div class="row">
                <div class="offset-lg-10 col-lg-2">
                    <button :disabled="disabled" @click="onClickCreate" type="button" class="w-100 btn btn-sm btn-outline-primary">생성</button>
                </div>
            </div>

            <div class="row mt-3">
                <label class="col-12 form-label">개수 : {{ showroomArr.length }}</label>
            </div>

            <div class="row mt-3">
                <div class="table-field col-12">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 10%">ID</th>
                                <th style="width: 20%">이름</th>
                                <th style="width: 40%">설명</th>
                                <th style="width: 20%">날짜</th>
                                <th style="width: 20%"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(showroom, i) in showroomArr" :key="i">
                                <td>
                                    <div class="pt-1 text-truncate">{{ showroom.seqId }}</div>
                                </td>

                                <td>
                                    <div class="pt-1 text-truncate">
                                        <a href="./">{{ showroom.name }}</a>
                                    </div>
                                </td>

                                <td>
                                    <div class="pt-1 text-truncate">{{ showroom.memo }}</div>
                                </td>

                                <td>
                                    <div class="pt-1 text-truncate">{{ dateToDateString(showroom.cDate) }}</div>
                                </td>

                                <td>
                                    <div class="row">
                                        <div class="col-6">
                                            <button :disabled="disabled" type="button" class="w-100 btn btn-sm btn-outline-primary">
                                                <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>
                                            </button>
                                        </div>

                                        <div class="col-6">
                                            <button :disabled="disabled" @click="onClickDelete(showroom)" type="button" class="w-100 btn btn-sm btn-outline-danger">
                                                <font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>
                                            </button>
                                        </div>
                                    </div>
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
    import Showroom from '../../class/showroom';

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
                selectShowroom: new Showroom(),
                showroomArr: []
            };
        },
        mounted: function () {
            const me = this;

            me.loadShowroomList();
        },
        methods: {
            dateToDateString: function (date) {
                return Utils.dateToDateString(new Date(date))
            },
            loadShowroomList: function () {
                const me = this;
                const Promise = window.Promise;

                return Utils.apiRequest(ApiUrl.SHOWROOM_LIST).catch(function () {
                    return Promise.resolve({data: []});

                }).then(function (data) {
                    const arr = data.data;
                    const dataArr = [];

                    for (let i = 0; i < arr.length; i++) {
                        dataArr.push(new Showroom(Utils.snakeObjToCamelObj(arr[i])));
                    }

                    me.showroomArr = dataArr;

                    return Promise.resolve(dataArr);
                });
            },
            onClickCreate: function () {
                const me = this;

                me.selectShowroom = new Showroom();

                $('.create-modal').modal('show');
            },
            onConfirmCreate: function (bool) {
                const me = this;
                const Promise = window.Promise;

                if (bool) {
                    const message = me.selectShowroom.validate();

                    if (message) {
                        alert(message);

                    } else {
                        me.disabled = true;

                        Utils.apiRequest(ApiUrl.SHOWROOM_CREATE, me.selectShowroom, 'post').catch(function () {
                            return Promise.resolve();

                        }).then(function () {
                            me.disabled = false;

                            me.loadShowroomList();

                            $('.create-modal').modal('hide');
                        });
                    }
                }
            },
            onClickDelete: function (showroom) {
                const me = this;

                me.selectShowroom = showroom;

                $('.delete-modal').modal('show');
            },
            onConfirmDelete: function (bool) {
                const me = this;
                const Promise = window.Promise;

                if (bool) {
                    me.disabled = true;

                    Utils.apiRequest(ApiUrl.SHOWROOM_DELETE, me.selectShowroom, 'post').catch(function () {
                        return Promise.resolve();

                    }).then(function () {
                        me.disabled = false;

                        me.loadShowroomList();
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .table-field {
        overflow-y: auto;
    }

    .table-field table {
        table-layout: fixed;
        min-width: 768px;
    }
</style>