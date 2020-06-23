// jquery
// import로 전역변수 설정이 안되기 떄문에 별도의 파일을 만들어 등록한다.
import './importJquery';

// bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

// datatables;
import dt from 'datatables.net';
import dtBs4 from 'datatables.net-bs4';
import dtButton from 'datatables.net-buttons';
import dtButtonBs4 from 'datatables.net-buttons-bs4';
import dtSelect from 'datatables.net-select';
import dtSelectBs4 from 'datatables.net-select-bs4';

dt(window, $);
dtBs4(window, $);
dtButton(window, $);
dtButtonBs4(window, $);
dtSelect(window, $);
dtSelectBs4(window, $)

// vue
import Vue from 'vue/dist/vue.common.prod';

// icon
import { library as FaLibrary } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSyncAlt, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

FaLibrary.add(faTrashAlt);
FaLibrary.add(faSyncAlt);
FaLibrary.add(faEdit);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// router
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const homePageVue = () => import('./vue/pages/homePage.vue');
const filePageVue = () => import('./vue/pages/filePage.vue');
const editPageVue = () => import('./vue/pages/editPage.vue');

const router = new VueRouter({
    routes: [
        {path: '/', name: 'home', component: homePageVue, props: false},
        {path: '/file', name: 'file', component: filePageVue, props: false},
        {path: '/edit/:id', name: 'edit', component: editPageVue, props: true}
    ]
});

const vue = new Vue({
    router: router,
    el: '#root'
});