import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// const UnitTab = () => import('components/UnitTab/main.vue');


const routes = [
//     // 动态路径参数 以冒号开头
    {
        path: '/',
        name: 'UnitPage',
        component: () => import('components/UnitPage/main.vue'),
    },
    {
        path: '/summary',
        name: 'SummaryPage',
        component: () => import('components/SummaryPage/main.vue'),
    },
    {
        path: '/about',
        name: 'AboutPage',
        component: () => import('components/AboutPage/main.vue'),
    },
];

const router = new VueRouter({
    linkActiveClass: '',
    linkExactActiveClass: 'is-active',
    // mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition){
        if (savedPosition) {
            switch (to.name) {
                default:
                    return savedPosition;
                    // break;
            }
        }

        return {
            x: 0,
            y: 0,
        };
    },
});


export default router;