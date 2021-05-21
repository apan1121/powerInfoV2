import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import router from 'router';
import { createStore } from 'lib/store/index';
import { jsVars } from 'lib/common/util';

import app from './app';


import 'jquery';
import 'bootstrap';

const { origin, pathname } = window.location;
const BASE_API_HOST = `${origin}${pathname}`;
jsVars.set('API_CONFIG.API_HOST', BASE_API_HOST);

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