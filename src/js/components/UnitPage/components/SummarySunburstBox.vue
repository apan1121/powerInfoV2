<template>
    <div class="summary-sunburst-box">
        <div id="sunburst-main">
            <div class="sunburst-breadcrumbs">
                <template v-if="breadcrumbData">
                    <template v-for="(breadcrumb, breadcrumbIndex) in breadcrumbData.breadcrumbs">
                        <span :key="breadcrumbIndex" class="breadcrumb-item" v-text="breadcrumb.name"></span>
                    </template>
                    :
                    <span><small>{{ lang[showVal] }}</small>  {{ formatMoney(breadcrumbData.value) }} <small>MW</small></span>
                    <span>({{ breadcrumbData.percentage }} <small>%</small>)</span>
                </template>
            </div>
            <div id="sunburst-chart">
                <div id="sunburst-description"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

import * as d3 from 'd3';
import Sunburst from '../vendor/d3/d3-sunburst/sunburst';
import '../vendor/d3/d3-sunburst/sunburst.css';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {},
    filters: {},
    props: {
        record: {
            type: Array,
            default: () => [],
        },
        showVal: {
            type: String,
            default: 'used',
        },
    },
    data(){
        return {
            breadcrumbData: false,
            lang: {
                used: '已發',
                capacity: '總容量',
            },
        };
    },
    computed: {
        ...mapGetters([
            'PageSetting_width',
        ]),
    },
    watch: {
        PageSetting_width(){
            this.init();
        },
        record(){
            this.init();
        },
    },
    created(){},
    mounted(){
        this.init();
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        formatMoney(val){
            return val.toLocaleString();
        },
        init(){
            const that = this;
            that.breadcrumbData = false;

            let height = $(this.$el).parents('.summary-sunburst-area').width();
            if (height >= $(this.$el).parents('.summary-sunburst-area').height() && $(this.$el).parents('.summary-sunburst-area').height() !== 0) {
                height = $(this.$el).parents('.summary-sunburst-area').height();
            }

            $(this.$el).find('#sunburst-chart').height(height);

            const sunburst = new Sunburst({
                colors: {
                    home: '#5687d1',
                    product: '#7b615c',
                    search: '#de783b',
                    account: '#6ab975',
                    other: '#a173d1',
                    end: '#bbbbbb',
                },
                breadcrumbs_callback: (breadcrumbs, value, percentage) => {
                    that.breadcrumbData = {
                        breadcrumbs,
                        value,
                        percentage,
                    };
                    // value = that.formatMoney(parseFloat(value.toFixed(2)));
                    // let breadcrumbNotice = breadcrumbs.map((breadcrumb) => {
                    //     return breadcrumb.name;
                    // });

                    // breadcrumbNotice = breadcrumbNotice.join('>');
                    // breadcrumbNotice = `${breadcrumbNotice}: ${value}MW ${percentage}%`;
                    // that.breadcrumbNotice = breadcrumbNotice;

                    // console.log(breadcrumbs, value, percentage);
                    // that.breadcrumbs = breadcrumbs.map((item) => {
                    //     item.color = color(item.color).alpha(0.5).rgbString();
                    //     return item;
                    // });

                    // that.focuseData = {
                    //     value,
                    //     percentage,
                    // };
                    // console.log(breadcrumbs, value, percentage);
                },
            });
            sunburst.setData(that.record);
        },
    },
};
</script>
<style lang="scss" scoped>
</style>