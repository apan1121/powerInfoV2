import Vue from 'vue';
import $ from 'jquery';
import 'vendor/imgLiquid/imgLiquid';

Vue.config.debug = process.env.NODE_ENV !== 'production';
Vue.config.devtools = process.env.NODE_ENV !== 'production';

/* 全頁偵測 resize Image */
let resizeImageTimer = null;
$('body').on('resizeImg', () => {
    clearTimeout(resizeImageTimer);
    resizeImageTimer = setTimeout(() => {
        $('.imgLiquidFill').imgLiquid();
    }, 50);
});