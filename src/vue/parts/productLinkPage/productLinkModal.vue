<template>
    <alert-modal @confirm="onConfirm" ref="alertModal">
        <template v-slot:content>
            <div class="row mt-3">
                <div class="col-12 h3 text-truncate">
                    <span>{{ productKey.productName }}</span>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-12">
                    <div class="form-control form-control-sm text-center">{{ productKey.endDate }} 까지</div>
                </div>
            </div>

            <div class="row mt-3">
                <div class="col-10 pr-0">
                    <input :value="productKey.downloadLink" type="text" ref="linkUrl" class="form-control form-control-sm" readonly>
                </div>

                <div class="col-2 pl-1">
                    <button @click="onClickClipboard()" type="button" class="w-100 btn btn-sm btn-outline-primary">
                        <font-awesome-icon :icon="['fas', 'copy']"></font-awesome-icon>
                    </button>
                </div>
            </div>

            <div v-if="productKey.description" class="row mt-3">
                <div class="col-12">
                    <div class="border rounded text-break">{{ productKey.description }}</div>
                </div>
            </div>
        </template>
    </alert-modal>
</template>

<script>
    import alertModalVue from '../alertModal.vue';

    /**
     * template event : confirm
     */
    export default {
        props: ['productKey'],
        components: {
            'alert-modal': alertModalVue,
        },
        methods: {
            open: function () {
                const me = this;

                me.$refs.alertModal.open();
            },
            close: function () {
                const me = this;

                me.$refs.alertModal.close();
            },
            onConfirm: function (bool) {
                const me = this;

                me.$emit('confirm', bool);
            },
            onClickClipboard: function () {
                const me = this;

                const el = me.$refs.linkUrl;
                el.select();
                document.execCommand('copy');
            }
        }
    }
</script>