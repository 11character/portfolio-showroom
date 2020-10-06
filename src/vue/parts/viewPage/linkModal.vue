<template>
    <div :hidden="hidden" class="link-modal-field">
        <div class="link-modal-card font-showroom-bold">
            <div class="link-modal-header">
                <span @click="onClickCancel" class="icon">
                    <font-awesome-icon :icon="['fas', 'minus-square']"></font-awesome-icon>
                </span>
            </div>

            <div class="link-modal-body">
                <span>다음 전시장으로 이동하시겠습니까?</span>
            </div>

            <div class="link-modal-footer">
                <div @click="onClickOk" class="link-modal-button link-modal-button-n">Ok</div>
                <div @click="onClickCancel" class="link-modal-button">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: {type: 'String', default: window.location.href}
        },
        data: function () {
            return {
                hidden: true
            };
        },
        methods: {
            open: function (url) {
                const me = this;

                me.url = url;

                me.hidden = false;
            },
            close: function () {
                const me = this;

                me.hidden = true;
            },
            onClickOk: function () {
                const me = this;

                window.location.href = me.url;
            },
            onClickCancel: function () {
                const me = this;

                me.close();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .link-modal-field {
        width: 100vw;
        height: 100vh;
        position: fixed;
        z-index: 99;
        left: 0px;
        top: 0px;
        background-color: rgba(0, 0, 0, 0.5);

        .link-modal-card {
            width: 340px;
            height: 230px;
            position:absolute;
            left: 50%;
            top: 50%;
            margin-top: -115px;
            margin-left: -170px;
            background-color: #ffffff;
            border: 2px solid #000000;

            .link-modal-header {
                width: 100%;
                height: 38px;
                padding: 0px 18px;
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                font-size: 1.2rem;

                .icon {
                    cursor: pointer;
                }
            }

            .link-modal-body {
                width: 100%;
                height: 124px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
            }

            .link-modal-footer {
                width: 100%;
                height: 68px;
                display: flex;
                justify-content: center;
                align-items: center;

                .link-modal-button {
                    width: 80px;
                    border: 2px solid #000000;
                    color: #ffffff;
                    background-color: #000000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0px 8px;
                    cursor: pointer;
                }

                .link-modal-button-n {
                    color: #000000;
                    background-color: #ffffff;
                }
            }
        }
    }
</style>