<template>
    <div class="field">
        <div class="slider"></div>
    </div>
</template>

<script>
    /**
     * template event : slide
     */
    export default {
        props: {
            min: {default: 0},
            max: {default: 1},
            step: {default: 0.1},
            value: {default: 0.5}
        },
        watch: {
            value: function (val) {
                const me = this;

                val = val < me.min ? me.min : val;
                val = val > me.max ? me.max : val;

                $(me.$el).find('.slider').slider('value', val);
            }
        },
        mounted: function () {
            const me = this;

            $(me.$el).find('.slider').slider({
                min: me.nim,
                max: me.max,
                step: me.step,
                value: me.value

            }).on('slide', function (evt, ui) {
                me.$emit('input', ui.value);
                me.$emit('slide', ui.value);
            });
        }
    }
</script>