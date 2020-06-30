<template>
    <div>
        <div class="edit-btns">
            <div class="edit-row">
                <button class="edit-btn">
                    <font-awesome-icon :icon="['fas', 'undo-alt']"></font-awesome-icon>&nbsp;Undo
                </button>

                <button class="edit-btn">
                    <font-awesome-icon :icon="['fas', 'redo-alt']"></font-awesome-icon>&nbsp;Redo
                </button>
            </div>

            <div class="edit-row mt-2">
                <button class="edit-btn">
                    <font-awesome-icon :icon="['fas', 'arrows-alt']"></font-awesome-icon>
                </button>

                <button class="edit-btn">
                    <font-awesome-icon :icon="['fas', 'sync-alt']"></font-awesome-icon>
                </button>

                <button class="edit-btn">
                    <font-awesome-icon :icon="['fas', 'expand']"></font-awesome-icon>
                </button>

                <button class="edit-btn">
                    <font-awesome-icon :icon="['fas', 'compress']"></font-awesome-icon>
                </button>
            </div>
        </div>

        <div class="item-menu">
            <div class="item-row pt-4">
                <div class="h5 m-0 text-white text-center text-truncate">123</div>
            </div>

            <div class="item-row">
                <div class="item-control">
                    <button type="button" class="item-control-btn" tabindex="-1">
                        <font-awesome-icon :icon="['fas', 'clone']"></font-awesome-icon>&nbsp;Copy
                    </button>
                </div>
            </div>

            <div class="item-row">
                <div class="item-control">
                    <button type="button" class="item-control-btn" tabindex="-1">
                        <font-awesome-icon :icon="['fas', 'edit']"></font-awesome-icon>&nbsp;Edit
                    </button>
                </div>
            </div>

            <div class="item-row item-display-type-change">
                <div class="item-control">
                    <button type="button" class="item-control-btn" tabindex="-1">
                        <font-awesome-icon :icon="['fas', 'exchange-alt']"></font-awesome-icon>&nbsp;&nbsp;Normal
                    </button>
                </div>
            </div>

            <div class="item-row item-display-type-change">
                <div class="item-control">
                    <button type="button" class="item-control-btn" tabindex="-1">
                        <font-awesome-icon :icon="['fas', 'exchange-alt']"></font-awesome-icon>&nbsp;&nbsp;Sprite
                    </button>
                </div>
            </div>

            <div class="item-row">
                <div class="item-label">Scale ( &percnt; )</div>
                <div class="item-control">
                    <button type="button" class="incr-decr-btn decr-btn" tabindex="-1">-</button>
                    <input type="number" class="item-value item-scale-value" value="100.000">
                    <button type="button" class="incr-decr-btn incr-btn" tabindex="-1">＋</button>
                </div>
            </div>

            <div class="item-position item-row">
                <div class="item-label">Position</div>

                <div class="item-control">
                    <div class="item-label">X</div>
                    <button type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="x">-</button>
                    <input type="number" class="item-value item-position-x-value" value="0.000">
                    <button type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="x">＋</button>
                </div>

                <div class="item-control">
                    <div class="item-label">Y</div>
                    <button type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="y">-</button>
                    <input type="number" class="item-value item-position-y-value" value="0.000">
                    <button type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="y">＋</button>
                </div>

                <div class="item-control">
                    <div class=" item-label">Z</div>
                    <button type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="z">-</button>
                    <input type="number" class="item-value item-position-z-value" value="0.000">
                    <button type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="z">＋</button>
                </div>
            </div>

            <div class="item-rotation item-row">
                <div class="item-label">Rotation ( &deg; )</div>

                <div class="item-control">
                    <div class="item-label">X</div>
                    <button type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="x">-</button>
                    <input type="number" class="item-value item-rotation-x-value" value="0.000">
                    <button type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="x">＋</button>
                </div>

                <div class="item-control">
                    <div class="item-label">Y</div>
                    <button type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="y">-</button>
                    <input type="number" class="item-value item-rotation-y-value" value="0.000">
                    <button type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="y">＋</button>
                </div>

                <div class="item-control">
                    <div class=" item-label">Z</div>
                    <button type="button" class="incr-decr-btn decr-btn" tabindex="-1" data-name="z">-</button>
                    <input type="number" class="item-value item-rotation-z-value" value="0.000">
                    <button type="button" class="incr-decr-btn incr-btn" tabindex="-1" data-name="z">＋</button>
                </div>
            </div>

            <div class="item-animation-time item-row">
                <div class="item-label">Animation time ( ms )</div>
                <div class="item-control">
                    <input type="number" class="item-value">
                </div>
            </div>

            <div class="item-link item-row">
                <div class="item-label">Link</div>
                <div class="item-control">
                    <input type="text" class="item-value">
                </div>
            </div>

            <div class="item-row mb-3">
                <div class="item-control">
                    <button type="button" class="item-control-btn" tabindex="-1">
                        <font-awesome-icon :icon="['fas', 'trash-alt']"></font-awesome-icon>&nbsp;Remove
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {}
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

    /* asset-text-item ====================================================================================================*/
    .note-editable {
        -webkit-user-select: initial;
        user-select: initial;

        & > * {
            margin-bottom: 0px !important;
        }
    }

    .asset-text-item {
        padding-left: 0.25rem !important;

        padding-right: 0.25rem !important;

        & > * {
            margin-bottom: 0px !important;
        }
    }
    /* END-asset-text-item ====================================================================================================*/
</style>