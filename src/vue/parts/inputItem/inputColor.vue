<template>
    <div class="input-color-field">
        <div v-if="label" class="label">{{ label }}</div>

        <div :class="{'none-color': !value}" ref="colorBox" class="color-box"></div>
    </div>
</template>

<script>
    import * as THREE from 'three/build/three.module';

    import Pickr from '@simonwep/pickr';
    import '@simonwep/pickr/dist/themes/monolith.min.css';

    /**
     * template event : input
     */
    export default {
        props: {
            label: {type: String, default: ''},
            value: {type: THREE.Color, default: 'rgba(255, 255, 255, 1)'}
        },
        data: function () {
            return {
                colorPickr: null
            };
        },
        watch: {
            value: function (val) {
                const me = this;

                const jColor = $(me.$refs.colorBox);

                jColor.css('backgroundColor', val);

                if (val) {
                    jColor.text('');

                } else {
                    jColor.text('none');
                }
            }
        },
        mounted: function () {
            const me = this;

            me.colorPickr = Pickr.create({
                el: me.$refs.colorBox,
                useAsButton: true,
                theme: 'monolith',
                components: {
                    preview: false,
                    opacity: false,
                    hue: true
                }
            });

            me.colorPickr.on('change', function (color) {
                const rgba = color.toRGBA().toString(0);

                me.value = rgba;
                $(me.$refs.colorBox).css('backgroundColor', rgba);
                me.$emit('input', rgba);
            });

            setTimeout(function () {
                me.colorPickr.setColor(me.value);
                $(me.$refs.colorBox).css('backgroundColor', me.value);
            }, 100);
        },
        beforeDestroy: function () {
            const me = this;

            me.colorPickr.destroy();
        }
    }
</script>

<style lang="scss" scoped>
    .input-color-field {
        width: 100%;

        .label {
            width: 100%;
            margin-bottom: 0px;
            font-size: 15px;
            font-weight: 600;
            text-align: left;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }

        .color-box {
            width: 100%;
            height: 25px;
            border: 1px solid #ffffff;
            border-radius: 0.25rem;
        }

        .none-color {
            text-align: center;
            background-color: #343a40;
            color: #ffffff;
        }
    }
</style>