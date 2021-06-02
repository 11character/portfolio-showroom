<template>
    <div class="import-modal modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modal-content-light disable-user-select">
                <div class="modal-head">
                    <p class="modal-title">
                        <img :src="'./img/icon-light.png'" class="modal-title-img modal-title-img-light"> Light
                    </p>
                </div>

                <div class="modal-body">
                    <div class="w-100">
                        <div class="row">
                            <div class="col-4">
                                <button @click="onClickLight('ambientLight')" class="light-btn">Ambient</button>
                            </div>

                            <div class="col-4">
                                <button @click="onClickLight('directionalLight')" class="light-btn">Directional</button>
                            </div>

                            <div class="col-4">
                                <button @click="onClickLight('hemisphereLight')" class="light-btn">Hemisphere</button>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col-4">
                                <button @click="onClickLight('spotLight')" class="light-btn">Spot</button>
                            </div>
                            <div class="col-4">
                                <button @click="onClickLight('pointLight')" class="light-btn">Point</button>
                            </div>
                            <div class="col-4">
                                <button @click="onClickLight('rectLight')" class="light-btn">Rect</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <div @click="onClickClose" class="modal-footer-btn">
                        <span>취소</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
    * template event : apply, select
    */
    export default {
        data: function () {
            return {
                disabled: false,
            };
        },
        methods: {
            open: function () {
                const me = this;

                $(me.$el).modal('show');
            },
            close: function () {
                const me = this;

                $(me.$el).modal('hide');
            },
            onClickClose: function () {
                const me = this;

                me.close();
            },
            onClickLight: function (type) {
                const me = this;

                me.$emit('select', type);

                me.close();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./modalStyle.scss";

    .light-btn {
        width: 100%;
        height: 100%;
        border: 1px solid #5d5d5d;
        background-color: #5d5d5d;
        color: #bdbdbd;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #eaeaea;

        &:hover {
            background-color: #8c8c8c;
            color: #eaeaea;
        }
    }
</style>