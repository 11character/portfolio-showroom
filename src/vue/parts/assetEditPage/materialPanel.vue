<template>
    <div v-if="material" class="field">
        <div class="item-row">
            <label class="label">{{ material.type }}</label>
        </div>

        <div v-if="material.roughness" class="item-row">
            <input-slider v-model="material.roughness" label="Roughness"></input-slider>
        </div>

        <div v-if="material.metalness" class="item-row">
            <input-slider v-model="material.metalness" label="Metalness"></input-slider>
        </div>

        <div v-if="material.color" class="item-row">
            <input-color v-model="material.color" label="Color"></input-color>
        </div>
    </div>
</template>

<script>
    import * as THREE from 'three/build/three.module';

    import inputSliderVue from '../inputItem/inputSlider.vue';
    import inputColorVue from '../inputItem/inputColor.vue';

    export default {
        components: {
            'input-slider': inputSliderVue,
            'input-color': inputColorVue
        },
        props: {
            material: {type: THREE.Material, default: null}
        }
    }
</script>

<style lang="scss" scoped>
    .field {
        width: 100%;
        height: 100%;

        .item-row {
            width: 100%;
            padding: 0px 1rem;
            margin-top: 1rem;

            .label {
                font-size: 15px;
                font-weight: 600;
                color: #ffffff;
            }
        }

        .item-row:first-child {
            margin-top: 0px;
        }
    }
</style>