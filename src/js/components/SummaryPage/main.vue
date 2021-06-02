<template>
    <div class="summary-page">
        <div class="row">
            <div class="col-12">
                <chart-trend-box v-if="diffTrend"
                    :title="'日用量比較'"
                    :tooltip-total="false"
                    :records="diffTrend"
                    :normal-height="PageSetting_mode_type === 'mobile' ? 130 : 60"
                    :icon="'icon-calendar'"
                ></chart-trend-box>
            </div>
        </div>


        <summary-filter
            :choose-range.sync="chooseRange"
            :choose-list-type.sync="chooseListType"
            :min-date-time="minDateTime"
            :max-date-time="maxDateTime"
        ></summary-filter>

        <div class="row">
            <template v-for="(trendInfo, typeIndex) in chooseTypeTrend">
                <div :key="trendInfo.typeKey" class="mb-3" :class="listColClass">
                    <chart-trend-box v-if="diffTrend"
                        :title="lang.type[trendInfo.typeKey]"
                        :records="trendInfo.record"
                        :normal-height="normalHeight"
                        :fullscreen-height="maxHeight"
                        :icon="`icon icon-${trendInfo.typeKey.replace(' ','_')}`"
                    ></chart-trend-box>
                </div>
                <template v-if="typeIndex % 6 == 5">
                    <div :id="`Summary_Ads_${typeIndex}`"
                        :key="`Summary_Ads_${typeIndex}`"
                        class="col-12 mb-3"
                    >
                        <summary-ads-box></summary-ads-box>
                    </div>
                </template>
            </template>
        </div>
        <template v-if="openFilterFlag">
            <unit-filter-box :type="true" :sort="false" @open-filter-box="openFilterBoxAct"></unit-filter-box>
        </template>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import 'vue-range-component/dist/vue-range-slider.css';
import moment from 'moment';


import { popup, linkRegister, trackJS } from 'lib/common/util';
import { module_name, module_store } from './lib/store/index';

import SummaryFilter from './components/SummaryFilter.vue';
import SummaryAdsBox from './components/SummaryAdsBox.vue';

moment.locale('zh-tw');

linkRegister.register([
    {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/dist/css/page/summary-page.css',
    },

]);


