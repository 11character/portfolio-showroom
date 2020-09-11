// jquery
// import로 전역변수 설정이 안되기 떄문에 별도의 파일을 만들어 등록한다.
import './importJquery';
import 'jquery-ui-bundle/jquery-ui';
import 'jquery-ui-bundle/jquery-ui.css';
import 'jquery-ui-bundle/jquery-ui.theme.css';

// bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

// vue
import Vue from 'vue/dist/vue.common.prod';

// icon
import { library as FaLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faSyncAlt,
    faEdit,
    faTrashAlt,
    faClone,
    faExchangeAlt,
    faUndoAlt,
    faRedoAlt,
    faArrowsAlt,
    faExpand,
    faCompress,
    faEye,
    faPlusSquare,
    faMinusSquare,
    faArrowUp,
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faPaintBrush,
    faLink
} from '@fortawesome/free-solid-svg-icons';

FaLibrary.add(faSyncAlt);
FaLibrary.add(faEdit);
FaLibrary.add(faTrashAlt);
FaLibrary.add(faClone);
FaLibrary.add(faExchangeAlt);
FaLibrary.add(faUndoAlt);
FaLibrary.add(faRedoAlt);
FaLibrary.add(faArrowsAlt);
FaLibrary.add(faExpand);
FaLibrary.add(faCompress);
FaLibrary.add(faEye);
FaLibrary.add(faPlusSquare);
FaLibrary.add(faMinusSquare);
FaLibrary.add(faArrowUp);
FaLibrary.add(faArrowDown);
FaLibrary.add(faArrowLeft);
FaLibrary.add(faArrowRight);
FaLibrary.add(faPaintBrush);
FaLibrary.add(faLink);

Vue.component('font-awesome-icon', FontAwesomeIcon);

// router
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const viewPageVue = () => import('./vue/pages/viewPage.vue');
const assetViewPageVue = () => import('./vue/pages/assetViewPage.vue');

const router = new VueRouter({
    routes: [
        {path: '/view/:id', name: 'view', component: viewPageVue, props: true},
        {path: '/asset-view/:id', name: 'asset-view', component: assetViewPageVue, props: true}
    ]
});

const vue = new Vue({
    router: router,
    el: '#root'
});