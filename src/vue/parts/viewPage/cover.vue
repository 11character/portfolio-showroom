<template>
    <div ref="coverField" class="cover-field font-neuemachina">
        <div class="button-field">
            <div v-if="percent < 100" class="progress border border-dark rounded-0">
                <div ref="bar" class="progress-bar"></div>
            </div>

            <div v-else @click="onClickEnter" class="btn-enter disable-user-select">Enter to Exhibition</div>
        </div>

        <div class="loading-text-field">
            <div class="loading-text-list" v-if="percent < 100">
                <div class="loading-text">Please Wait</div>

                <div v-if="percent > 15" class="loading-text">It will be open soon</div>

                <div v-if="percent > 30" class="loading-text">We know it's slow..</div>

                <div v-if="percent > 45" class="loading-text">Almost done maybe</div>

                <div v-if="percent > 60" class="loading-text">Visit to a shop</div>

                <div v-if="percent > 75" class="loading-text">While waiting</div>
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

                $(me.$refs.bar).css('width', val + '%');
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

        .disable-user-select {
            cursor: default;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .button-field {
            width: 100%;
            height: 50px;
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
                padding: 0rem 1rem;
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

        .loading-text-field {
            margin-top: 100px;
            width: 100%;
            display: flex;
            justify-content: flex-end;

            .loading-text-list {
                width: 220px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;

                .loading-text {
                    display: inline-block;
                    padding: 0rem 1rem;
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
    }
</style>