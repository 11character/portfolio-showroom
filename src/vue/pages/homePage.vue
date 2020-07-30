<template>
    <div>
        <top-nav page-name="home"></top-nav>

        <!-- 생성 모달 -->
        <showroom-modal @create="onCreate" ref="showroomModal"></showroom-modal>
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
        methods: {
            onClickCreate: function () {
                const me = this;
                
                me.$refs.showroomModal.showModal();
            },
            onCreate: function () {
                const me = this;

                me.$refs.showroomTable.tableReload();
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