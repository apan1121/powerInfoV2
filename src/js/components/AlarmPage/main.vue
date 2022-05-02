<template>
    <div class="alarm-page">
        <div class="alert alert-success" role="alert">
            <span class="label-beta">BETA</span>
            本功能目前為 Beta 版，當系統十分鐘的電力減少超過 {{ Math.abs(DIFF_TOTAL_USED_LIMIT) }} MW，會即時紀錄當時狀況並嘗試列出可能的問題。
            在 Beta 版期間的警報資訊為低門檻觸發事件，請勿恐慌。
        </div>

        <div class="row">
            <template v-for="(AlarmInfo, AlarmInfoIndex) in AlarmRecord">
                <div :key="AlarmInfo.time" class="col-12 mb-3">
                    <alarm-record-box v-bind="AlarmInfo"></alarm-record-box>
                </div>

                <template v-if="AlarmInfoIndex % 3 === 2">
                    <div :key="`${AlarmInfo.time}_${AlarmInfoIndex}`" class="col-12 mb-3">
                        <box-ads-box></box-ads-box>
                    </div>
                </template>
            </template>
        </div>

        <template v-if="chooseUnitKey">
            <unit-info-box :unit-key="chooseUnitKey" @close="closeUnitInfo"></unit-info-box>
        </template>

    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

import { popup, string, linkRegister, trackJS } from 'lib/common/util';

import PageMixin from 'lib/common/mixins/PageMixin';
import BoxAdsBox from './components/BoxAdsBox.vue';

linkRegister.register([
    {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/dist/css/page/alarm-page.css',
    },

]);


// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        AlarmRecordBox: () => import('components/AlarmRecordBox/main.vue'),
        UnitInfoBox: () => import('components/UnitInfoBox/main.vue'),
        BoxAdsBox,
    },
    filters: {},
    mixins: [PageMixin],
    props: {},
    data(){
        return {};
    },
    computed: {
        ...mapGetters([
            'lang',
            'AlarmRecord',
            'chooseUnitKey',
        ]),
        DIFF_TOTAL_USED_LIMIT(){
            const that = this;
            let DIFF_TOTAL_USED_LIMIT = 0;
            if (that.AlarmRecord.length > 0) {
                DIFF_TOTAL_USED_LIMIT = that.AlarmRecord[0].DIFF_TOTAL_USED_LIMIT;
            }
            return DIFF_TOTAL_USED_LIMIT;
        },
    },
    watch: {
        AlarmRecord: {
            deep: true,
            handler(){
                this.setSEO();
            },
        },
    },
    created(){},
    mounted(){
        trackJS.gtag('event', 'page_view', {
            page_id: 'AlarmPage',
        });
        trackJS.mixpanel('page_view', {
            page_id: 'AlarmPage',
        });
        this.setSEO();
        this.loadPlantInfo();
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
            chooseUnitByKey: 'chooseUnitByKey',
        }),
        formatMoney(val){
            return val.toLocaleString();
        },
        setSEO(){
            const that = this;
            clearTimeout(that.setSEOTimer);
            that.setSEOTimer = setTimeout(() => {
                let AlarmRecord = false;
                let description = '';
                if (that.AlarmRecord.length > 0) {
                    AlarmRecord = JSON.parse(JSON.stringify(that.AlarmRecord))[0];
                    let { time, diff_used, reduce_records } = AlarmRecord;
                    diff_used = that.formatMoney(Math.abs(diff_used));
                    description = `${time} 發生電力異常，電網10分鐘內減少 ${diff_used} MW`;

                    const [lastRecord, nowRecord] = Object.values(JSON.parse(JSON.stringify(AlarmRecord.diff_records)));

                    let diffTypes = [];

                    Object.keys(that.lang.type).forEach((typeKey) => {
                        const last = parseFloat(lastRecord[typeKey].used);
                        const now = parseFloat(nowRecord[typeKey].used);
                        const diff = now - last;
                        let diffPercent = 0;
                        if (last !== 0) {
                            diffPercent = parseInt((diff / last) * 10000) / 100;
                        }


                        if (diff < 0) {
                            diffTypes.push({
                                type: typeKey,
                                last,
                                now,
                                diff,
                                percent: diffPercent,
                            });
                        }
                    });

                    diffTypes = diffTypes.sort((a, b) => {
                        if (a.diff > b.diff) {
                            return 1;
                        } else if (a.diff === b.diff) {
                            return 0;
                        } else {
                            return -1;
                        }
                    });

                    diffTypes = diffTypes.map((item) => {
                        let {diff, percent} = item;
                        diff = that.formatMoney(Math.abs(diff));
                        percent = that.formatMoney(Math.abs(percent));
                        return `${that.lang.type[item.type]}減少了 ${diff} MW (${percent}%)`
                    });

                    if (diffTypes.length > 0) {
                        diffTypes = diffTypes.join('、');
                        description = `${description}；${diffTypes}`;
                    }


                    let reduceRecords = [];
                    if (reduce_records.length > 0) {
                        reduce_records.forEach((recordInfo) => {
                            const diff = recordInfo.newVal - recordInfo.oldVal;
                            let diffPercent = 0;
                            if (recordInfo.oldVal !== 0) {
                                diffPercent = parseInt((diff / recordInfo.oldVal) * 10000) / 100;
                            }

                            reduceRecords.push({
                                ...recordInfo,
                                diff,
                                percent: that.formatMoney(Math.abs(diffPercent)),
                            });
                        });

                        reduceRecords = reduceRecords.sort((a, b) => {
                            if (a.diff > b.diff) {
                                return 1;
                            } else if (a.diff === b.diff) {
                                return 0;
                            } else {
                                return -1;
                            }
                        });

                        reduceRecords = reduceRecords.map((item) => {
                            let {diff, percent} = item;
                            diff = that.formatMoney(Math.abs(diff));
                            percent = that.formatMoney(Math.abs(percent));
                            return `${item.name}(${that.lang.type[item.type]}) 減少了 ${diff} MW(${percent}%)`;
                        });

                        reduceRecords = reduceRecords.join('、');
                        description = `${description}；異常機組如下：${reduceRecords}`;
                    }
                }
                description = `${description}。`;

                that.setPageSEO({
                    title: '電力警報',
                    description,
                });
            }, 200);
        },
        loadPlantInfo(){
            const that = this;

            popup.loading({
                title: '讀取中',
            });
            that.$store.dispatch('getPlantInfo').then((response) => {
                that.loadPowerInfo();
            }, () => {
                popup.close();
            });
        },
        loadPowerInfo(){
            const that = this;
            popup.loading({
                title: '讀取中',
            });
            that.$store.dispatch('getRealTimePowerInfo').then((response) => {
                popup.close();
            }, () => {
                popup.close();
            });
        },
        closeUnitInfo(){
            this.chooseUnitByKey('');
        },
    },
};
</script>
<style lang="scss" scoped>
</style>