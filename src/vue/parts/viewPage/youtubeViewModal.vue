<template>
    <div class="youtube-view-modal-field modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="video-field">
                        <iframe :src="src" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>

                <div class="modal-footer">
                    <button :disabled="disabled" @click="onClickClose" type="button" class="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * template event : hidden
     */
    export default {
        props: ['id'],
        data: function () {
            return {
                src: 'about:blank'
            };
        },
        mounted: function () {
            const me = this;

            $(me.$el).on('hidden.bs.modal', function () {
                me.src = 'about:blank';

                me.$emit('hidden');
            });
        },
        methods: {
            open: function (id) {
                const me = this;

                if (id) {
                    me.src = 'https://www.youtube.com/embed/' + id;
                }

                $(me.$el).modal('show');
            },
            close: function () {
                const me = this;

                me.src = 'about:blank';

                $(me.$el).modal('hide');
            },
            onClickClose: function () {
                const me = this;

                me.close();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .youtube-view-modal-field {
        .video-field {
            width: 100%;
            position: relative;
            padding-bottom: 56.25%;

            iframe {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0px;
                left: 0px;
            }
        }
    }
</style>