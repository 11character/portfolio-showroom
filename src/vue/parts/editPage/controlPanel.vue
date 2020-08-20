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
            <input-light :editor="editor" label="World light"></input-light>
        </div>

        <template v-if="editor.selectedItem">
            <div class="item-row">
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href=".tab-1">Control</a>
                    </li>

                    <li v-if="is3dModel" class="nav-item">
                        <a class="nav-link" data-toggle="tab" href=".tab-2">Material</a>
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

                            <div v-if="!assetItem.isLight && !assetItem.isStartPoint" class="control-row">
                                <input-checkbox v-model="enableOutline" label="Focus"></input-checkbox>
                            </div>

                            <div v-if="(contentType == 'text')" class="control-row">
                                <button @click="onClickTextEdit" type="button" class="control-btn" tabindex="-1">
                                    <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>&nbsp;Edit
                                </button>
                            </div>

                            <template v-if="'html,image,youtube'.indexOf(assetItem.type) >= 0">
                                <div v-if="assetItem.isSprite" class="control-row">
                                    <button @click="onClickSwitchingSprite" type="button" class="control-btn" tabindex="-1">
                                        <font-awesome-icon :icon="['fas', 'exchange-alt']"></font-awesome-icon>&nbsp;&nbsp;3D
                                    </button>
                                </div>

                                <div v-else class="control-row">
                                    <button @click="onClickSwitchingSprite" type="button" class="control-btn" tabindex="-1">
                                        <font-awesome-icon :icon="['fas', 'exchange-alt']"></font-awesome-icon>&nbsp;&nbsp;2D
                                    </button>
                                </div>
                            </template>

                            <div v-if="!assetItem.isStartPoint" class="control-row">
                                <input-number v-model.number="scalePercent" :step="0.1" label="Scale ( % )"></input-number>
                            </div>

                            <div class="control-row">
                                <input-number v-model.number="positionX" :step="0.5" class="sub-control-row" subLabel="X" label="Position"></input-number>
                                <input-number v-model.number="positionY" :step="0.5" class="sub-control-row" subLabel="Y"></input-number>
                                <input-number v-model.number="positionZ" :step="0.5" class="sub-control-row" subLabel="Z"></input-number>
                            </div>

                            <div v-if="!assetItem.isSprite && !assetItem.isStartPoint" class="control-row">
                                <input-number v-model.number="rotationX" :step="1" class="sub-control-row" subLabel="X" label="Rotation ( ° )"></input-number>
                                <input-number v-model.number="rotationY" :step="1" class="sub-control-row" subLabel="Y"></input-number>
                                <input-number v-model.number="rotationZ" :step="1" class="sub-control-row" subLabel="Z"></input-number>
                            </div>

                            <div v-if="assetItem.isStartPoint" class="control-row">
                                <input-number v-model.number="rotationY" :step="1" class="sub-control-row" subLabel="Y" label="Rotation ( ° )"></input-number>
                            </div>

                            <div v-if="assetItem.isAnimation" class="control-row">
                                <input-number v-model.number="animationEndTime" :step="1000" label="Animation time ( ms )"></input-number>
                            </div>

                            <div v-if="assetItem.type != 'youtube' && !assetItem.isLight && !assetItem.isStartPoint" class="control-row">
                                <input-text v-model.trim="link" label="Link"></input-text>
                            </div>

                            <div v-if="assetItem.isLight" class="control-row">
                                <input-slider v-model.number="lightIntensity" :min="0" :max="2" :step="0.1" :label="'Light intensity'"></input-slider>
                            </div>

                            <div class="control-row">
                                <button @click="onClickRemove" type="button" class="control-btn" tabindex="-1">
                                    <font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>&nbsp;Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="tab-2 tab-pane fade">
                        <div class="asset-material-field">
                            <mesh-panel :asset-item="assetItem" @control="onControlMesh"></mesh-panel>
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
    import ModelFileInfo from '../../../class/modelFileInfo';
    import Utils from '../../../class/utils';
    import * as ApiUrl from '../../../class/apiUrl';

    import meshPanelVue from '../assetEditPage/meshPanel.vue';
    import inputLightVue from '../inputItem/inputLight.vue';
    import inputNumberVue from '../inputItem/inputNumber.vue';
    import inputTextVue from '../inputItem/inputText.vue';
    import inputSliderVue from '../inputItem/inputSlider.vue';
    import inputCheckboxVue from '../inputItem/inputCheckbox.vue';

    /**
     * template event : control
     */
    export default {
        components: {
            'mesh-panel': meshPanelVue,
            'input-light': inputLightVue,
            'input-number': inputNumberVue,
            'input-text': inputTextVue,
            'input-slider': inputSliderVue,
            'input-checkbox': inputCheckboxVue
        },
        props: ['editor'],
        data: function () {
            const me = this;

            return {
                StaticVariable: StaticVariable,
                is3dModel: false,
                contentType: '',
                assetItem: new AssetItem(),
                light: me.editor.light,
                scalePercent: 0,
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                animationEndTime: 0,
                lightIntensity: 1,
                link: '',
                enableOutline: true
            };
        },
        watch: {
            scalePercent: function (percent) {
                const me = this;

                this.scale(percent);
            },
            positionX: function (x) {
                const me = this;

                me.position(x, 0, 0);
            },
            positionY: function (y) {
                const me = this;

                me.position(0, y, 0);
            },
            positionZ: function (z) {
                const me = this;

                me.position(0, 0, z);
            },
            rotationX: function (x) {
                const me = this;

                me.rotation(x, 0, 0);
            },
            rotationY: function (y) {
                const me = this;

                me.rotation(0, y, 0);
            },
            rotationZ: function (z) {
                const me = this;

                me.rotation(0, 0, z);
            },
            animationEndTime: function (ms) {
                const me = this;

                me.editor.setAnimationTime(0, ms, true);

                me.$emit('control', 'animationTime');
            },
            link: function (str) {
                const me = this;

                me.editor.setLink(str);

                me.$emit('control', 'link');
            },
            lightIntensity: function (intensity) {
                const me = this;

                const assetItem = me.editor.selectedItem;

                if (assetItem) {
                    assetItem.setLightOption({
                        intensity: me.lightIntensity
                    });
                }
            },
            enableOutline: function (bool) {
                const me = this;

                const assetItem = me.editor.selectedItem;

                if (assetItem) {
                    assetItem.enableOutline = bool;
                }

                me.$emit('control', 'enableOutline');
            }
        },
        mounted: function () {
            const me = this;

            //==========
            const evt1 = me.editor.options.onSelect;

            me.editor.options.onSelect = function (assetItem, editor) {
                evt1(assetItem, editor);

                // 대상 선택시 수치가 갱신되는 과정에서 대상의 이동 이벤트가 처리되기 때문에 작업 기록을 막는다.
                me.editor.historyManager.lock();

                me.is3dModel = StaticVariable.ITEM_3D_TYPES.indexOf(assetItem.type) > -1;
                me.assetItem = assetItem;

                me.setItemData(me.assetItem);

                // 대상의 이벤트가 끝나기를 기다린다.
                setTimeout(function () {
                    me.editor.historyManager.unlock();
                }, 250);
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

                me.contentType = assetItem.type;

                if (me.contentType == 'html') {
                    me.contentType = $(assetItem.content).data('type') || 'html';
                }

                me.scalePercent = parseFloat((assetItem.scale.x / assetItem.zeroScale.x * 100).toFixed(3));
                me.positionX = parseFloat(assetItem.position.x.toFixed(3));
                me.positionY = parseFloat(assetItem.position.y.toFixed(3));
                me.positionZ = parseFloat(assetItem.position.z.toFixed(3));
                me.rotationX = parseFloat(Utils.r2d(assetItem.rotation.x).toFixed(3));
                me.rotationY = parseFloat(Utils.r2d(assetItem.rotation.y).toFixed(3));
                me.rotationZ = parseFloat(Utils.r2d(assetItem.rotation.z).toFixed(3));
                me.animationEndTime = assetItem.animationEndTime;
                me.link = assetItem.link;
                me.enableOutline = assetItem.enableOutline;
                me.lightIntensity = assetItem.lightOption.intensity;
            },
            scale: function (percent) {
                const me = this;

                const assetItem = me.editor.selectedItem;

                if (assetItem) {
                    if (percent <= 0) {
                        alert('0 이하의 값은 가질 수 없습니다.');

                        me.scalePercent = 0.1;

                    } else {
                        const scale = assetItem.zeroScale.x * (percent / 100);

                        me.editor.setScale(scale, scale, scale);

                        me.$emit('control', 'scale');
                    }
                }
            },
            position: function (x, y, z) {
                const me = this;

                const assetItem = me.editor.selectedItem;

                if (assetItem) {
                    x = x || me.positionX;
                    y = y || me.positionY;
                    z = z || me.positionZ;

                    me.editor.setPosition(x, y, z);

                    me.$emit('control', 'position');
                }
            },
            rotation: function (x, y, z) {
                const me = this;

                const assetItem = me.editor.selectedItem;

                if (assetItem) {
                    x = x || me.rotationX;
                    y = y || me.rotationY;
                    z = z || me.rotationZ;

                    me.editor.setRotation(Utils.d2r(x), Utils.d2r(y), Utils.d2r(z));

                    me.$emit('control', 'rotation');
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

                if (prevItem) {
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
            onClickSwitchingSprite: function () {
                const me = this;

                me.editor.switchingSpriteMode();
                me.$emit('control', 'switchingSprite');
            },
            onClickRemove: function () {
                const me = this;

                me.editor.remove();
                me.$emit('control', 'remove');
            },
            onControlMesh: function (type) {
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

            .nav-link {
                color: #ffffff;
            }

            .nav-link.active {
                color: #000000;
            }
        }

        .item-row {
            width: 100%;
            padding: 0px 1rem;
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

        .sub-control-row {
            margin-top: 5px;
        }

        .control-row:first-child {
            margin-top: 0px;
        }
    }
</style>