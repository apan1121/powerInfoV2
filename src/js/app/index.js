import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import router from 'router';


import app from './app';

import { createStore } from 'lib/store/index';
import { jsVars } from 'lib/common/util';

import 'jquery';
import 'bootstrap';

// import Ads from 'vue-google-adsense';

// Vue.use(require('vue-script2'));

// Vue.use(Ads.Adsense);
// Vue.use(Ads.InArticleAdsense);
// Vue.use(Ads.InFeedAdsense);




// import UnitTab from '../components/UnitTab/main.vue';

const store = createStore([
    'common',
]);

const Page = new Vue({
    el: '#appBox',
    components: {
        MainPage: () => import('components/MainPage/main.vue'),
        // UnitTab,
    },
    data(){
        return {
            input: 'here',
        };
    },
    computed: {
        ...mapGetters([
        ]),
    },
    watch: {

    },
    mounted(){
    },
    methods: {
        init(){
        },
    },
    store,
    router,
});