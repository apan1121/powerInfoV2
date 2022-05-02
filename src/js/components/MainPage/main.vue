<template>
    <div class="tw-power-info-page">
        <header>
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div class="container">
                    <router-link class="navbar-brand" :to="{ name: 'UnitPage'}">
                        台灣電廠即時資訊
                    </router-link>
                    <ul class="navbar-nav">
                        <template v-for="navInfo in navList">
                            <li :key="navInfo.route_name" class="nav-item" :class="{ active: route.name == navInfo.route_name}">
                                <router-link class="nav-link" :to="{ name: navInfo.route_name }">
                                    <i :class="navInfo.icon"></i>
                                    <span>{{ navInfo.title }}</span>
                                </router-link>
                            </li>
                        </template>
                    </ul>
                </div>
            </nav>
        </header>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { detectAnyAdblocker } from 'just-detect-adblock';


const pc_min_size = 567;
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {},
    filters: {},
    props: {},
    data(){
        return {};
    },
    computed: {
        ...mapGetters([
            'AlarmRecord',
        ]),
        route(){
            return this.$route;
        },
        navList(){
            const that = this;
            const navList = [];
            navList.push({
                route_name: 'UnitPage',
                icon: 'icon icon-electricity-pole',
                title: '機組資訊',
            });

            navList.push({
                route_name: 'SummaryPage',
                icon: 'icon icon-chart',
                title: '分析摘要',
            });

            if (that.AlarmRecord.length > 0) {
                const r_t = moment(that.AlarmRecord[0].time).format('X');
                const now_t = moment().format('X');
                let icon = 'icon icon-alarm';
                if ((now_t - r_t) < 86400) {
                    icon = 'icon icon-alarm-notice';
                }
                navList.push({
                    route_name: 'AlarmPage',
                    icon,
                    title: '電力警報',
                });
            }

            navList.push({
                route_name: 'AboutPage',
                icon: 'icon icon-about',
                title: '關於',
            });

            return navList;
        },
    },
    watch: {
    },
    created(){},
    mounted(){
        this.init();
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
            SetPageSetting: 'SetPageSetting',
            CheckAdBlock: 'CheckAdBlock',
        }),
        init(){
            const that = this;
            that.getAlarmRecord();

            $(window).bind('resize', () => {
                clearTimeout(that.windowResizeTimer);
                that.windowResizeTimer = setTimeout(() => {
                    let mode_type = 'pc';
                    const width = $('body').width();
                    if (width < pc_min_size) {
                        mode_type = 'mobile';
                    }
                    that.SetPageSetting({ mode_type, width });
                }, 100);
            }).trigger('resize');

            /* 偵測 adblocker */
            detectAnyAdblocker().then((detected) => {
                that.CheckAdBlock(detected);
            });
        },
        getAlarmRecord(){
            const that = this;
            that.$store.dispatch('loadAlarmRecord').then(() => {
            }, () => {
            });
        },
    },
};
</script>
<style lang="scss" scoped>
</style>