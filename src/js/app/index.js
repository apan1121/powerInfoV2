import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import app from './app';
import router from 'router';

import { createStore } from 'lib/store/index';
import { jsVars } from 'lib/common/util';

import 'jquery';
import 'bootstrap';

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