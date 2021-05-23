<template>
    <div id="unit-info-box" class="modal" tabindex="-1"
        role="dialog" aria-labelledby="unitInfoBox" aria-hidden="true"
    >
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        機組資訊
                    </h5>
                    <button type="button" class="close" data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row no-gutters">
                        <div class="col-12 col-md-4">
                            <unit-box
                                v-if="UnitInfo"
                                :unit-key="UnitInfo.key"
                                :name="UnitInfo.name"
                                :org-type="UnitInfo.orgType"
                                :org-status="UnitInfo.orgStatus"
                                :plant-name="UnitInfo.plantName"
                                :plant-full-name="UnitInfo.plantFullName"
                                :used="UnitInfo.used"
                                :capacity="UnitInfo.capacity"
                            ></unit-box>
                        </div>
                        <div class="col-12 col-md-8">
                            <div class="row  table-base-info">
                                <div class="col-12 col-md-6 item">
                                    <div class="row">
                                        <div class="col-4 key">
                                            機組名稱
                                        </div>
                                        <div class="col-8 value">
                                            {{ UnitInfo.name }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 item">
                                    <div class="row">
                                        <div class="col-4 key">
                                            發電類型
                                        </div>
                                        <div class="col-8 value">
                                            {{ UnitInfo.type }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 item">
                                    <div class="row">
                                        <div class="col-4 key">
                                            電廠名稱
                                        </div>
                                        <div class="col-8 value">
                                            {{ UnitInfo.plantFullName }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 item">
                                    <div class="row">
                                        <div class="col-4 key">
                                            電廠狀態
                                        </div>
                                        <div class="col-8 value">
                                            {{ UnitInfo.status }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 item">
                                    <div class="row">
                                        <div class="col-4 key">
                                            已發電
                                        </div>
                                        <div class="col-8 value">
                                            {{ formatMoney(UnitInfo.used) }} <small>MW</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 item">
                                    <div class="row">
                                        <div class="col-4 key">
                                            裝置容量
                                        </div>
                                        <div class="col-8 value">
                                            {{ formatMoney(UnitInfo.capacity) }} <small>MW</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 item">
                                    <div class="row">
                                        <div class="col-4 key">
                                            所在縣市
                                        </div>
                                        <div class="col-8 value">
                                            {{ UnitInfo.location }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 item">
                                    <div class="row">
                                        <div class="col-4 key">
                                            所屬
                                        </div>
                                        <div class="col-8 value">
                                            {{ UnitInfo.gov }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 item">
                                    <div class="row">
                                        <div class="col-4 col-md-2 key">
                                            備註
                                        </div>
                                        <div class="col-8 col-md-10 value">
                                            {{ UnitInfo.note }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <template v-if="formatRecord">
                        <chart-trend :key="`${unitKey}_records`" :records="formatRecord"></chart-trend>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import moment from 'moment';
import { module_name, module_store } from './lib/store/index';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        UnitBox: () => import('components/UnitBox/main.vue'),
        ChartTrend: () => import('components/ChartTrend/main.vue'),
    },
    filters: {},
    props: {
        unitKey: {
            type: String,
            default: '',
        },
    },
    data(){
        return {
            formatRecord: false,
        };
    },
    computed: {
        ...mapGetters({
            record: `${module_name}/record`,
            RecordTime: 'RecordTime',
            FormatUnits: 'FormatUnits',
        }),
        UnitInfo(){
            const that = this;
            const FormatUnits = JSON.parse(JSON.stringify(that.FormatUnits));
            let unitInfo = false;
            if (FormatUnits[that.unitKey]) {
                unitInfo = FormatUnits[that.unitKey];
            }
            return unitInfo;
        },
    },
    watch: {
        unitKey: {
            immediate: true,
            handler(){
                this.getRecord();
            },
        },
        record: {
            handler(newVal, oldVal){
                this.calcformatRecord();
            },
        },
    },
    beforeCreate(){
        const that = this;
        if (!this.$store.state[module_name]) {
            this.$store.registerModule([module_name], module_store);
        }
    },
    created(){},
    mounted(){
        const that = this;
        $('.modal').modal('hide');

        $(this.$el).modal('show');
        $(this.$el).on('hidden.bs.modal', () => {
            that.$emit('close');
        });
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
        }),
        formatMoney(val){
            return val.toLocaleString();
        },
        getRecord(){
            const that = this;
            clearTimeout(that.getRecordTimer);
            that.getRecordTimer = setTimeout(() => {
                const param = {
                    unitKey: that.unitKey,
                };
                that.$store.dispatch(`${module_name}/getUnitRecord`, param).then((response) => {

                }, (response) => {

                });
            }, 200);
        },
        calcformatRecord(){
            const that = this;
            clearTimeout(that.calcformatRecordTimer);
            that.calcformatRecordTimer = setTimeout(() => {
                let start_time = moment(`${that.RecordTime}:00`).add(-1, 'day');
                const YMDH = start_time.format('YYYY-MM-DD HH');

                let mm = start_time.format('mm');
                mm = parseInt(mm / 10) * 10;
                start_time = `${YMDH}:${mm}:00`;
                const start_timestamp = parseInt(moment(`${YMDH}:${mm}:00`).format('X'));
                const end_timestamp = parseInt(moment(`${that.RecordTime}:00`).format('X'));

                const record = {};
                for (let timestamp = start_timestamp; timestamp < end_timestamp; timestamp += 600) {
                    const datTime = moment(timestamp * 1000).format('YYYY-MM-DD HH:mm');
                    const datTimeKey = moment(timestamp * 1000).format('MM-DD HH:mm');
                    const data = {};
                    data[that.UnitInfo.name] = that.record[datTime] || 0;
                    record[datTimeKey] = data;
                }

                that.formatRecord = record;
            }, 100);
        },
    },
};
</script>
<style lang="scss" scoped>
</style>