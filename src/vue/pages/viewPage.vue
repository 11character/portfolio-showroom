<template>
    <div class="field">
        <loading :hidden="!disabled"></loading>
        
        <div ref="viewField" class="view-field">
            <div class="cross-hair"></div>
        </div>
    </div>
</template>

<script>
    import * as ApiUrl from '../../class/apiUrl';
    import Utils from '../../class/utils';
    import Showroom from '../../class/showroom';

    import loadingVue from '../parts/loading.vue';

    import NemoShowroomViewer from '../../nemoShowroom/nemoShowroomViewer/nemoShowroomViewer';

    export default {
        components: {
            'loading': loadingVue
        },
        props: ['id'],
        data: function () {
            return {
                disabled: true,
                showroomViewer: new NemoShowroomViewer({
                    width: 100,
                    height: 100
                })
            };
        },
        mounted: function () {
            const me = this;

            // 뷰어 객체는 mounted 실행시 초기화 하여 자식 컴포넌트에 넘겨주려고 하면 오류가 발생한다.
            // data 초기화 후에 에디터의 위치를 이동하는 식으로 처리한다.
            me.$refs.viewField.appendChild(me.showroomViewer.rootEl);

            $(window).on('resize.view.page', function () {
                setTimeout(function () {
                    const w = $(window).width();
                    const h = $(window).height();

                    $(me.$refs.viewField).css('width', w + 'px').css('height', h + 'px');

                    me.showroomViewer.resize(w, h);
                }, 100);
            });

            // 뷰어의 위치가 변경되기를 기다렸다가 처리.
            setTimeout(function () {
                $(window).trigger('resize.view.page');

                // 크기가 변경된 이후에 처리.
                setTimeout(function () {
                    me.openData();
                }, 100);
            }, 100);

        },
        beforeDestroy: function () {
            const me = this;

            me.showroomViewer.stop();
            me.showroomViewer = null;

            $(window).off('resize.view.page');
        },
        methods: {
            openData: function () {
                const me = this;

                Utils.apiRequest(ApiUrl.SHOWROOM_DATA, {seqId: me.id}).then(function (data) {
                    if (data.data.length > 0) {
                        me.showroom = new Showroom(Utils.snakeObjToCamelObj(data.data[0]));

                        me.showroomViewer.openJson(me.showroom.data || '[]').then(function () {
                            me.disabled = false;
                        });

                    } else {
                        alert('해당 정보가 없습니다.');
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
.field {
    position: relative;

    .view-field {
        position: absolute;
        left: 0px;
        top: 0px;

        .cross-hair {
            width: 0.5rem;
            height: 0.5rem;
            background-color: #ffffff;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -0.25rem;
            margin-left: -0.25rem;
            border-radius: 50%;
            z-index: 1;
        }
    }

    .wait-field {
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: 0px;
        top: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-user-select: none; /* Safari */
        user-select: none; /* Standard syntax */
        cursor: pointer;
    }
}
</style>