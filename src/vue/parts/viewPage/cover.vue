<template>
    <div ref="coverField" class="cover-field font-neuemachina">
        <div class="left"></div>

        <div class="center">
            <div v-if="percent < 100" class="progress border border-dark rounded-0">
                <div ref="bar" class="progress-bar"></div>
            </div>

            <div v-else @click="onClickEnter" class="btn-enter">Enter to Exhibition</div>
        </div>

        <div class="right pt-5 pl-5">
            <template v-if="percent < 100">
                <div class="loading-text">Please Wait</div>

                <div v-if="percent > 15" class="loading-text">It will be open soon</div>

                <div v-if="percent > 30" class="loading-text">We know it's slow..</div>

                <div v-if="percent > 45" class="loading-text">Almost done maybe</div>

                <div v-if="percent > 60" class="loading-text">Visit to a shop</div>

                <div v-if="percent > 75" class="loading-text">While waiting</div>
            </template>
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
                visible: true
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

                $(me.$refs.bar).css('width', val + '%');

                if (val >= 100) {
                    setTimeout(function () {
                        me.visible = false;
                    }, 1000);
                }
            }
        },
        methods: {
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
        background-size: 100%;
        background-color: #bdbdbd;
        display: flex;
        justify-content: center;

        .left {
            width: 25%;
            height: 100%;
        }

        .center {
            width: 50%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;

            .progress {
                width: 100%;
                height: 10px;

                .progress-bar {
                    background-color: #000000;
                }
            }

            .btn-enter {
                padding: 0px 1rem;
                background-color: #000000;
                color: #ffffff;
                cursor: default;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            .btn-enter:hover {
                background-color: #ffffff;
                color: #000000;
                border: 1px solid #000000;
            }
        }

        .right {
            width: 25%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;

            .loading-text {
                display: inline-block;
                padding: 0px 1rem;
            }

            .loading-text:nth-child(odd) {
                background-color: #000000;
                color: #ffffff;
            }

            .loading-text:nth-child(even) {
                background-color: #ffffff;
                border: 1px solid #000000;
            }
        }
    }
</style>