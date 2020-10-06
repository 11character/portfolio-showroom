<template>
    <div ref="coverField" class="cover-field">
        <div ref="progressField" class="progress-field">
            <div v-if="percent < 100" class="progress border border-dark rounded-0">
                <div ref="bar" class="progress-bar"></div>
            </div>

            <div v-else @click="onClickEnter" class="btn-enter disable-user-select font-showroom-light">Enter to Exhibition</div>
        </div>

        <div ref="textField" class="loading-text-field disable-user-select">
            <div class="loading-text-list font-showroom-light">
                <div class="loading-text">Please Wait...</div>

                <div v-if="percent > 15" class="loading-text">To walk in the virtual gallery,</div>

                <div v-if="percent > 30" class="loading-text">Use W(↑) A(←) S(↓) D(→) for horizontal walk,</div>

                <div v-if="percent > 45" class="loading-text">and R(up), F(Down) for vertical move.</div>

                <div v-if="percent > 60" class="loading-text">You can change views with drags.</div>

                <div v-if="percent > 75" class="loading-text">Desktop is recommended for optimal interface.</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            percent: {
                type: Number,
                default: 0
            },
            img: {
                type: String,
                default: ''
            }
        },
        watch: {
            img: function (val) {
                const me = this;

                if (val) {
                    $(me.$refs.coverField).css('backgroundImage', 'url(./' + val + '?t=' + Date.now() + ')');
                }
            },
            percent: function (val) {
                const me = this;

                setTimeout(function () {
                    me.textMargin();
                }, 10);

                $(me.$refs.bar).css('width', val + '%');
            }
        },
        mounted: function () {
            const me = this;

            $(window).on('resize.cover.page', function () {
                me.textMargin();
            });

            setTimeout(function () {
                me.textMargin();
            }, 100);
        },
        beforeDestroy: function () {
            $(window).off('resize.cover.page');
        },
        methods: {
            textMargin: function () {
                const me = this;

                const jTextField = $(me.$refs.textField);

                if ($(window).width() < 1090) {
                    const coverH = $(me.$refs.coverField).height();
                    const progressFieldH = $(me.$refs.progressField).outerHeight() + 35;
                    const textFieldH = jTextField.outerHeight();

                    let marginBottom = (coverH - progressFieldH) / 2;
                    marginBottom -= (textFieldH / 2);

                    jTextField.css('marginBottom', marginBottom + 'px');

                } else {
                    jTextField.attr('style', '');
                }
            },
            onClickEnter: function () {
                const me = this;

                me.$emit('enter');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cover-field {
        width: 100%;
        height: 100%;
        background-position: center;
        background-color: #000000;
        background-repeat: no-repeat;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .progress-field {
            width: 100%;
            margin-top: 35px;
            display: flex;
            justify-content: center;
            align-items: flex-start;

            .progress {
                width: 50%;
                height: 18px;
                border: 2px solid #000000 !important;

                @media screen and (max-width: 1090px) {
                    width: 100%;
                    height: 14px;
                    border-left: none !important;
                    border-right: none !important;
                }

                .progress-bar {
                    height: 100%;
                    background-color: #000000;
                }
            }

            .btn-enter {
                padding: 0rem 1rem;
                background-color: #000000;
                color: #ffffff;
                font-size: 2rem;
                cursor: pointer;

                @media screen and (max-width: 1090px) {
                    font-size: 1.5rem;
                }
            }
        }

        .loading-text-field {
            width: 100%;
            margin-bottom: 35px;
            display: flex;
            justify-content: flex-end;

            @media screen and (max-width: 1090px) {
                justify-content: center;
            }

            .loading-text-list {
                width: 765px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;

                @media screen and (max-width: 1090px) {
                    align-items: center;
                }

                .loading-text {
                    display: inline-block;
                    padding: 0rem 1rem;
                    font-size: 1.9rem;

                    @media screen and (max-width: 1090px) {
                        font-size: 1.4rem;
                    }
                }

                .loading-text:nth-child(even) {
                    font-weight: bold;
                }

                .loading-text:nth-child(odd) {
                    background-color: #000000;
                    color: #ffffff;
                }

                .loading-text:nth-child(even) {
                    background-color: #ffffff;
                    border: 2px solid #000000;
                }
            }
        }
    }
</style>