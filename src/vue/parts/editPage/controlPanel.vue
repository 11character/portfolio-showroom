<template>
    <div>
        <div class="edit-btns">
            <div class="edit-row">
                <button @click="onClickUndo" class="edit-btn">
                    <font-awesome-icon :icon="['fas', 'undo-alt']"></font-awesome-icon>&nbsp;Undo
                </button>

                <button @click="onClickRedo" class="edit-btn">
                    <font-awesome-icon :icon="['fas', 'redo-alt']"></font-awesome-icon>&nbsp;Redo
                </button>
            </div>

            <div class="edit-row">
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

        <div v-if="editor.selectedItem != null" class="item-menu">
            <div class="item-row pt-4">
                <div class="h5 m-0 text-white text-center text-truncate">{{ assetItem.name }}</div>
            </div>

            <div class="item-row">
                <div class="item-control">
                    <button @click="onClickCopy" type="button" class="item-control-btn" tabindex="-1">
                        <font-awesome-icon :icon="['fas', 'clone']"></font-awesome-icon>&nbsp;Copy
                    </button>
                </div>
            </div>

            <div v-if="(contentType == 'text')" class="item-row">
                <div class="item-control">
                    <button @click="onClickTextEdit" type="button" class="item-control-btn" tabindex="-1">
                        <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>&nbsp;Edit
                    </button>
                </div>
            </div>

            <template v-if="'html,image,youtube'.indexOf(assetItem.type) >= 0">
                <div v-if="assetItem.isSprite" class="item-row item-display-type-change">
                    <div class="item-control">
                        <button @click="onClickSwitchingSprite" type="button" class="item-control-btn" tabindex="-1">
                            <font-awesome-icon :icon="['fas', 'exchange-alt']"></font-awesome-icon>&nbsp;&nbsp;3D
                        </button>
                    </div>
                </div>

                <div v-else class="item-row item-display-type-change">
                    <div class="item-control">
                        <button @click="onClickSwitchingSprite" type="button" class="item-control-btn" tabindex="-1">
                            <font-awesome-icon :icon="['fas', 'exchange-alt']"></font-awesome-icon>&nbsp;&nbsp;2D
                        </button>
                    </div>
                </div>
            </template>

            <div class="item-row">
                <div class="item-label">Scale ( &percnt; )</div>
                <div class="item-control">
                    <button @click="onScale(-10)" type="button" class="incr-decr-btn decr-btn" tabindex="-1">-</button>
                    <input v-model.number="scalePercent" @change="onScale(0)" type="number" class="item-value" value="100.000">
                    <button @click="onScale(10)" type="button" class="incr-decr-btn incr-btn" tabindex="-1">＋</button>
                </div>
            </div>

            <div class="item-position item-row">
                <div class="item-label">Position</div>

                <div class="item-control">
                    <div class="item-label">X</div>
                    <button @click="onPosition(-1, 0, 0)" type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="x">-</button>
                    <input v-model.number="positionX" @change="onPosition(0, 0, 0)" type="number" class="item-value" value="0.000">
                    <button @click="onPosition(1, 0, 0)" type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="x">＋</button>
                </div>

                <div class="item-control">
                    <div class="item-label">Y</div>
                    <button @click="onPosition(0, -1, 0)" type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="y">-</button>
                    <input v-model.number="positionY" @change="onPosition(0, 0, 0)" type="number" class="item-value" value="0.000">
                    <button @click="onPosition(0, 1, 0)" type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="y">＋</button>
                </div>

                <div class="item-control">
                    <div class=" item-label">Z</div>
                    <button @click="onPosition(0, 0, -1)" type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="z">-</button>
                    <input v-model.number="positionZ" @change="onPosition(0, 0, 0)" type="number" class="item-value" value="0.000">
                    <button @click="onPosition(0, 0, 1)" type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="z">＋</button>
                </div>
            </div>

            <div v-if="!assetItem.isSprite" class="item-rotation item-row">
                <div class="item-label">Rotation ( &deg; )</div>

                <div class="item-control">
                    <div class="item-label">X</div>
                    <button @click="onRotation(-1, 0, 0)" type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="x">-</button>
                    <input v-model.number="rotationX" @change="onRotation(0, 0, 0)" type="number" class="item-value" value="0.000">
                    <button @click="onRotation(1, 0, 0)" type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="x">＋</button>
                </div>

                <div class="item-control">
                    <div class="item-label">Y</div>
                    <button @click="onRotation(0, -1, 0)" type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="y">-</button>
                    <input v-model.number="rotationY" @change="onRotation(0, 0, 0)" type="number" class="item-value" value="0.000">
                    <button @click="onRotation(0, 1, 0)" type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="y">＋</button>
                </div>

                <div class="item-control">
                    <div class=" item-label">Z</div>
                    <button @click="onRotation(0, 0, -1)" type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="z">-</button>
                    <input v-model.number="rotationZ" @change="onRotation(0, 0, 0)" type="number" class="item-value" value="0.000">
                    <button @click="onRotation(0, 0, 1)" type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="z">＋</button>
                </div>
            </div>

            <div v-if="assetItem.isAnimation" class="item-animation-time item-row">
                <div class="item-label">Animation time ( ms )</div>
                <div class="item-control">
                    <input v-model.number="animationEndTime" @change="onChangeAnimationTime" type="number" class="item-value">
                </div>
            </div>

            <div v-if="assetItem.type != 'youtube' && assetItem.type != 'spotLight'" class="item-link item-row">
                <div class="item-label">Link</div>
                <div class="item-control">
                    <input v-model.trim="link" @change="onChangeLink" type="text" class="item-value">
                </div>
            </div>

            <div class="item-row mb-3">
                <div class="item-control">
                    <button @click="onClickRemove" type="button" class="item-control-btn" tabindex="-1">
                        <font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>&nbsp;Remove
                    </button>
                </div>
            </div>

            <div  v-if="assetItem.isStdMtl" class="item-material item-row">
                <div class="item-label">Material</div>

                <div class="item-control">
                    <div class="item-label">Metalness</div>
                    <div class="item-value">{{ metalness }}</div>
                    <slider v-model.number="metalness" @slide="onSlideMtl" :min="0" :max="1" :step="0.1" class="w-75 my-2"></slider>
                </div>

                <div class="item-control">
                    <div class="item-label">Roughness</div>
                    <div class="item-value">{{ roughness }}</div>
                    <slider v-model.number="roughness" @slide="onSlideMtl" :min="0" :max="1" :step="0.1" class="w-75 my-2"></slider>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AssetItem from '../../../nemoShowroom/common/assetItem';
    import Utils from '../../../class/utils';

    import sliderVue from '../slider.vue';

    /**
     * template event : control
     */
    export default {
        props: ['editor'],
        components: {
            'slider': sliderVue
        },
        data: function () {
            const me = this;

            return {
                contentType: '',
                assetItem: new AssetItem(),
                scalePercent: 0,
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                animationEndTime: 0,
                metalness: 0.5,
                roughness: 1,
                link: ''
            };
        },
        mounted: function () {
            const me = this;

            me.editor.options.onSelect = function (assetItem) {
                me.assetItem = assetItem;
                me.setItemData(me.assetItem);
            };

            me.editor.options.onDeselect = function () {
                me.assetItem = new AssetItem();
            };

            me.editor.options.onMove = function () {
                me.setItemData(me.assetItem);
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
                me.metalness = assetItem.standardMaterialSetting.metalness;
                me.roughness = assetItem.standardMaterialSetting.roughness;
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
            onClickTextEdit: function () {
                const me = this;

                me.$emit('control', 'textEdit');
            },
            onClickSwitchingSprite: function () {
                const me = this;

                me.editor.switchingSpriteMode();
                me.$emit('control', 'switchingSprite');
            },
            onChangeAnimationTime: function () {
                const me = this;

                me.editor.setAnimationTime(0, me.animationEndTime || 0, true);

                me.$emit('control', 'animationTime');
            },
            onChangeLink: function () {
                const me = this;

                me.editor.setLink(me.link);

                me.$emit('control', 'link');
            },
            onClickRemove: function () {
                const me = this;

                me.editor.remove();
                me.$emit('control', 'remove');
            },
            onScale: function (gap) {
                const me = this;

                const assetItem = me.editor.selectedItem;

                if (assetItem) {
                    let percent = me.scalePercent || 1;

                    if (gap) {
                        const absGap = Math.abs(gap);

                        percent = (Math.floor(percent / absGap) * absGap) + gap;
                    }

                    if (percent <= 0) {
                        alert('0 이하의 값은 가질 수 없습니다.');

                    } else {
                        const scale = assetItem.zeroScale.x * (percent / 100);

                        me.editor.setScale(scale, scale, scale);

                        me.$emit('control', 'scale');
                    }
                }
            },
            onPosition: function (gapX, gapY, gapZ) {
                const me = this;

                const assetItem = me.editor.selectedItem;

                if (assetItem) {
                    let x = me.positionX || 0;
                    let y = me.positionY || 0;
                    let z = me.positionZ || 0;

                    let absGap;

                    if (gapX) {
                        absGap = Math.abs(gapX);
                        x = (Math.floor(x / absGap) * absGap) + gapX;
                    }

                    if (gapY) {
                        absGap = Math.abs(gapY);
                        y = (Math.floor(y / absGap) * absGap) + gapY;
                    }

                    if (gapZ) {
                        absGap = Math.abs(gapZ);
                        z = (Math.floor(z / absGap) * absGap) + gapZ;
                    }

                    me.editor.setPosition(x, y, z);

                    me.$emit('control', 'position');
                }
            },
            onRotation: function (gapX, gapY, gapZ) {
                const me = this;

                const assetItem = me.editor.selectedItem;

                if (assetItem) {
                    let x = me.rotationX || 0;
                    let y = me.rotationY || 0;
                    let z = me.rotationZ || 0;

                    let absGap;

                    if (gapX) {
                        absGap = Math.abs(gapX);
                        x = (Math.floor(x / absGap) * absGap) + gapX;
                    }

                    if (gapY) {
                        absGap = Math.abs(gapY);
                        y = (Math.floor(y / absGap) * absGap) + gapY;
                    }

                    if (gapZ) {
                        absGap = Math.abs(gapZ);
                        z = (Math.floor(z / absGap) * absGap) + gapZ;
                    }

                    me.editor.setRotation(Utils.d2r(x), Utils.d2r(y), Utils.d2r(z));

                    me.$emit('control', 'rotation');
                }
            },
            onSlideMtl: function () {
                const me = this;

                const assetItem = me.editor.selectedItem;

                if (assetItem) {
                    assetItem.setStdMtlOptions({
                        metalness: me.metalness,
                        roughness: me.roughness
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    /* edit btn ==================================================================================================== */
    .edit-btns {
        width: 100%;

        .edit-row {
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
    /* END-edit btn ==================================================================================================== */

    /* item menu ==================================================================================================== */
    .item-menu {
        width: 100%;

        .item-row {
            padding: 10px 15px;
        }

        .item-label {
            font-size: 15px;
            font-weight: 600;
            font-style: normal;
            font-stretch: normal;
            line-height: normal;
            letter-spacing: 0.2px;
            text-align: left;
            color: #ffffff;
        }

        .item-control {
            display:flex;
            justify-content: center;
            align-items: center;
            padding-top: 5px;
        }

        .incr-decr-btn {
            width: 28px;
            height: 28px;
            border-radius: 2px;
            border: 1px solid #5d5d5d;
            background-color: #5d5d5d;
            color: #ffffff;
            font-weight: bold;
        }

        .incr-decr-btn:hover {
            background-color: #8c8c8c;
        }

        .item-value {
            width: 120px;
            height: 28px;
            border-radius: 2px;
            background-color: #f6f6f6;
            border: solid 1px #e9e9e9;
            text-align: right;
            font-size: 14px;
        }

        .item-control-btn {
            width: 174px;
            height: 36px;
            border: 1px solid #5d5d5d;
            background-color: #5d5d5d;
            color: #bdbdbd;
            border-radius: 3px;
        }

        .item-control-btn:hover {
            background-color: #8c8c8c;
            color: #eaeaea;
        }

        .item-position {
            .item-control {
                .item-label {
                    width: 10px;
                    margin-right: 10px;
                }

                .item-value {
                    width: 80px;
                }
            }
        }

        .item-rotation {
            .item-control {
                .item-label {
                    width: 10px;
                    margin-right: 10px;
                }

                .item-value {
                    width: 80px;
                }
            }
        }

        .item-link {
            .item-control {
                .item-value {
                    width: 176px;
                    text-align: center;
                }
            }
        }

        .item-material {
            .item-control {
                flex-wrap: wrap;

                .item-label {
                    width: 90px;
                    margin-right: 10px;
                }

                .item-value {
                    width: 50px;
                    background-color: #5d5d5d;
                    border: solid 1px #5d5d5d;
                    color: #bdbdbd;
                    text-align: center;
                }
            }
        }

        .item-animation-time {
            .item-control {
                .item-value {
                    width: 176px;
                    text-align: center;
                }
            }
        }
    }
    /* END-item menu ==================================================================================================== */
</style>