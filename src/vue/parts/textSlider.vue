<template>
    <div ref="sliderField" class="text-slider-field">
        <span ref="text" class="text">
            <slot><slot>
        </span>
    </div>
</template>

<script>
    export default {
        mounted: function () {
            const me = this;

            const jField = $(me.$refs.sliderField);
            const jText = $(me.$refs.text);

            const count = Math.floor(jField.width() * 2 / jText.width());
            const time = 10 / count;

            for (let i = 1; i < count; i ++) {
                const jClone = jText.clone();

                jClone.css('animationDelay', time * i + 's');
                jField.append(jClone);
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

        .text {
            position:absolute;
            top: 0px;
            left: 100%;
            white-space: nowrap;
            animation-name: slide;
            animation-duration: 10s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
    }
</style>