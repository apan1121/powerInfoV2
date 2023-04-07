<template>
    <div class="summary-page">
        <div class="row">
            <div class="col-12 mb-3">
                <chart-trend-box v-if="diffTrend"
                    :title="'日用量比較'"
                    :tooltip-total="false"
                    :tooltip-used-percent="false"
                    :records="diffTrend"
                    :icon="'icon-calendar'"
                ></chart-trend-box>
            </div>
        </div>

        <div class="row">
            <div class="col-12 mb-3">
                <chart-trend-box v-if="maxUsedTrend"
                    :title="'最大用量趨勢'"
                    :tooltip-total="true"
                    :tooltip-used-percent="false"
                    :records="maxUsedTrend"
                    :icon="'icon-amount'"
                    :chart-type="'bar'"
                    :stacked="true"
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
            <div v-if="chooseTypeTotalTrend" :key="'range_total'" class="mb-3" :class="listColClass">
                <chart-trend-box v-if="chooseTypeTotalTrend"
                    :title="'區間總運轉'"
                    :records="chooseTypeTotalTrend"
                    :icon="`icon icon-power`"
                    :row-col="(PageSetting_mode_type === 'pc' && chooseListType === 'box') ? 2: 1"
                    :tooltip-total="false"
                    :tooltip-used-percent="true"
                ></chart-trend-box>
            </div>

            <div v-if="chooseTypeGroupTotalTrend" :key="'range_type_group_total'" class="mb-3" :class="listColClass">
                <chart-trend-box v-if="chooseTypeGroupTotalTrend"
                    :title="'能源類型'"
                    :tooltip-total="true"
                    :tooltip-used-percent="false"
                    :records="chooseTypeGroupTotalTrend"
                    :icon="`icon icon-power`"
                    :chart-type="'bar'"
                    :stacked="true"
                ></chart-trend-box>
            </div>


            <template v-for="(trendInfo, typeIndex) in chooseTypeTrend">
                <div :key="trendInfo.typeKey" class="mb-3" :class="listColClass">
                    <chart-trend-box v-if="diffTrend"
                        :title="lang.type[trendInfo.typeKey]"
                        :records="trendInfo.record"
                        :icon="`icon icon-${trendInfo.typeKey.replace(/\s/ig,'_')}`"
                        :row-col="(PageSetting_mode_type === 'pc' && chooseListType === 'box') ? 2: 1"
                        :tooltip-total="false"
                        :tooltip-used-percent="true"
                    >
                        <template v-slot:footer>
                            <div class="text-right">
                                <strong>平均{{ lang.summaryBox.CapacityFactor }}</strong>
                                : {{ trendInfo.avgCapacityFactor }}
                                <small>%</small>
                            </div>
                        </template>
                    </chart-trend-box>
                </div>
                <template v-if="typeIndex % 6 == 3">
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
import PageMixin from 'lib/common/mixins/PageMixin';

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
    mixins: [PageMixin],
    props: {},
    data(){
        return {
            diffTrend: false,
            powerTypeTrend: false,
            maxUsedTrend: false,
            chooseTypeGroupTotalTrend: false,
            chooseTypeTrend: false,
            chooseTypeTotalTrend: false,

            maxUsedTrendMonth: 6,

            minDateTime: 0,
            maxDateTime: 0,
            chooseRange: [0, 0],

            chooseListType: 'list',
            maxHeight: 100,

            initFlag: true,
        };
    },
    computed: {
        ...mapGetters({
            summaryInfo: `${module_name}/summaryInfo`,
            maxUsedInfo: `${module_name}/maxUsedInfo`,
            openFilterFlag: `${module_name}/openFilterFlag`,
            chooseTypes: 'chooseTypes',
            lang: 'lang',
            PageSetting_mode_type: 'PageSetting_mode_type',
            typeGroupList: 'typeGroupList',
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
            handler(newVal, oldVal){
                if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                    this.$nextTick(() => {
                        this.init();
                        this.calcDiffTrend();
                        this.calPowerTypeTrend();
                    });
                }
            },
        },
        maxUsedInfo: {
            handler(newVal, oldVal){
                if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                    this.$nextTick(() => {
                        this.calcMaxUsedTrend();
                    });
                }
            },
        },
        chooseTypes: {
            immediate: true,
            handler(){
                this.$nextTick(() => {
                    console.log('chooseTypes calPowerTypeTrend');
                    this.calPowerTypeTrend();
                });
            },
        },
        chooseRange: {
            // deep: true,
            handler(){
                this.$nextTick(() => {
                    if (!this.initFlag) {
                        console.log('chooseRange calcDiffTrend');
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
        maxUsedTrend: {
            handler(){
                if (this.maxUsedTrend) {
                    this.setSEO();
                }
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
    },
    mounted(){
        this.setSEO();
        trackJS.gtag('event', 'page_view', {
            page_id: 'SummaryPage',
        });
        trackJS.mixpanel('page_view', {
            page_id: 'SummaryPage',
        });
        this.getSummaryInfo();
        this.getMaxUsedInfo();
    },
    updated(){
    },
    destroyed(){
        this.setSummaryInfo({});
        this.setMaxUsedInfo({});
        this.initFlag = true;
        this.chooseRange = [0, 0];
    },
    methods: {
        ...mapActions({}),
        ...mapMutations({
            openFilterBox: `${module_name}/openFilterBox`,
            setSummaryInfo: `${module_name}/setSummaryInfo`,
            setMaxUsedInfo: `${module_name}/setMaxUsedInfo`,
        }),
        setSEO(){
            const that = this;
            clearTimeout(that.setSEOTimer);
            that.setSEOTimer = setTimeout(() => {
                const today = Object.keys(that.maxUsedInfo).pop();
                let { maxUsed, time, record } = JSON.parse(JSON.stringify(that.maxUsedInfo[today]));
                time = moment(time).format('HH:mm');
                let recordArr = [];
                for (const key in record) {
                    recordArr.push({
                        name: that.lang.type[key],
                        used: record[key],
                    });
                }

                recordArr = recordArr.sort((a, b) => {
                    if (a.used < b.used) {
                        return 1;
                    } else if (a.used === b.used) {
                        return 0;
                    } else {
                        return -1;
                    }
                });

                const top5 = recordArr.splice(0, 5).map((info, index) => {
                    const val = info.used.toLocaleString();
                    return `第${index + 1}名為${info.name}產生 ${val} MW`;
                }).join('，');

                maxUsed = maxUsed.toLocaleString();
                that.setPageSEO({
                    title: '分析摘要',
                    description: `本日 ${today} 在 ${time} 台灣電廠產生了本日最大電量 ${maxUsed} MW，此時段產生的電力前五名分別是${top5}。`,
                });
            }, 200);
        },
        getSummaryInfo(){
            const that = this;

            that.$store.dispatch(`${module_name}/getSummaryInfo`).then(() => {
                popup.close();
            }, () => {
                popup.close();
            });
        },
        getMaxUsedInfo(){
            const that = this;

            that.$store.dispatch(`${module_name}/getMaxUsedInfo`).then(() => {
                popup.close();
            }, () => {
                popup.close();
            });
        },
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

        calcMaxUsedTrend(){
            const that = this;
            that.calcMaxUsedTrendTimer = setTimeout(() => {
                const maxUsedInfo = JSON.parse(JSON.stringify(that.maxUsedInfo));
                const dateTimeLabels = Object.keys(maxUsedInfo);
                const endDate = dateTimeLabels.pop();
                const startDate = moment(endDate).add(that.maxUsedTrendMonth * -1, 'month').format('YYYY-MM-DD');
                const startDateTimeStamp = parseInt(moment(startDate).format('X'));
                const endDateTimeStamp = parseInt(moment(endDate).format('X'));

                const typeKeys = Object.keys(that.lang.type);

                const maxUsedTrend = {};
                for (let timestamp = startDateTimeStamp; timestamp <= endDateTimeStamp; timestamp += 86400) {
                    const targetDate = moment(timestamp * 1000).format('YYYY-MM-DD');
                    if (!!maxUsedInfo[targetDate] && 1) {
                        const { time, record } = maxUsedInfo[targetDate];
                        const formatTime = moment(time).format('MM-DD HH:mm');
                        const formatRecord = {};
                        typeKeys.forEach((typeKey) => {
                            formatRecord[that.lang.type[typeKey]] = record[typeKey] || 0;
                        });
                        maxUsedTrend[formatTime] = formatRecord;
                    }
                }

                that.maxUsedTrend = maxUsedTrend;
            }, 500);
        },

        calcDiffTrend(){
            const that = this;
            console.log('calcDiffTrend');
            const summaryInfoKeys = Object.keys(that.summaryInfo);
            // console.log('summaryInfoKeys', summaryInfoKeys);
            if (summaryInfoKeys.length > 0) {
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
                    const nowTimestamp = moment(moment().format('YYYY-MM-DD HH:mm:00')).format('x') - 600000;
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
                                        if (!!info[typeKey] && 1) {
                                            used += parseFloat(info[typeKey].used);
                                        }
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
                // console.log(mappingShowWeek);
                }, 500);
            }
        },

        calPowerTypeTrend(){
            const that = this;
            console.log('calPowerTypeTrend');

            popup.loading({
                title: '計算中',
            });
            that.chooseTypeTrend = false;
            that.chooseTypeTotalTrend = false;
            that.chooseTypeGroupTotalTrend = false;
            const summaryInfoKeys = Object.keys(that.summaryInfo);
            // console.log('summaryInfoKeys', summaryInfoKeys);
            if (summaryInfoKeys.length > 0) {
                clearTimeout(that.calPowerTypeTrendTimer);
                that.calPowerTypeTrendTimer = setTimeout(() => {
                    const summaryInfo = JSON.parse(JSON.stringify(that.summaryInfo));
                    const chooseTypes = JSON.parse(JSON.stringify(that.chooseTypes));
                    const usedType = JSON.parse(JSON.stringify(that.lang.usedType));
                    const usedTypeKey = Object.keys(usedType);

                    const typeGroup = JSON.parse(JSON.stringify(that.lang.typeGroup));
                    const typeGroupNames = Object.values(typeGroup);
                    const typeGroupList = JSON.parse(JSON.stringify(that.typeGroupList));
                    const typeGroupListMapping = {};
                    for (const typeGroupKey in typeGroupList) {
                        typeGroupList[typeGroupKey].forEach((typeKey) => {
                            typeGroupListMapping[typeKey] = typeGroup[typeGroupKey] || typeGroupKey;
                        });
                    }

                    const chooseTypeTotalTrend = {};
                    const chooseTypeGroupTotalTrend = {};

                    const [startDateTime, endDateTime] = that.chooseRange;

                    const chooseTypeTrend = [];

                    chooseTypes.forEach((typeKey) => {
                        const record = {};
                        const typeGroupName = typeGroupListMapping[typeKey];

                        for (let dateTimestamp = startDateTime; dateTimestamp <= endDateTime; dateTimestamp += 600000) {
                            const dateTime = moment(dateTimestamp).format('YYYY-MM-DD HH:mm');
                            const dayTime = moment(dateTimestamp).format('MM-DD HH:mm');

                            if (!chooseTypeTotalTrend[dayTime]) {
                                chooseTypeTotalTrend[dayTime] = {
                                };
                                for (const tmpTypeKey of usedTypeKey) {
                                    const showName = usedType[tmpTypeKey];
                                    chooseTypeTotalTrend[dayTime][showName] = 0;
                                }
                            }

                            if (!chooseTypeGroupTotalTrend[dayTime]) {
                                chooseTypeGroupTotalTrend[dayTime] = {
                                };
                                for (const typeGroupName of typeGroupNames) {
                                    chooseTypeGroupTotalTrend[dayTime][typeGroupName] = 0;
                                }
                            }

                            const info = {};

                            for (const tmpTypeKey of usedTypeKey) {
                                const showName = usedType[tmpTypeKey];
                                info[showName] = 0;
                            }

                            if (!!summaryInfo[dateTime] && summaryInfo[dateTime][typeKey]) {
                                usedTypeKey.forEach((infoKey) => {
                                    const showName = usedType[infoKey];
                                    info[showName] = parseFloat(summaryInfo[dateTime][typeKey][infoKey]);
                                    chooseTypeTotalTrend[dayTime][showName] += info[showName];
                                });

                                chooseTypeGroupTotalTrend[dayTime][typeGroupName] += parseFloat(summaryInfo[dateTime][typeKey].used);
                            }
                            record[dayTime] = info;
                        }

                        let recordArr = Object.values(record);
                        const {cap: capName, used: usedName} = usedType;
                        recordArr = recordArr.filter((info) => {
                            return info[capName] > 0;
                        }).map((info) => {
                            return info[usedName] / info[capName];
                        });
                        let avgCapacityFactor = 0;
                        if (recordArr.length > 0) {
                            avgCapacityFactor = recordArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / recordArr.length;
                            avgCapacityFactor = parseFloat((avgCapacityFactor * 100).toFixed(2));
                        }
                        chooseTypeTrend.push({ typeKey, record, avgCapacityFactor });
                    });

                    if (!!chooseTypeTotalTrend && 1) {
                        for (const dateTimeKey in chooseTypeTotalTrend) {
                            for (const tmpTypeKey of usedTypeKey) {
                                const showName = usedType[tmpTypeKey];
                                chooseTypeTotalTrend[dateTimeKey][showName] = parseFloat((chooseTypeTotalTrend[dateTimeKey][showName] + 0).toFixed(2));
                            }
                        }
                    }

                    if (!!chooseTypeGroupTotalTrend && 1) {
                        for (const dateTimeKey in chooseTypeGroupTotalTrend) {
                            for (const typeGroupName of typeGroupNames) {
                                chooseTypeGroupTotalTrend[dateTimeKey][typeGroupName] = parseFloat((chooseTypeGroupTotalTrend[dateTimeKey][typeGroupName] + 0).toFixed(2));
                            }
                        }
                    }

                    that.chooseTypeGroupTotalTrend = chooseTypeGroupTotalTrend;
                    that.chooseTypeTotalTrend = chooseTypeTotalTrend;
                    that.chooseTypeTrend = chooseTypeTrend;
                    popup.close();
                }, 1000);
            }
        },
        openFilterBoxAct(val){
            this.openFilterBox(val);
        },
    },
};
</script>
<style lang="scss" scoped>
</style>