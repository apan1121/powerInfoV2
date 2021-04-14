import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { createStore } from 'lib/store/index';
import app from './app';

import 'jquery';
import 'bootstrap';

const store = createStore([
    'common',
]);

console.log(111);
const Page = new Vue({
    el: '#appBox',
    components: {
    },
    data(){
        return {
            input: 1,
            popstats: false,
        };
    },
    computed: {
        ...mapGetters([
        ]),
    },
    watch: {

    },
    mounted(){
        const that = this;
        that.init();
    },
    methods: {
        init(){
            this.input = 2;
        },
    },
    store,
});