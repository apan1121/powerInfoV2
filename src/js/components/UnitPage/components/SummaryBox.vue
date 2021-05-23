<template>
    <pipe-group-box
        :direction-top="true"
        :direction-right="true"
        :pipe-top="false"
        :pipe-bottom="TotalUsed"
        :pipe-right="TotalUsed"
    >
        <template v-slot:content>
            <div class="summary-box">
                <div class="filter-area">
                    <button type="button"
                        class="btn btn-secondary btn-sm"
                        @click="openFilter"
                    >
                        <i class="fas fa-filter"></i>
                    </button>
                    <span class="filter-info">
                        選取 <b>{{ chooseTypes.length }}</b> 種發電類型，<b>{{ sortGroup.length }}</b> 項排序
                    </span>
                </div>
                <div class="last-updated-time">
                    最後更新時間: {{ RecordTime }}
                </div>
                <div class="row">
                    <div class="col-12 col-md-4">
                        <div class="row">
                            <div class="col-12 col-sm-6 col-md-12">
                                <div class="summary-info-area">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="summary-info-box">
                                                <div class="summary-info-title">
                                                    已發電量
                                                </div>
                                                <div class="summary-info-content">
                                                    {{ TotalUsed | formatMoney }} <small>MW</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="summary-info-box">
                                                <div class="summary-info-title">
                                                    可發電量
                                                </div>
                                                <div class="summary-info-content">
                                                    {{ TotalCapacity | formatMoney }} <small>MW</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="summary-info-box">
                                                <div class="summary-info-title">
                                                    運轉率
                                                </div>
                                                <div class="summary-info-content">
                                                    {{ TotalPercent }} <small>%</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-12">
                                <div class="summary-info-area">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="summary-info-box" rel="fix">
                                                <div class="summary-info-title">
                                                    待修機組
                                                </div>
                                                <div class="summary-info-content">
                                                    {{ UnitFixed | formatMoney }} <small>MW</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="summary-info-box" rel="limit">
                                                <div class="summary-info-title">
                                                    限轉機組
                                                </div>
                                                <div class="summary-info-content">
                                                    {{ UnitLimit | formatMoney }} <small>MW</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="summary-info-box" rel="break">
                                                <div class="summary-info-title">
                                                    故障機組
                                                </div>
                                                <div class="summary-info-content">
                                                    {{ UnitBreak | formatMoney }} <small>MW</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-8">
                        <div class="summary-sunburst-area">
                            <template v-if="SunburstRecord">
                                <summary-sunburst-box :record="SunburstRecord" :show-val="showVal"></summary-sunburst-box>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </pipe-group-box>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { string } from 'lib/common/util';

import PipeGroupBox from './PipeGroupBox.vue';
import SummarySunburstBox from './SummarySunburstBox.vue';

import { module_name } from '../lib/store/index';
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        PipeGroupBox,
        SummarySunburstBox,
    },
    filters: {
        formatMoney(val){
            return val.toLocaleString();
        },
    },
    props: {
    },
    data(){
        return {
            TotalCapacity: 0,
            TotalUsed: 0,

            UnitFixed: 0,
            UnitLimit: 0,
            UnitBreak: 0,

            SunburstRecord: false,
        };
    },
    computed: {
        ...mapGetters({
            chooseTypes: 'chooseTypes',
            RecordTime: 'RecordTime',
            FormatUnits: 'FormatUnits',

            sortGroup: 'sortGroup',
            showVal: 'showVal',
        }),
        TotalPercent(){
            let percent = 0;
            if (this.TotalCapacity > 0) {
                percent = (this.TotalUsed / this.TotalCapacity) * 100;
                percent = percent.toFixed(2);
            }
            return percent;
        },
    },
    watch: {
        FormatUnits: {
            handler(){
                this.calc();
            },
        },
        chooseTypes: {
            handler(){
                this.calc();
            },
        },
    },
    created(){},
    mounted(){},
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
            openFilterBox: `${module_name}/openFilterBox`,
        }),
        calc(){
            const that = this;
            clearTimeout(that.calcTimer);
            that.calcTimer = setTimeout(() => {
                let TotalCapacity = 0;
                let TotalUsed = 0;
                let UnitFixed = 0;
                let UnitLimit = 0;
                let UnitBreak = 0;

                const tmpSunburstRecord = {};
                const FormatUnits = JSON.parse(JSON.stringify(that.FormatUnits));
                Object.values(FormatUnits).forEach((UnitInfo) => {
                    if (!that.chooseTypes.includes(UnitInfo.orgType)) {
                        return false;
                    }

                    switch (UnitInfo.orgStatus) {
                        case 'fix':
                            UnitFixed += UnitInfo.capacity;
                            break;
                        case 'break':
                            UnitBreak += UnitInfo.capacity;
                            break;
                        case 'limit':
                            UnitLimit += UnitInfo.capacity;
                            break;
                        case 'online':
                            TotalCapacity += UnitInfo.capacity;
                            TotalUsed += UnitInfo.used;
                            break;
                        default:
                            break;
                    }


                    let SunburstKey = that.sortGroup.map((sortKey) => {
                        return UnitInfo[sortKey];
                    });
                    SunburstKey = SunburstKey.join('-');
                    if (!tmpSunburstRecord[SunburstKey]) {
                        tmpSunburstRecord[SunburstKey] = 0;
                    }
                    tmpSunburstRecord[SunburstKey] += UnitInfo[that.showVal];
                });
                // console.log(tmpSunburstRecord);

                that.TotalCapacity = TotalCapacity;
                that.TotalUsed = TotalUsed;

                that.UnitFixed = UnitFixed;
                that.UnitBreak = UnitBreak;
                that.UnitLimit = UnitLimit;

                const SunburstRecord = [];
                for (const key  in tmpSunburstRecord) {
                    SunburstRecord.push([key, tmpSunburstRecord[key]]);
                }

                that.SunburstRecord = SunburstRecord;
            }, 100);
        },
        openFilter(){
            this.openFilterBox(true);
        },
    },
};
</script>
<style lang="scss" scoped>
</style>