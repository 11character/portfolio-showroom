<template>
    <div ref="coverField" class="cover-field">
        <div ref="backgroundField" class="background-field">
            <img :src="img" class="background">
        </div>

        <div ref="textField" class="loading-text-field disable-user-select font-showroom-light">
            <div class="loading-text">Please Wait...</div>

            <div v-if="percent > 15" class="loading-text">To walk in the virtual gallery,</div>

            <div v-if="percent > 30" class="loading-text">Use W(↑) A(←) S(↓) D(→) for horizontal walk,</div>

            <div v-if="percent > 45" class="loading-text">and R(up), F(Down) for vertical move.</div>

            <div v-if="percent > 60" class="loading-text">You can change views with drags.</div>

            <div v-if="percent > 75" class="loading-text">Desktop is recommended</div>

            <div v-if="percent > 90" class="loading-text">Visit artshop while waiting...</div>
        </div>

        <div ref="progressField" class="progress-field">
            <div v-if="percent < 100" class="progress border border-dark rounded-0">
                <div ref="bar" class="progress-bar"></div>
            </div>

            <div v-else @click="onClickEnter" class="btn-enter disable-user-select font-showroom-light">Enter to Exhibition</div>
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
        data: function () {
            return {
                mobileWidth: 1090
            };
        },
        watch: {
            percent: function (val) {
                const me = this;

                me.positionSetting();

                $(me.$refs.bar).css('width', val + '%');
            }
        },
        mounted: function () {
            const me = this;

            $(window).on('resize.cover.page', function () {
                me.positionSetting();
            });

            me.positionSetting();
        },
        beforeDestroy: function () {
            $(window).off('resize.cover.page');
        },
        methods: {
            positionSetting: function () {
                const me = this;

                setTimeout(function () {
                    const jCover = $(me.$refs.coverField);
                    const coverW = jCover.width();
                    const coverH = jCover.height();

                    // progress
                    const jProgress = $(me.$refs.progressField);

                    const pLeft = (coverW - jProgress.width()) / 2;
                    const pTop = 35;

                    jProgress.css('left', pLeft + 'px').css('top', pTop + 'px');

                    // text
                    const jText = $(me.$refs.textField);

                    let tLeft = coverW - jText.width() - 18;
                    let tTop = coverH - jText.height() - 18;

                    // mobile
                    if ($(window).width() < me.mobileWidth) {
                        tLeft = (coverW - jText.width()) / 2;

                        tTop = (coverH - jText.height()) / 2;
                        tTop += pTop + jProgress.height();
                    }

                    jText.css('left', tLeft + 'px').css('top', tTop + 'px');
                }, 50);
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
        background-color: #000000;

        .background-field {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0px;
            top: 0px;
            overflow-y: auto;

            @media screen and (max-width: 1090px) {
                overflow-y: hidden;
                display: flex;
                align-items: center;
            }

            .background {
                width: 100%;
            }
        }

        .loading-text-field {
            width: 730px;
            position:absolute;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            @media screen and (max-width: 1090px) {
                width: 100%;
                max-width: 546px;
                align-items: center;
            }

            .loading-text {
                display: inline-block;
                padding: 0px 18px;
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

        .progress-field {
            width: 50%;
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: flex-start;

            @media screen and (max-width: 1090px) {
                width: 100%;
            }

            .progress {
                width: 100%;
                height: 18px;
                border: 2px solid #000000 !important;

                @media screen and (max-width: 1090px) {
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
                border: 2px solid #ffffff;
                font-size: 2rem;
                cursor: pointer;

                @media screen and (max-width: 1090px) {
                    font-size: 1.5rem;
                }
            }
        }
    }
</style>