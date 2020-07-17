<template>
    <div>
        <top-nav page-name="home"></top-nav>

        <!-- 생성 모달 -->
        <confirm-modal :disabled="disabled" :disable-ok-hide="true" @confirm="onConfirmCreate" class="create-modal">
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
                        <input v-model.trim="showroom.memo" :disabled="disabled" type="text" class="w-100 form-control form-control-sm">
                    </div>
                </div>
            </template>
        </confirm-modal>
        <!-- END-생성 모달 -->

        <div class="container mt-5">
            <div class="row">
                <div class="offset-lg-3 col-lg-6">
                    <button @click="onClickCreate" type="button" class="w-100 btn btn-sm btn-outline-primary">생성</button>
                </div>
            </div>

            <div class="row mt-5">
                <div class="col-12">
                    <showroom-table ref="showroomTable"></showroom-table>
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
    import showroomTableVue from '../parts/homePage/showroomTable.vue';

    const Promise = window.Promise;

    export default {
        components: {
            'top-nav': topNavVue,
            'confirm-modal': confirmModalVue,
            'showroom-table': showroomTableVue
        },
        data: function () {
            return {
                disabled: false,
                showroom: new Showroom(),
                showroomArr: [],
                search: ''
            };
        },
        methods: {
            onClickCreate: function () {
                const me = this;

                me.showroom = new Showroom();

                $('.create-modal').modal('show');
            },
            onConfirmCreate: function (bool) {
                const me = this;

                if (bool) {
                    const message = me.showroom.validate();

                    if (message) {
                        alert(message);

                    } else {
                        me.disabled = true;

                        Utils.apiRequest(ApiUrl.SHOWROOM_CREATE, me.showroom, 'post').catch(function () {
                            return Promise.resolve();

                        }).then(function () {
                            me.disabled = false;

                            me.$refs.showroomTable.tableReload();

                            $('.create-modal').modal('hide');
                        });
                    }
                }
            },
            onClickDelete: function (showroom) {
                const me = this;

                me.showroom = showroom;

                $('.delete-modal').modal('show');
            },
            
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