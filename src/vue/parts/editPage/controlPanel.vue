<template>
    <div class="control-panel-field">
        <div class="item-row">
            <div class="edit-btns">
                <div class="edit-btn-row">
                    <button @click="onClickUndo" class="edit-btn">
                        <font-awesome-icon :icon="['fas', 'undo-alt']"></font-awesome-icon>&nbsp;Undo
                    </button>

                    <button @click="onClickRedo" class="edit-btn">
                        <font-awesome-icon :icon="['fas', 'redo-alt']"></font-awesome-icon>&nbsp;Redo
                    </button>
                </div>

                <div class="edit-btn-row">
                    <button @click="onClickMode('translate')" class="edit-btn">
                        <font-awesome-icon :icon="['fas', 'arrows-alt']"></font-awesome-icon>
                    </button>

                    <button @click="onClickMode('rotate')" class="edit-btn">
                        <font-awesome-icon :icon="['fas', 'sync-alt']"></font-awesome-icon>
                    </button>

                    <button @click="onClickAllScaleUp" class="edit-btn">
                        <font-awesome-icon :icon="['fas', 'expand']"></font-awesome-icon>
                    </button>

                    <button @click="onClickAllScaleDown" class="edit-btn">
                        <font-awesome-icon :icon="['fas', 'compress']"></font-awesome-icon>
                    </button>
                </div>
            </div>
        </div>

        <div class="item-row">
            <input-world-light :editor="editor" @control="onControl" label="World light"></input-world-light>
        </div>

        <template v-if="editor.selectedItem">
            <div class="item-row">
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a ref="firstTabBtn" class="nav-link active" data-toggle="tab" href=".tab-1">Control</a>
                    </li>

                    <li v-if="is3dModel" class="nav-item">
                        <a class="nav-link" data-toggle="tab" href=".tab-2">Material</a>
                    </li>

                    <li v-if="!isSystemModel" class="nav-item">
                        <a class="nav-link" data-toggle="tab" href=".tab-3">Buttons</a>
                    </li>
                </ul>

                <div class="control-row">
                    <div class="control-name">{{ assetItem.name }}</div>
                </div>

                <div v-if="is3dModel" class="control-row">
                    <button @click="onClickReload" type="button" class="control-btn" tabindex="-1">Reload</button>
                </div>

                <div class="tab-content">
                    <div class="tab-1 tab-pane fade show active">
                        <div class="asset-control-field">
                            <div v-if="!assetItem.isStartPoint" class="control-row">
                                <button @click="onClickCopy" type="button" class="control-btn" tabindex="-1">
                                    <font-awesome-icon :icon="['fas', 'clone']"></font-awesome-icon>&nbsp;Copy
                                </button>
                            </div>

                            <div class="control-row">
                                <button @click="onClickRemove" type="button" class="control-btn" tabindex="-1">
                                    <font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>&nbsp;Remove
                                </button>
                            </div>

                            <div v-if="!isSystemModel" class="asset-control-field">
                                <div class="control-row control-row-flex">
                                    <input-checkbox v-model="backgroundLoading" label="Background loading"></input-checkbox>
                                </div>

                                <div class="control-row control-row-flex">
                                    <input-checkbox v-model="isClickTarget" label="Click"></input-checkbox>

                                    <template v-if="StaticVariable.ITEM_CSS_TYPES.indexOf(assetItem.type) == -1">
                                        <input-checkbox v-model="isTransparent" label="Hidden"></input-checkbox>
                                    </template>

                                    <input-checkbox v-model="isCollider" label="Collider"></input-checkbox>
                                </div>
                            </div>

                            <div v-if="!isSystemModel" class="asset-control-field">
                                <div class="control-row text-center">
                                    <div class="control-label">Shadow</div>
                                </div>

                                <div class="control-row control-row-flex">
                                    <input-checkbox v-model="castShadow" label="Cast"></input-checkbox>

                                    <input-checkbox v-if="StaticVariable.ITEM_CSS_TYPES.indexOf(assetItem.type) == -1" v-model="receiveShadow" label="Receive"></input-checkbox>
                                </div>
                            </div>

                            <div v-if="(contentType == 'text')" class="control-row">
                                <button @click="onClickTextEdit" type="button" class="control-btn" tabindex="-1">
                                    <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>&nbsp;Edit
                                </button>
                            </div>

                            <div v-if="!assetItem.isStartPoint && !assetItem.isLight" class="control-row">
                                <input-number v-model.number="scaleX" :step="0.1" class="sub-control-row" sub-label="X" label="Scale ( % )"></input-number>
                                <input-number v-model.number="scaleY" :step="0.1" class="sub-control-row" sub-label="Y"></input-number>
                                <input-number v-model.number="scaleZ" :step="0.1" class="sub-control-row" sub-label="Z"></input-number>
                            </div>

                            <div class="control-row">
                                <input-number v-model.number="positionX" :step="0.5" class="sub-control-row" sub-label="X" label="Position"></input-number>
                                <input-number v-model.number="positionY" :step="0.5" class="sub-control-row" sub-label="Y"></input-number>
                                <input-number v-model.number="positionZ" :step="0.5" class="sub-control-row" sub-label="Z"></input-number>
                            </div>

                            <div v-if="!assetItem.isStartPoint && !assetItem.isSprite" class="control-row">
                                <input-number v-model.number="rotationX" :step="1" class="sub-control-row" sub-label="X" label="Rotation ( ° )"></input-number>
                                <input-number v-model.number="rotationY" :step="1" class="sub-control-row" sub-label="Y"></input-number>
                                <input-number v-model.number="rotationZ" :step="1" class="sub-control-row" sub-label="Z"></input-number>
                            </div>

                            <div v-if="assetItem.isStartPoint" class="control-row">
                                <input-number v-model.number="rotationY" :step="1" class="sub-control-row" sub-label="Y" label="Rotation ( ° )"></input-number>
                            </div>

                            <div v-if="assetItem.type != 'youtube' && !assetItem.isLight && !assetItem.isStartPoint" class="control-row">
                                <input-text v-model.trim="link" label="Link"></input-text>
                            </div>

                            <div v-if="assetItem.isAnimation" class="control-row">
                                <input-number v-model.number="animationEndTime" :step="1000" label="Animation time ( ms )"></input-number>
                            </div>

                            <!-- 조명 -->
                            <template v-if="assetItem.isLight">
                                <!-- rect light 의 경우 조명 밝기 최대 값을 10으로 처리. -->
                                <template v-if="assetItem.type == StaticVariable.ITEM_TYPE_RECT_LIGHT">
                                    <div class="control-row">
                                        <input-slider v-model.number="lightOptions.intensity" :key="assetItem.type" :min="0" :max="10" :step="0.1" label="Light intensity"></input-slider>
                                    </div>
                                </template>

                                <template v-else>
                                    <div class="control-row">
                                        <input-slider v-model.number="lightOptions.intensity" :key="assetItem.type" :min="0" :max="2" :step="0.1" label="Light intensity"></input-slider>
                                    </div>
                                </template>

                                <!-- spot light -->
                                <template v-if="assetItem.type == StaticVariable.ITEM_TYPE_SPOT_LIGHT">
                                    <div class="control-row">
                                        <input-slider v-model.number="lightOptions.angle" :key="assetItem.type" :min="1" :max="180" :step="1" label="Light angle"></input-slider>
                                    </div>

                                    <div class="control-row">
                                        <input-slider v-model.number="lightOptions.penumbra" :key="assetItem.type" :min="0" :max="1" :step="0.1" label="Light penumbra"></input-slider>
                                    </div>

                                    <div class="control-row">
                                        <input-slider v-model.number="lightOptions.distance" :key="assetItem.type" :min="0" :max="100" :step="1" label="Light distance"></input-slider>
                                    </div>

                                    <div class="control-row">
                                        <input-slider v-model.number="lightOptions.decay" :key="assetItem.type" :min="0" :max="2" :step="0.1" label="Light decay"></input-slider>
                                    </div>
                                </template>

                                <!-- point light -->
                                <template v-if="assetItem.type == StaticVariable.ITEM_TYPE_POINT_LIGHT">
                                    <div class="control-row">
                                        <input-slider v-model.number="lightOptions.distance" :key="assetItem.type" :min="0" :max="100" :step="1" label="Light distance"></input-slider>
                                    </div>

                                    <div class="control-row">
                                        <input-slider v-model.number="lightOptions.decay" :key="assetItem.type" :min="0" :max="2" :step="0.1" label="Light decay"></input-slider>
                                    </div>
                                </template>

                                <!-- rect light -->
                                <template v-if="assetItem.type == StaticVariable.ITEM_TYPE_RECT_LIGHT">
                                    <div class="control-row">
                                        <input-number v-model.number="lightOptions.width" :key="assetItem.type" :step="0.1" label="Light width"></input-number>
                                    </div>

                                    <div class="control-row">
                                        <input-number v-model.number="lightOptions.height" :key="assetItem.type" :step="0.1" label="Light height"></input-number>
                                    </div>
                                </template>

                                <div class="control-row">
                                    <input-color v-model="lightOptions.color" :key="assetItem.type" label="Light color"></input-color>
                                </div>

                                <!-- hemisphere light -->
                                <template v-if="assetItem.type == StaticVariable.ITEM_TYPE_HEMISPHERE_LIGHT">
                                    <div class="control-row">
                                        <input-color v-model="lightOptions.groundColor" :key="assetItem.type" label="Light ground color"></input-color>
                                    </div>
                                </template>

                                <!-- 그림자 설정 -->
                                <div class="control-row">
                                    <input-checkbox v-model="lightOptions.castShadow" :key="assetItem.type" label="Cast shadow"></input-checkbox>
                                </div>

                                <!-- <div class="control-row">
                                    <input-number v-model="lightOptions.shadowMapSizeW" :key="assetItem.type" :step="1" label="Shadow map width"></input-number>
                                </div>

                                <div class="control-row">
                                    <input-number v-model="lightOptions.shadowMapSizeH" :key="assetItem.type" :step="1" label="Shadow map height"></input-number>
                                </div> -->

                                <div class="control-row">
                                    <input-number v-model="lightOptions.shadowBias" :key="assetItem.type" :step="0.001" label="Shadow bias"></input-number>
                                </div>

                                <div class="control-row">
                                    <input-number v-model="lightOptions.shadowCameraNear" :key="assetItem.type" :step="1" label="Shadow camera near"></input-number>
                                </div>

                                <div class="control-row">
                                    <input-number v-model="lightOptions.shadowCameraFar" :key="assetItem.type" :step="1" label="Shadow camera far"></input-number>
                                </div>

                                <template v-if="assetItem.type == StaticVariable.ITEM_TYPE_DIRECTIONAL_LIGHT">
                                    <div class="control-row">
                                        <input-number v-model="shadowCameraSize.width" :key="assetItem.type" :step="1" label="Shadow camera width"></input-number>
                                    </div>

                                    <div class="control-row">
                                        <input-number v-model="shadowCameraSize.height" :key="assetItem.type" :step="1" label="Shadow camera height"></input-number>
                                    </div>
                                </template>

                                <!-- spot light -->
                                <!-- <template v-if="assetItem.type == StaticVariable.ITEM_TYPE_SPOT_LIGHT">
                                    <div class="control-row">
                                        <input-slider v-model="lightOptions.shadowFocus" :key="assetItem.type" :min="0" :max="1" :step="0.1" label="Shadow focus"></input-slider>
                                    </div>
                                </template> -->
                            </template>
                            <!-- END-조명 -->
                        </div>
                    </div>

                    <div class="tab-2 tab-pane fade">
                        <div class="asset-material-field">
                            <mesh-panel :asset-item="assetItem" @control="onControl"></mesh-panel>
                        </div>
                    </div>

                    <div class="tab-3 tab-pane fade">
                        <div class="asset-material-field">
                            <asset-button-panel :asset-item="assetItem" @control="onControl"></asset-button-panel>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import * as StaticVariable from '../../../nemoShowroom/common/staticVariable';
    import AssetItem from '../../../nemoShowroom/common/assetItem';
    import LightOptions from '../../../nemoShowroom/common/lightOptions';
    import ModelFileInfo from '../../../class/modelFileInfo';
    import Utils from '../../../class/utils';
    import * as ApiUrl from '../../../class/apiUrl';

    import meshPanelVue from '../assetEditPage/meshPanel.vue';
    import assetButtonPanelVue from '../assetEditPage/assetButtonPanel.vue';
    import inputWorldLightVue from '../inputItem/inputWorldLight.vue';
    import inputNumberVue from '../inputItem/inputNumber.vue';
    import inputTextVue from '../inputItem/inputText.vue';
    import inputSliderVue from '../inputItem/inputSlider.vue';
    import inputCheckboxVue from '../inputItem/inputCheckbox.vue';
    import inputColorVue from '../inputItem/inputColor.vue';

    /**
     * template event : control
     */
    export default {
        components: {
            'mesh-panel': meshPanelVue,
            'asset-button-panel': assetButtonPanelVue,
            'input-world-light': inputWorldLightVue,
            'input-number': inputNumberVue,
            'input-text': inputTextVue,
            'input-slider': inputSliderVue,
            'input-checkbox': inputCheckboxVue,
            'input-color': inputColorVue
        },
        props: ['editor'],
        data: function () {
            const me = this;

            return {
                StaticVariable: StaticVariable,
                lockEvent: false,
                isSystemModel: false,
                is3dModel: false,
                contentType: '',
                assetItem: new AssetItem(),
                light: me.editor.light,
                scaleX: 0,
                scaleY: 0,
                scaleZ: 0,
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                animationEndTime: 0,
                lightOptions: new LightOptions(),
                shadowCameraSize: {width: 0, height: 0},
                link: '',
                backgroundLoading: false,
                castShadow: false,
                receiveShadow: false,
                isClickTarget: false,
                isTransparent: false,
                isCollider: false
            };
        },
        watch: {
            scaleX: function (percent) {
                const me = this;

                if (percent <= 0) {
                    alert('0 이하의 값은 가질 수 없습니다.');

                    me.scaleX = 0.1;

                } else {
                    me.setScale();
                }
            },
            scaleY: function (percent) {
                const me = this;

                if (percent <= 0) {
                    alert('0 이하의 값은 가질 수 없습니다.');

                    me.scaleY = 0.1;

                } else {
                    me.setScale();
                }
            },
            scaleZ: function (percent) {
                const me = this;

                if (percent <= 0) {
                    alert('0 이하의 값은 가질 수 없습니다.');

                    me.scaleZ = 0.1;

                } else {
                    me.setScale();
                }
            },
            positionX: function () {
                const me = this;

                me.setPosition();
            },
            positionY: function () {
                const me = this;

                me.setPosition();
            },
            positionZ: function () {
                const me = this;

                me.setPosition();
            },
            rotationX: function () {
                const me = this;

                me.setRotation();
            },
            rotationY: function () {
                const me = this;

                me.setRotation();
            },
            rotationZ: function () {
                const me = this;

                me.setRotation();
            },
            animationEndTime: function (ms) {
                const me = this;

                if (!me.lockEvent) {
                    me.editor.setAnimationTime(0, ms, true);

                    me.$emit('control', 'animationTime');
                }
            },
            link: function (str) {
                const me = this;

                if (!me.lockEvent) {
                    me.editor.setLink(str);

                    me.$emit('control', 'link');
                }
            },
            backgroundLoading: function (bool) {
                const me = this;

                if (!me.lockEvent) {
                    const assetItem = me.editor.selectedItem;

                    if (assetItem) {
                        assetItem.backgroundLoading = bool;
                    }

                    me.$emit('control', 'backgroundLoading');
                }
            },
            castShadow: function (bool) {
                const me = this;

                if (!me.lockEvent) {
                    const assetItem = me.editor.selectedItem;

                    if (assetItem) {
                        assetItem.setCastShadow(bool);
                    }
                }
            },
            receiveShadow: function (bool) {
                const me = this;

                if (!me.lockEvent) {
                    const assetItem = me.editor.selectedItem;

                    if (assetItem) {
                        assetItem.setReceiveShadow(bool);
                    }
                }
            },
            lightOptions: {
                deep: true,
                handler: function () {
                    const me = this;

                    if (!me.lockEvent) {
                        me.setLightOptions();
                    }
                }
            },
            shadowCameraSize: {
                deep: true,
                handler: function () {
                    const me = this;

                    if (!me.lockEvent) {
                        me.setLightOptions();
                    }
                }
            },
            isClickTarget: function (bool) {
                const me = this;

                if (!me.lockEvent) {
                    const assetItem = me.editor.selectedItem;

                    if (assetItem) {
                        assetItem.isClickTarget = bool;
                    }

                    me.$emit('control', 'isClickTarget');
                }
            },
            isTransparent: function (bool) {
                const me = this;

                if (!me.lockEvent) {
                    const assetItem = me.editor.selectedItem;

                    if (assetItem) {
                        assetItem.isTransparent = bool;
                    }

                    me.$emit('control', 'isTransparent');
                }
            },
            isCollider: function (bool) {
                const me = this;

                if (!me.lockEvent) {
                    const assetItem = me.editor.selectedItem;

                    if (assetItem) {
                        assetItem.isCollider = bool;
                    }

                    me.$emit('control', 'isCollider');
                }
            }
        },
        mounted: function () {
            const me = this;

            //==========
            const evt1 = me.editor.options.onSelect;

            me.editor.options.onSelect = function (assetItem, editor) {
                evt1(assetItem, editor);

                $(me.$refs.firstTabBtn).tab('show');

                me.is3dModel = StaticVariable.ITEM_3D_TYPES.indexOf(assetItem.type) > -1;
                me.isSystemModel = StaticVariable.ITEM_SYSTEM_TYPES.indexOf(assetItem.type) > -1;
                me.assetItem = assetItem;

                me.setItemData(me.assetItem);
            };

            //==========
            const evt2 = me.editor.options.onDeselect;

            me.editor.options.onDeselect = function (editor) {
                evt2(editor);

                me.assetItem = new AssetItem();
            };

            //==========
            const evt3 = me.editor.options.onMove;

            me.editor.options.onMove = function (itemArr, editor) {
                evt3(itemArr, editor);

                me.setItemData(me.assetItem);

                me.$emit('control', 'move');
            };
        },
        methods: {
            setItemData: function (assetItem) {
                const me = this;

                // 데이터를 표시할 때 이벤트 발생을 막기위한 플래그.
                me.lockEvent = true;

                me.contentType = assetItem.type;

                if (me.contentType == 'html') {
                    me.contentType = $(assetItem.content).data('type') || 'html';
                }

                me.scaleX = parseFloat((assetItem.scale.x / assetItem.zeroScale.x * 100).toFixed(3));
                me.scaleY = parseFloat((assetItem.scale.y / assetItem.zeroScale.y * 100).toFixed(3));
                me.scaleZ = parseFloat((assetItem.scale.z / assetItem.zeroScale.y * 100).toFixed(3));
                me.positionX = parseFloat(assetItem.position.x.toFixed(3));
                me.positionY = parseFloat(assetItem.position.y.toFixed(3));
                me.positionZ = parseFloat(assetItem.position.z.toFixed(3));
                me.rotationX = parseFloat(Utils.r2d(assetItem.rotation.x).toFixed(3));
                me.rotationY = parseFloat(Utils.r2d(assetItem.rotation.y).toFixed(3));
                me.rotationZ = parseFloat(Utils.r2d(assetItem.rotation.z).toFixed(3));
                me.animationEndTime = assetItem.animationEndTime;
                me.link = assetItem.link;
                me.backgroundLoading = assetItem.backgroundLoading;
                me.castShadow = assetItem.castShadow;
                me.receiveShadow = assetItem.receiveShadow;
                me.isClickTarget = assetItem.isClickTarget;
                me.isTransparent = assetItem.isTransparent;
                me.isCollider = assetItem.isCollider;

                const lOptions = assetItem.lightOptions;

                me.lightOptions.width = lOptions.width;
                me.lightOptions.height = lOptions.height;
                me.lightOptions.angle = Math.round(Utils.r2d(lOptions.angle));
                me.lightOptions.intensity = lOptions.intensity;
                me.lightOptions.penumbra = lOptions.penumbra;
                me.lightOptions.distance = lOptions.distance;
                me.lightOptions.decay = lOptions.decay;
                me.lightOptions.color = lOptions.color;
                me.lightOptions.groundColor = lOptions.groundColor;
                me.lightOptions.castShadow = lOptions.castShadow;
                me.lightOptions.shadowMapSizeW = lOptions.shadowMapSizeW;
                me.lightOptions.shadowMapSizeH = lOptions.shadowMapSizeH;
                me.lightOptions.shadowCameraNear = lOptions.shadowCameraNear;
                me.lightOptions.shadowCameraFar = lOptions.shadowCameraFar;
                me.lightOptions.shadowCameraLeft = lOptions.shadowCameraLeft;
                me.lightOptions.shadowCameraRight = lOptions.shadowCameraRight;
                me.lightOptions.shadowCameraTop = lOptions.shadowCameraTop;
                me.lightOptions.shadowCameraBottom = lOptions.shadowCameraBottom;
                me.lightOptions.shadowBias = lOptions.shadowBias;
                me.lightOptions.shadowFocus = lOptions.shadowFocus;

                // 조작되는 그림자 영역은 width, height 단위로 처리.
                me.shadowCameraSize.width = me.lightOptions.shadowCameraRight * 2;
                me.shadowCameraSize.height = me.lightOptions.shadowCameraTop * 2;

                setTimeout(function () {
                    me.lockEvent = false;
                }, StaticVariable.INPUT_CONTROL_LOCK_TIME);
            },
            setLightOptions: function () {
                const me = this;

                if (!me.lockEvent) {
                    const assetItem = me.editor.selectedItem;

                    if (assetItem) {
                        const option = new LightOptions(me.lightOptions);

                        option.angle = Utils.d2r(option.angle);

                        // 그림자 영역.
                        const cameraX = me.shadowCameraSize.width / 2;
                        const cameraY = me.shadowCameraSize.height / 2;

                        option.shadowCameraLeft = -cameraX;
                        option.shadowCameraRight = cameraX;
                        option.shadowCameraTop = cameraY;
                        option.shadowCameraBottom = -cameraY;

                        assetItem.setLightOptions(option);

                        me.$emit('control', 'lightOptions');
                    }
                }
            },
            setScale: function () {
                const me = this;

                if (!me.lockEvent) {
                    const assetItem = me.editor.selectedItem;

                    if (assetItem) {
                        let x = me.scaleX;
                        let y = me.scaleY;
                        let z = me.scaleZ;

                        x = assetItem.zeroScale.x * (x / 100);
                        y = assetItem.zeroScale.y * (y / 100);
                        z = assetItem.zeroScale.z * (z / 100);

                        me.editor.setScale(x, y, z);

                        me.$emit('control', 'scale');
                    }
                }
            },
            setPosition: function (x, y, z) {
                const me = this;

                if (!me.lockEvent) {
                    const assetItem = me.editor.selectedItem;

                    if (assetItem) {
                        const x = me.positionX;
                        const y = me.positionY;
                        const z = me.positionZ;

                        me.editor.setPosition(x, y, z);

                        me.$emit('control', 'position');
                    }
                }
            },
            setRotation: function (x, y, z) {
                const me = this;

                if (!me.lockEvent) {
                    const assetItem = me.editor.selectedItem;

                    if (assetItem) {
                        const x = me.rotationX;
                        const y = me.rotationY;
                        const z = me.rotationZ;

                        me.editor.setRotation(Utils.d2r(x), Utils.d2r(y), Utils.d2r(z));

                        me.$emit('control', 'rotation');
                    }
                }
            },
            onClickUndo: function () {
                const me = this;

                me.editor.undo();
                me.$emit('control', 'undo');
            },
            onClickRedo: function () {
                const me = this;

                me.editor.redo();
                me.$emit('control', 'redo');
            },
            onClickMode: function (mode) {
                const me = this;

                me.editor.modeChange(mode);
                me.$emit('control', mode);
            },
            onClickAllScaleUp: function () {
                const me = this;

                me.editor.multiplyScaleAll(1.1, 1.1, 1.1);
                me.$emit('control', 'scaleUp');
            },
            onClickAllScaleDown: function () {
                const me = this;

                me.editor.multiplyScaleAll(0.9, 0.9, 0.9);
                me.$emit('control', 'scaleDown');
            },
            onClickCopy: function () {
                const me = this;

                let assetItem = me.editor.selectedItem;

                if (assetItem) {
                    assetItem = assetItem.clone();
                    assetItem.position.z += 1;

                    me.editor.detach();

                    me.editor.import(assetItem).then(function (item) {
                        me.editor.attach(item);
                        me.$emit('control', 'copy');
                    });
                }
            },
            onClickReload: function () {
                const me = this;

                const prevItem = me.editor.selectedItem;

                if (confirm('모델 기본 설정을 불러옵니다.') && prevItem) {
                    Utils.apiRequest(ApiUrl.MODEL_FILE_URL_DATA, {url: prevItem.itemUrl}).then(function (data) {
                        if (data.data.length > 0) {
                            const modelFileInfo = new ModelFileInfo(Utils.snakeObjToCamelObj(data.data[0]));
                            const fileSettingData = modelFileInfo.data ? JSON.parse(modelFileInfo.data) : null;

                            if (fileSettingData && fileSettingData.itemArray.length) {
                                const orgAssetItem = new AssetItem(fileSettingData.itemArray[0]);

                                prevItem.syncTransformMembers();

                                const prevScale = prevItem.scale;
                                const prevPostion = prevItem.position;
                                const prevRotation = prevItem.rotation;

                                orgAssetItem.scale = prevScale;
                                orgAssetItem.position = prevPostion;
                                orgAssetItem.rotation = prevRotation;

                                me.editor.import(orgAssetItem).then(function (item) {
                                    me.editor.remove();

                                    me.editor.attach(item);

                                    const historyManager = me.editor.historyManager;
                                    const undoHistory = historyManager.getHistory();
                                    const redoHistory = historyManager.getHistory(historyManager.cursor - 1);

                                    undoHistory.onUndo = function () {
                                        historyManager.undo();
                                    };

                                    redoHistory.onRedo = function () {
                                        historyManager.redo();
                                    };

                                    me.$emit('control', 'reloadMaterial');
                                });

                            } else {
                                alert('파일에 설정값이 없습니다.');
                            }
                        }
                    });
                }
            },
            onClickTextEdit: function () {
                const me = this;

                me.$emit('control', 'textEdit');
            },
            onClickRemove: function () {
                const me = this;

                me.editor.remove();
                me.$emit('control', 'remove');
            },
            onControl: function (type) {
                const me = this;

                me.$emit('control', type);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .control-panel-field {
        width: 100%;
        height: 100%;
        overflow-y: auto;

        .nav-tabs {
            margin-bottom: 0.5rem;

            .nav-item {
                width: 33.33%;

                .nav-link {
                    color: #ffffff;
                    padding: 0.5rem;
                    text-align: center;
                }

                .nav-link.active {
                    color: #000000;
                }
            }
        }

        .item-row {
            width: 100%;
            padding: 0rem 1rem;
            margin-top: 1rem;
        }

        .item-row:first-child {
            margin-top: 0px;
        }

        .edit-btns {
            width: 100%;

            .edit-btn-row {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                .edit-btn {
                    width: 100%;
                    height: 36px;
                    border: 1px solid #5d5d5d;
                    background-color: #5d5d5d;
                    color: #bdbdbd;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid #eaeaea;
                }

                .edit-btn:hover {
                    background-color: #8c8c8c;
                    color: #eaeaea;
                }
            }
        }

        .asset-control-field {
            width: 100%;
            border: 1px solid #8c8c8c;
            border-radius: 0.25rem;
            margin-top: 1rem;
            padding: 1.25rem;
        }

        .asset-material-field {
            width: 100%;
            margin-top: 1rem;
        }

        .control-row {
            width: 100%;
            margin-top: 1rem;

            .control-name {
                width: 100%;
                font-size: 1.2rem;
                color: #ffffff;
                text-align: center;
                overflow:hidden;
                margin-bottom: 1rem;
            }

            .control-label {
                width: 100%;
                font-size: 15px;
                font-weight: 600;
                color: #ffffff;
                overflow:hidden;
            }

            .control-btn {
                width: 100%;
                height: 36px;
                border: 1px solid #5d5d5d;
                background-color: #5d5d5d;
                color: #bdbdbd;
                border-radius: 0.25rem;
            }

            .control-btn:hover {
                background-color: #8c8c8c;
                color: #eaeaea;
            }
        }

        .control-row-flex {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .sub-control-row {
            margin-top: 5px;
        }

        .control-row:first-child {
            margin-top: 0px;
        }
    }
</style>