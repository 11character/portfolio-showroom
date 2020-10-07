<template>
    <div ref="sliderField" class="text-slider-field">
        <span ref="text" class="org-text">
            <slot><slot>
        </span>
    </div>
</template>

<script>
    export default {
        mounted: function () {
            const me = this;

            setTimeout(function () {
                me.init();
            }, 50);
        },
        methods: {
            init: function () {
                const me = this;

                // 전체 이동 시간.
                const moveTime = 5000 * 2;

                const jField = $(me.$refs.sliderField);
                const jText = $(me.$refs.text);

                const fieldW = jField.width();
                const textW = jText.width();

                if (textW != 0) {
                    // 글자의 수는 올림 처리한 정수 개 사용.
                    const count = Math.ceil((fieldW * 2) / textW);
                    const time = (moveTime / (fieldW * 2)) * textW;

                    for (let i = 0; i < count; i ++) {
                        const jClone = jText.clone();

                        jClone.attr('class', 'text');
                        jClone.css('animationDelay', (time * i) + 'ms');

                        jClone.on('animationiteration', function () {
                            const jEl = $(this);

                            // 마지막 글자 다 보일 때 까지 반복 대기.
                            // 필드 길이를 글자 길이로 나누었을 때 정수로 나누어 지지 않기 때문에 보정하는 시간.
                            jEl.css('animationPlayState', 'paused');

                            setTimeout(function () {
                                jEl.css('animationPlayState', 'running');
                            }, (time * 5 - moveTime));
                        });

                        jField.append(jClone);
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @keyframes slide {
        from {
            left: 100%;
        }

        to {
            left: -100%;
        }
    }

    .text-slider-field {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;

        .org-text {
            visibility: hidden;
        }

        .text {
            position:absolute;
            top: 0px;
            left: 100%;
            white-space: nowrap;
            animation-name: slide;
            animation-duration: 10000ms;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
    }
</style>