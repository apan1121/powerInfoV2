<template>
    <div class="tw-power-info-page">
        <header>
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div class="container">
                    <router-link class="navbar-brand" :to="{ name: 'UnitPage'}">
                        台灣電廠即時資訊
                    </router-link>
                    <ul class="navbar-nav">
                        <li class="nav-item" :class="{ active: route.name == 'UnitPage'}">
                            <router-link class="nav-link" :to="{ name: 'UnitPage'}">
                                <i class="icon icon-electricity-pole"></i>
                                <span>機組資訊</span>
                            </router-link>
                        </li>
                        <li class="nav-item" :class="{ active: route.name == 'SummaryPage'}">
                            <router-link class="nav-link" :to="{ name: 'SummaryPage'}">
                                <i class="icon icon-chart"></i>
                                <span>分析摘要</span>
                            </router-link>
                        </li>
                        <li class="nav-item" :class="{ active: route.name == 'AboutPage'}">
                            <router-link class="nav-link" :to="{ name: 'AboutPage'}">
                                <i class="icon icon-about"></i>
                                <span>關於</span>
                            </router-link>
                        </li>
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
        ]),
        route(){
            return this.$route;
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
        }),
        init(){
            const that = this;
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
        },
    },
};
</script>
<style lang="scss" scoped>
</style>