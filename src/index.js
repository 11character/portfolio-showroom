// jquery
// import로 전역변수 설정이 안되기 떄문에 별도의 파일을 만들어 등록한다.
import './importJquery';

// bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

// vue
import Vue from 'vue/dist/vue.common.prod';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const homePageVue = () => import('./vue/pages/homePage.vue');
const filePageVue = () => import('./vue/pages/filePage.vue');

const router = new VueRouter({
    routes: [
        {path: '/', name: 'home', component: homePageVue},
        {path: '/file', name: 'file', component: filePageVue}
    ]
});

const vue = new Vue({
    router: router,
    el: '#root'
});