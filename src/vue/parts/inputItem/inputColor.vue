<template>
    <div class="field">
        <div class="label">{{ label }}</div>
        <div ref="colorBox" class="color-box"></div>
    </div>
</template>

<script>
    import * as THREE from 'three/build/three.module';

    import Pickr from '@simonwep/pickr';
    import '@simonwep/pickr/dist/themes/monolith.min.css';

    export default {
        props: {
            label: {type: String, default: ''},
            value: {type: THREE.Color, default: new THREE.Color('rgba(255, 255, 255, 1)')}
        },
        data: function () {
            return {
                colorPickr: null
            };
        },
        watch: {
            value: function (val) {
                const me = this;

                const rgba = val.getStyle(0);
                $(me.$refs.colorBox).css('backgroundColor', rgba);
            }
        },
        mounted: function () {
            const me = this;

            me.colorPickr = Pickr.create({
                el: me.$refs.colorBox,
                useAsButton: true,
                theme: 'monolith',
                default: me.value.getStyle(),
                components: {
                    preview: false,
                    opacity: false,
                    hue: true
                }
            }).on('change', function (color) {
                const rgba = new THREE.Color(color.toRGBA().toString(0));

                me.value = rgba;
                $(me.$refs.colorBox).css('backgroundColor', rgba);
                me.$emit('input', rgba);
            });

            $(me.$refs.colorBox).css('backgroundColor', me.value.getStyle(0));
        },
        beforeDestroy: function () {
            const me = this;

            me.colorPickr.destroy();
        }
    }
</script>

<style lang="scss" scoped>
    .field {
        width: 100%;

        .label {
            width: 100%;
            font-size: 15px;
            font-weight: 600;
            text-align: left;
            color: #ffffff;
        }

        .color-box {
            width: 100%;
            height: 1rem;
            margin-top: 5px;
            border: 1px solid #ffffff;
        }
    }
</style>