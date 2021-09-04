import Vue from 'vue';
import VueRouter from 'vue-router';
import { string } from 'lib/common/util';

Vue.use(VueRouter);

// const UnitTab = () => import('components/UnitTab/main.vue');


const routes = [
//     // 动态路径参数 以冒号开头
    {
        path: '/unit',
        name: 'UnitPage',
        component: () => import('components/UnitPage/main.vue'),
    },
    {
        path: '/unit/:unit_key',
        name: 'UnitInfoPage',
        component: () => import('components/UnitInfoPage/main.vue'),
    },
    {
        path: '/plant/:plant_name',
        name: 'PlantInfoPage',
        component: () => import('components/PlantInfoPage/main.vue'),
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
    {
        path: '*',
        name: 'RouterDetect',
        redirect(a, b){
            const query_string = window.location.search.substr(1);
            const query = string.getJsonFromUrl(query_string);
            let toPath = '/unit';
            if (!!query.path && 1) {
                const tmpPath = `/${query.path}`;
                const matcher = router.matcher.match(tmpPath);
                if (matcher.name !== 'RouterDetect') {
                    toPath = tmpPath;
                }
                const link = document.createElement('a');
                link.href = window.location.href;
                link.search = '';
                link.hash = '';
                window.history.replaceState(null, null, link.href);
            }
            return toPath;
        },
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