export default {
    components: {
        ChartTrendBox: () => import('components/ChartTrendBox/main.vue'),
        UnitFilterBox: () => import('components/UnitFilterBox/main.vue'),
        SummaryFilter,
        SummaryAdsBox,
    },
    filters: {},
    props: {},
    data(){
        return {
            diffTrend: false,
            powerTypeTrend: false,
            chooseTypeTrend: false,

            minDateTime: 0,
            maxDateTime: 0,
            chooseRange: [0, 0],

            chooseListType: 'box',
            maxHeight: 100,

            initFlag: true,
        };
    },
    computed: {
        ...mapGetters({
            summaryInfo: `${module_name}/summaryInfo`,
            openFilterFlag: `${module_name}/openFilterFlag`,
            chooseTypes: 'chooseTypes',
            lang: 'lang',
            PageSetting_mode_type: 'PageSetting_mode_type',
        }),

        normalHeight(){
            let normalHeight = 100;
            if (this.PageSetting_mode_type === 'mobile') {
                normalHeight = 130;
            } else {
                switch (this.chooseListType) {
                    case 'box':
                        normalHeight = 100;
                        break;
                    case 'list':
                        normalHeight = 60;
                        break;
                    default:
                        break;
                }
            }

            return normalHeight;
        },
        listColClass(){
            let listColClass = 'col-12 col-md-6';
            switch (this.chooseListType) {
                case 'box':
                    listColClass = 'col-12 col-md-6';
                    break;
                case 'list':
                    listColClass = 'col-12';
                    break;
                default:
                    break;
            }
            return listColClass;
        },
    },
    watch: {
        summaryInfo: {
            handler(){
                this.$nextTick(() => {
                    this.init();
                    this.calcDiffTrend();
                });
            },
        },
        chooseTypes: {
            handler(){
                this.$nextTick(() => {
                    this.calPowerTypeTrend();
                });
            },
        },
        chooseRange: {
            // deep: true,
            handler(){
                this.$nextTick(() => {
                    if (!this.initFlag) {
                        this.calPowerTypeTrend();
                        trackJS.gtag('event', 'chooseSummaryRange', {
                            range: this.chooseRange,
                        });
                        trackJS.mixpanel('chooseSummaryRange', {
                            range: this.chooseRange,
                        });
                    }
                    this.initFlag = false;
                });
            },
        },
        chooseListType: {
            handler(){
                this.$nextTick(() => {
                    this.calPowerTypeTrend();
                    trackJS.gtag('event', 'chooseListType', {
                        listType: this.chooseListType,
                    });
                    trackJS.mixpanel('chooseListType', {
                        listType: this.chooseListType,
                    });
                });
            },
        },
    },
    beforeCreate(){
        const that = this;
        if (!that.$store.state[module_name]) {
            that.$store.registerModule([module_name], module_store);
        }
    },
    created(){
        const that = this;
        popup.loading({
            title: '讀取中',
        });
        that.$store.dispatch(`${module_name}/getSummaryInfo`).then(() => {
            popup.close();
        }, () => {
            popup.close();
        });
    },
    mounted(){
        trackJS.gtag('event', 'page_view', {
            page_id: 'SummaryPage',
        });
        trackJS.mixpanel('page_view', {
            page_id: 'SummaryPage',
        });
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
            openFilterBox: `${module_name}/openFilterBox`,
        }),
        formatter(value){
            return moment(parseInt(value)).format('YYYY-MM-DD HH:mm:ss');
        },

        init(){
            const that = this;
            const dateTimes = Object.keys(this.summaryInfo);
            const minDateTime = parseInt(moment(dateTimes[0]).format('x'));
            const maxDateTime = parseInt(moment(dateTimes[dateTimes.length - 1]).format('x'));
            const chooseRange = [(maxDateTime - 86400000 * 3), maxDateTime];

            that.minDateTime = minDateTime;
            that.maxDateTime = maxDateTime;
            that.chooseRange = chooseRange;
        },

        calcDiffTrend(){
            const that = this;
            clearTimeout(that.calcDiffTrendTimer);
            that.calcDiffTrendTimer = setTimeout(() => {
                const limitDateNum = 14;
                const today = parseInt(moment(moment().format('YYYY-MM-DD')).format('x'));
                const tomorraw = parseInt(moment(today).add(1, 'days').format('x'));
                const startDate = moment(today).add((limitDateNum * -1 + 1), 'days').format('YYYY-MM-DD');
                const startDateTimestamp = parseInt(moment(startDate).format('x'));

                const mappingShowWeek = {};
                const thisWeekNum = moment().format('ww');

                for (let dateIndex = 0; dateIndex < limitDateNum; dateIndex += 1) {
                    const timestamp = startDateTimestamp + (dateIndex) * 86400000;
                    const dateObj = moment(timestamp);
                    const date = dateObj.format('YYYY-MM-DD');
                    let showWeek = dateObj.format('ddd');
                    const weekNum = dateObj.format('ww');
                    for (let i = 0; i < (thisWeekNum - weekNum); i += 1) {
                        showWeek = `上${showWeek}`;
                    }
                    mappingShowWeek[date] = showWeek;
                }

                const diffTrend = {};
                const nowTimestamp = moment(moment().format('YYYY-MM-DD HH:mm:00')).format('x');
                for (let i = today; i < tomorraw; i += 600000) {
                    const hourMinute = moment(i).format('HH:mm');
                    diffTrend[hourMinute] = {};

                    for (let dateIndex = 0; dateIndex < limitDateNum; dateIndex += 1) {
                        const date = moment(startDateTimestamp + dateIndex * 86400000).format('YYYY-MM-DD');
                        let used = false;
                        const dateTime = `${date} ${hourMinute}`;

                        if (moment(`${dateTime}:00`).format('x') < nowTimestamp) {
                            used = 0;
                            if (that.summaryInfo[dateTime]) {
                                const info = JSON.parse(JSON.stringify(that.summaryInfo[`${date} ${hourMinute}`]));

                                for (const typeKey in info) {
                                    used += parseFloat(info[typeKey].used);
                                }
                            }
                        }

                        if (used !== false) {
                            const showWeek = mappingShowWeek[date];
                            diffTrend[hourMinute][showWeek] = Math.round(used * 100) / 100;
                        }
                    }
                }
                that.diffTrend = diffTrend;
                console.log(mappingShowWeek);
            }, 1000);
        },

        calPowerTypeTrend(){
            const that = this;
            clearTimeout(that.calPowerTypeTrendTimer);
            popup.loading({
                title: '計算中',
            });
            that.chooseTypeTrend = false;
            that.calPowerTypeTrendTimer = setTimeout(() => {
                const summaryInfo = JSON.parse(JSON.stringify(that.summaryInfo));
                const chooseTypes = JSON.parse(JSON.stringify(that.chooseTypes));
                const usedType = JSON.parse(JSON.stringify(that.lang.usedType));
                const usedTypeKey = Object.keys(usedType);


                const [startDateTime, endDateTime] = that.chooseRange;

                const chooseTypeTrend = [];

                chooseTypes.forEach((typeKey) => {
                    const record = {};

                    for (let dateTimestamp = startDateTime; dateTimestamp <= endDateTime; dateTimestamp += 600000) {
                        const dateTime = moment(dateTimestamp).format('YYYY-MM-DD HH:mm');
                        const dayTime = moment(dateTimestamp).format('MM-DD HH:mm');

                        const info = {};


                        for (const tmpTypeKey of usedTypeKey) {
                            const showName = usedType[tmpTypeKey];
                            info[showName] = 0;
                        }

                        if (!!summaryInfo[dateTime] && summaryInfo[dateTime][typeKey]) {
                            usedTypeKey.forEach((infoKey) => {
                                const showName = usedType[infoKey];
                                info[showName] = parseFloat(summaryInfo[dateTime][typeKey][infoKey]);
                            });
                        }
                        record[dayTime] = info;
                    }
                    chooseTypeTrend.push({ typeKey, record });
                });

                that.chooseTypeTrend = chooseTypeTrend;
                popup.close();
            }, 1000);
        },
        openFilterBoxAct(val){
            this.openFilterBox(val);
        },
    },
};
</script>
<style lang="scss" scoped>
</style>