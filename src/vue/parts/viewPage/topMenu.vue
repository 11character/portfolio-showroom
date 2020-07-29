<template>
    <div class="top-menu">
        <div class="logo"></div>

        <div class="top-buttons font-neuemachina">
            <div :hidden="!isShowText" ref="textField" class="text-field">동해물과 백두산이</div>

            <template v-if="isShowSmallButton">
                <div class="top-button-sm">
                    <div class="content">
                        <span>Enter to Art Shop</span>
                    </div>
                </div>

                <div @click="onClcikText" class="top-button-sm">
                    <div class="content">
                        <span>Selected Text</span>
                    </div>

                    <div v-if="isShowText" class="icon">
                        <font-awesome-icon :icon="['fas', 'minus-square']"></font-awesome-icon>
                    </div>

                    <div v-else class="icon">
                        <font-awesome-icon :icon="['fas', 'plus-square']"></font-awesome-icon>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="top-button">
                    <div class="content">
                        <span>Enter to Art Shop</span>
                    </div>
                </div>

                <div @click="onClcikText" ref="textButton" class="top-button">
                    <div class="content">
                        <span>Selected Text:</span>
                        <br>
                        <span>Introduction / Artist Statement</span>
                    </div>

                    <div v-if="isShowText" class="icon">
                        <font-awesome-icon :icon="['fas', 'minus-square']"></font-awesome-icon>
                    </div>

                    <div v-else class="icon">
                        <font-awesome-icon :icon="['fas', 'plus-square']"></font-awesome-icon>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['buttonSm'],
        data: function () {
            const me = this;

            return {
                isSmallMode: false,
                isShowSmallButton: false,
                isShowText: false
            };
        },
        methods: {
            smallButton: function () {
                const me = this;

                me.isShowSmallButton = true;
            },
            bigButton: function () {
                const me = this;

                me.isShowSmallButton = false;
            },
            smallMode: function () {
                const me = this;

                me.isSmallMode = true;
                me.smallButton();
            },
            bigMode: function () {
                const me = this;

                me.isSmallMode = false;
                me.bigButton();
            },
            showText: function () {
                const me = this;

                me.bigButton();

                setTimeout(function () {
                    const jButton = $(me.$refs.textButton);
                    const jText = $(me.$refs.textField);
                    
                    const position = jButton.offset();
                    const top = position.top + jButton.outerHeight();
                    const left = position.left;
    
                    jText.width(jButton.outerWidth() - 34).css('top', top + 'px').css('left', left + 'px');
    
                    me.isShowText = true;
                }, 100);
            },
            hideText: function () {
                const me = this;

                me.isShowText = false;

                if (me.isSmallMode) {
                    me.smallButton();
                }
            },
            onClcikText: function () {
                const me = this;

                if (me.isShowText) {
                    me.hideText();

                } else {
                    me.showText();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .top-menu {
        width: 100%;
        height: 100%;
        display: flex;
        padding: 18px 18px;
        justify-content: space-between;
        flex-wrap: wrap;

        .logo {
            width: 97px;
            height: 60px;
            background-image: url('../../../../public/img/logo.png');
            background-position: center;
            background-size: 100%;
        }

        .top-buttons {
            width: 67%;
            max-width: 1160px;
            height: 100%;
            display: flex;
            justify-content: flex-end;

            .top-button {
                width:50%;
                height: 100%;
                padding: 0.5rem 1rem;
                font-size: 1.2rem;
                font-weight: bold;
                background-color: #ffffff;
                border-top: 1px solid #000000;
                border-left: 1px solid #000000;
                border-bottom: 1px solid #000000;
                cursor: default;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                display: flex;

                .content {
                    width: 90%;
                    overflow: hidden;
                    white-space:nowrap;
                    word-wrap:normal;
                    text-overflow:ellipsis;
                }

                .icon {
                    width: 10%;
                    text-align: right;
                }
            }

            .top-button:last-child {
                border-right: 1px solid #000000;
            }

            .top-button:hover {
                color: #ffffff;
                border: 1px solid #ffffff;
                background-color: #000000;
            }

            .top-button-sm {
                width:50%;
                max-width: 250px;
                height: 45px;
                padding: 0.5rem 1rem;
                font-size: 1.2rem;
                font-weight: bold;
                color: #ffffff;
                background-color: #000000;
                border-top: 1px solid #ffffff;
                border-left: 1px solid #ffffff;
                border-bottom: 1px solid #ffffff;
                cursor: default;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                display: flex;

                .content {
                    width: 90%;
                    overflow: hidden;
                    white-space:nowrap;
                    word-wrap:normal;
                    text-overflow:ellipsis;
                }

                .icon {
                    width: 10%;
                    text-align: right;
                }
            }

            .top-button-sm:last-child {
                border-right: 1px solid #ffffff;
            }

            .top-button-sm:hover {
                color: #000000;
                border: 1px solid #000000;
                background-color: #ffffff;
            }
        }

        .text-field {
            position: absolute;
            height: 30vh;
            max-height: 400px;
            padding: 16px;
            overflow-y: auto;
            font-weight: bold;
            color: #ffffff;
            background-color: #000000;
            border: 1px solid #ffffff;
        }
    }
</style>