<template>
    <div class="home-page-field">
        <top-nav page-name="home"></top-nav>

        <!-- 생성 모달 -->
        <showroom-modal @create="onCreate" ref="showroomModal"></showroom-modal>
        <!-- END-생성 모달 -->

        <div class="container mt-5">
            <div class="row">
                <div class="col-12">
                    <div class="row">
                        <div class="col-12">
                            <span class="h5">기본 전시장</span>&nbsp;
                            <a :href="mainShowroomUrl"><font-awesome-icon :icon="['fas', 'link']"></font-awesome-icon></a>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <span class="main-showroom-info">( ID : {{mainShowroom.seqId || '없음'}}, 이름 : {{mainShowroom.name || '없음'}} )</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-5">
                <div class="offset-lg-3 col-lg-6">
                    <button @click="onClickCreate" type="button" class="w-100 btn btn-sm btn-outline-primary">생성</button>
                </div>
            </div>

            <div class="row mt-5">
                <div class="col-12">
                    <showroom-table @mainShowroom="onMainShowroom" ref="showroomTable"></showroom-table>
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
    import showroomModalVue from '../parts/homePage/showroomModal.vue';
    import showroomTableVue from '../parts/homePage/showroomTable.vue';

    const Promise = window.Promise;

    export default {
        components: {
            'top-nav': topNavVue,
            'showroom-modal': showroomModalVue,
            'showroom-table': showroomTableVue
        },
        data: function () {
            const me = this;

            const urlSplitArr = window.location.href.split('/');
            const url = urlSplitArr.slice(0, urlSplitArr.length - 2).join('/');

            return {
                mainShowroom: new Showroom(),
                mainShowroomUrl: url + '/showroom.php#/view/0'
            };
        },
        mounted: function () {
            const me = this;

            Utils.apiRequest(ApiUrl.MAIN_SHOWROOM_DATA).then(function (data) {
                if (data.code == 0 && data.data.length > 0) {
                    const showroom = new Showroom(Utils.snakeObjToCamelObj(data.data[0]));

                    me.mainShowroom = showroom;

                } else {
                    me.mainShowroom = new Showroom();
                }
            });
        },
        methods: {
            onClickCreate: function () {
                const me = this;

                me.$refs.showroomModal.open();
            },
            onCreate: function () {
                const me = this;

                me.$refs.showroomTable.reloadTable();
            },
            onMainShowroom: function (showroom) {
                const me = this;

                me.mainShowroom = showroom;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-showroom-info {
        font-size: 0.8rem;
    }
</style>