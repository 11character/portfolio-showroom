// jquery
// import로 전역변수 설정이 안되기 떄문에 별도의 파일을 만들어 등록한다.
import './importJquery';
import 'jquery-ui-bundle/jquery-ui';
import 'jquery-ui-bundle/jquery-ui.css';
import 'jquery-ui-bundle/jquery-ui.theme.css';

// bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

// datatables;
import dtBs4 from 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.css';

import dtButtonBs4 from 'datatables.net-buttons-bs4';
import 'datatables.net-buttons-bs4/css/buttons.bootstrap4.css';

import dtSelectBs4 from 'datatables.net-select-bs4';
import 'datatables.net-select-bs4/css/select.bootstrap4.css';

dtBs4(window, $);
dtButtonBs4(window, $);
dtSelectBs4(window, $);

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
    faMinusSquare

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

Vue.component('font-awesome-icon', FontAwesomeIcon);

// router
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const homePageVue = () => import('./vue/pages/homePage.vue');
const filePageVue = () => import('./vue/pages/filePage.vue');
const editPageVue = () => import('./vue/pages/editPage.vue');
const viewPageVue = () => import('./vue/pages/viewPage.vue');
const assetEditPageVue = () => import('./vue/pages/assetEditPage.vue');
const assetViewPageVue = () => import('./vue/pages/assetViewPage.vue');

const router = new VueRouter({
    routes: [
        {path: '/', name: 'home', component: homePageVue, props: false},
        {path: '/file', name: 'file', component: filePageVue, props: false},
        {path: '/edit/:id', name: 'edit', component: editPageVue, props: true},
        {path: '/view/:id', name: 'view', component: viewPageVue, props: true},
        {path: '/asset-edit/:id', name: 'asset-edit', component: assetEditPageVue, props: true},
        {path: '/asset-view/:id', name: 'asset-view', component: assetViewPageVue, props: true}
    ]
});

const vue = new Vue({
    router: router,
    el: '#root'
});