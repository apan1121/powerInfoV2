<template>
    <div class="about-page">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="row mb-4 about-area">
                            <div class="col-12">
                                <h4>關於</h4>
                            </div>
                            <div class="col-12">
                                <ol class="notice-list">
                                    <li>
                                        本服務資料來源 <a href="https://data.nat.gov.tw/en/datasets/8931" target="_blank">台電系統(含外購電力)各機組發電量即時資訊</a>，很感謝台灣電力公司與政府提供此 OpenData 讓我們使用。
                                    </li>
                                    <li>
                                        本服務為每十分鐘紀錄一筆即時電力資訊，電力資訊僅用於展示圖表與學術研究，無任何透過販售電力公開資訊作為營利用途。可能因資料來源異動或伺服器與系統的臨時性的停機，並不保證資料的完整與正確性。
                                    </li>
                                    <li>
                                        本服務已將 <a href="https://data.nat.gov.tw/en/datasets/8931" target="_blank">台電系統(含外購電力)各機組發電量即時資訊</a> 提供的 csv 資訊已轉換成更方便讀取使用的 JSON 結構，如需要詳細內容請參閱 <b>歷史資訊</b>。
                                    </li>
                                    <li>
                                        本服務為新版架構於 2021/06/01 正式運行，2021/06/01 以前資料請參閱 <a href="https://apan1121.github.io/powerInfo" target="_blank">台灣電廠即時機組發電量</a>，服務於每年度結束後會將年度資訊封存於相對應 branch 中，如 2021 年度存於 power_log_2021。
                                    </li>
                                    <li>
                                        本服務為 2021/06/05 正式啟用 Google Adsense，作為彌補伺服器費用的額外收入來源。
                                    </li>
                                    <li>
                                        如服務有異常狀況或其他問題，可 email 至 <a href="mailto:apan1121@gmail.com" target="_blank">apan1121@gmail.com</a>。
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="row mb-4 about-area">
                            <div class="col-12">
                                <h4>歷史資訊</h4>
                            </div>
                            <div class="col-12">
                                <ul class="history-list">
                                    <template v-for="(historyList, historyIndex) in HistoryList">
                                        <li :key="historyIndex">
                                            <a :href="historyList.link" target="_blank">{{ historyList.title }}</a>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                        </div>

                        <div class="row mb-4 about-area">
                            <div class="col-12">
                                <h4>贊助一杯咖啡</h4>
                            </div>
                            <div class="col-12">
                                <a href="https://www.buymeacoffee.com/apan1121" target="_blank" @click="donateAct">
                                    <div class="donate-image">
                                        <img :src="'./dist/img/buymeacoffee.jpeg'">
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="row mb-4 about-area">
                            <div class="col-12">
                                <h4>作者資訊</h4>
                            </div>
                            <template v-for="(AuthorInfo, AuthorIndex) in AuthorList">
                                <div :key="AuthorIndex" class="col-12">
                                    <a :href="AuthorInfo.link" target="_blank">
                                        <div class="author-card">
                                            <div class="avater">
                                                <img :src="AuthorInfo.photo">
                                            </div>
                                            <div class="author-info">
                                                <div class="author-title">
                                                    <span class="name">{{ AuthorInfo.name }}</span> /
                                                    <span class="title">{{ AuthorInfo.title }}</span>
                                                </div>
                                                <div class="author-desc">
                                                    {{ AuthorInfo.desc }}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    <!-- <div class="card author-card">
                                        <div class="card-body">
                                            <a :href="AuthorInfo.link" target="_blank">
                                                <div class="author">
                                                    <div class="avater">
                                                        <img :src="AuthorInfo.photo">
                                                    </div>
                                                    <div class="author-title">
                                                        <span class="name">{{ AuthorInfo.name }}</span> /
                                                        <span class="title">{{ AuthorInfo.title }}</span>
                                                    </div>
                                                    <p class="author-desc">
                                                        {{ AuthorInfo.desc }}
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                    </div> -->
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="row mb-4 about-area">
                            <div class="col-12">
                                <h4>相關網站</h4>
                            </div>
                            <template v-for="(SoftLinkInfo, SoftLinkIndex) in SoftLinkList">
                                <div :key="SoftLinkIndex" class="col-12">
                                    <a :href="SoftLinkInfo.link" target="_blank">
                                        <div class="soft-link">
                                            <div class="soft-link-img">
                                                <img :src="SoftLinkInfo.photo" :alt="SoftLinkInfo.title">
                                            </div>
                                            <div class="soft-link-title" v-html="SoftLinkInfo.title"></div>
                                        </div>
                                    </a>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { linkRegister, trackJS } from 'lib/common/util';
import PageMixin from 'lib/common/mixins/PageMixin';

linkRegister.register([
    {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/dist/css/page/about-page.css',
    },
]);


// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {},
    filters: {},
    mixins: [PageMixin],
    props: {},
    data(){
        return {
            AuthorList: [
                {
                    name: 'Byron',
                    photo: 'https://avatars2.githubusercontent.com/u/4945153?v=3&amp;s=460',
                    title: '網頁工程師',
                    link: 'https://github.com/apan1121',
                    desc: '網站作者，主要處理前端與後端的程式撰寫。',
                },
            ],
            SoftLinkList: [
                {
                    title: '台灣電廠即時機組發電量V1',
                    photo: 'https://apan1121.github.io/powerInfo/img/logo144x144.png',
                    link: 'https://apan1121.github.io/powerInfo/',
                },
                {
                    title: '<i class="fab fa-facebook"></i> 台灣電廠即時機組資訊',
                    photo: 'https://apan1121.github.io/powerInfo/img/logo144x144.png',
                    link: 'https://www.facebook.com/PowerInfoTW',
                },
            ],
            HistoryList: [
                {
                    title: '2018 年度資訊',
                    link: 'https://github.com/apan1121/powerInfo/tree/power_log_2018/log/history',
                },
                {
                    title: '2019 年度資訊',
                    link: 'https://github.com/apan1121/powerInfo/tree/power_log_2019/log/history',
                },
                {
                    title: '2020 年度資訊',
                    link: 'https://github.com/apan1121/powerInfo/tree/power_log_2020/log/history',
                },
                {
                    title: '2021 年度資訊 1月 ～ 6 月',
                    link: 'https://github.com/apan1121/powerInfo/tree/gh-pages/log/history',
                },
                {
                    title: '2021 年度資訊 7月 ～ 12 月',
                    link: 'https://github.com/apan1121/powerInfoV2/tree/power_log_2021/log/history',
                },
                {
                    title: '2022 年度資訊',
                    link: 'https://github.com/apan1121/powerInfoV2/tree/power_log_2022/log/history',
                },
            ],
        };
    },
    computed: {
        ...mapGetters([
        ]),
    },
    watch: {
    },
    created(){},
    mounted(){
        this.setSEO();

        trackJS.gtag('event', 'page_view', {
            page_id: 'AboutPage',
        });
        trackJS.mixpanel('page_view', {
            page_id: 'AboutPage',
        });
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        setSEO(){
            const that = this;
            that.setPageSEO({
                title: '關於',
                description: `在這裡您可以知道本站的開發理念與資料來源，您還在找台灣發電的歷史資訊嗎？這邊有最詳盡各個機組的發電紀錄，希望能幫助到你的研究需要`,
            });
        },
        donateAct(){
            trackJS.gtag('event', 'donate_click', {
            });
            trackJS.mixpanel('donate_click', {
            });
        },
    },
};
</script>
<style lang="scss" scoped>
</style>