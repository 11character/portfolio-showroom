<template>
    <div class="input-light-field">
        <label v-if="label" class="label">{{ label }}</label>

        <input-slider v-model.number="intensity" :min="0" :max="2" :step="0.1" label="Intensity" class="input-slider"></input-slider>

        <input-slider v-model.number="lightAngle" :min="-90" :max="90" :step="1" label="Rotation" class="input-slider"></input-slider>
    </div>
</template>

<script>
    import * as StaticVariable from '../../../nemoShowroom/common/staticVariable';
    import AssetItem from '../../../nemoShowroom/common/assetItem';

    import Utils from '../../../class/utils';
    import inputSliderVue from '../inputItem/inputSlider.vue';

    import EditorInterface from '../../../nemoShowroom/common/editorInterface';

    /**
     * template event : control
     */
    export default {
        components: {
            'input-slider': inputSliderVue
        },
        props: {
            editor: {type: EditorInterface},
            label: {type: String}
        },
        data: function () {
            const me = this;

            return {
                intensity: 0,
                lightAngle: 0
            };
        },
        watch: {
            intensity: function (val) {
                const me = this;

                me.editor.setLightIntensity(val);

                me.$emit('control', 'lightIntensity');
            },
            lightAngle: function (val) {
                const me = this;

                me.editor.setLightHorizontalAngle(Utils.d2r(val));

                me.$emit('control', 'lightAngle');
            }
        },
        mounted: function () {
            const me = this;

            const func = me.editor.options.onLoad;

            me.editor.options.onLoad = function (assetItem) {
                me.intensity = me.editor.getLightIntensity();
                me.lightAngle = parseInt(Utils.r2d(me.editor.getLightHorizontalAngle()), 10);

                func(assetItem);
            };
        }
    }
</script>

<style lang="scss" scoped>
    .input-light-field {
        width: 100%;
        border: 1px solid #8c8c8c;
        border-radius: 0.25rem;
        padding: 1.25rem;

        .label {
            width: 100%;
            margin-bottom: 0px;
            font-size: 15px;
            font-weight: 600;
            text-align: left;
            color: #ffffff;
        }

        .input-slider {
            margin-top: 0.5rem;
        }

        .input-slider:last-child {
            margin-top: 1rem;
        }
    }
</style>