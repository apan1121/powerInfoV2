<template>
    <div>
        <div v-if="chooseTab === 'basicInfo'" :key="chooseTab" class="plant-base-content">
            <div class="plant-photo mb-2"
                :style="{
                    'background-size': 'cover',
                    'background-position': 'center center',
                    'background-repeat': 'no-repeat',
                    'background-image': `url(${photo})`,
                }"
            >
            </div>

            <div class="row table-base-info">
                <div class="col-12 col-md-6 item">
                    <div class="row">
                        <div class="col-4 key">
                            全名
                        </div>
                        <div class="col-8 value">
                            {{ fullName }}
                            <template v-if="url">
                                <small>
                                    <a :href="url" target="_blank" title="wiki">
                                        <i class="fab fa-wikipedia-w"></i>
                                    </a>
                                </small>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 item">
                    <div class="row">
                        <div class="col-4 key">
                            別稱
                        </div>
                        <div class="col-8 value">
                            {{ name }}
                            <template v-if="nickName">
                                <small>({{ nickName }})</small>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 item">
                    <div class="row">
                        <div class="col-4 key">
                            所在縣市
                        </div>
                        <div class="col-8 value">
                            {{ location }}
                            <small>
                                <a :href="`https://www.google.com/maps/?q=${geo.lat},${geo.lng}`" target="_blank">
                                    <i class="fas fa-map-marker-alt"></i>
                                </a>
                            </small>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 item">
                    <div class="row">
                        <div class="col-4 key">
                            所屬單位
                        </div>
                        <div class="col-8 value">
                            {{ org }}
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 item">
                    <div class="row">
                        <div class="col-4 key">
                            機組數量
                        </div>
                        <div class="col-8 value">
                            {{ amount }}
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 item">
                    <div class="row">
                        <div class="col-4 key">
                            總發電量
                        </div>
                        <div class="col-8 value">
                            {{ capacity | formatMoney }} <small>MW</small>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 item">
                    <div class="row">
                        <div class="col-4 key">
                            狀態
                        </div>
                        <div class="col-8 value">
                            {{ lang.status[status] }}
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 item">
                    <div class="row">
                        <div class="col-4 key">
                            發電總類
                        </div>
                        <div class="col-8 value">
                            <template v-for=" (_type_, __type_index__) in type">
                                <span :key="__type_index__" class="power-type" v-text="lang.type[_type_]"></span>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="col-12 item">
                    <div class="row">
                        <div class="col-4 col-md-2 key">
                            備註
                        </div>
                        <div class="col-8 col-md-10 value">
                            {{ note }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="chooseTab === 'UnitsInfo'" :key="chooseTab" class="plant-units-content">
            <div class="unit-group-info">
                發電量(已/可)：
                {{ TotalUsed | formatMoney }} <small>MW</small>
                /
                {{ TotalCapacity | formatMoney }} <small>MW</small>
                <span class="label" :class="usedPercentColor">
                    {{ usedPercent }}
                    <small>%</small>
                </span>
            </div>
            <div class="unit-group-info">
                <div v-if="UnitFixed > 0" class="unit-group-label" rel="fix">
                    待修機組： {{ UnitFixed | formatMoney }} <small>MW</small>
                </div>
                <div v-if="UnitBreak > 0" class="unit-group-label" rel="break">
                    故障機組： {{ UnitBreak | formatMoney }} <small>MW</small>
                </div>
                <div v-if="UnitLimit > 0" class="unit-group-label" rel="limit">
                    限轉機組： {{ UnitLimit | formatMoney }} <small>MW</small>
                </div>
            </div>

            <div v-if="units.length > 0" class="row">
                <template v-for="(UnitInfo, UnitInfoIndex) in units">
                    <div :key="`plant-unit-${fullName}-${UnitInfoIndex}`" class="col-6 text-center">
                        <unit-box
                            :unit-key="UnitInfo.key"
                            :name="UnitInfo.name"
                            :org-type="UnitInfo.orgType"
                            :org-status="UnitInfo.orgStatus"
                            :plant-name="UnitInfo.plantName"
                            :plant-full-name="UnitInfo.plantFullName"
                            :used="UnitInfo.used"
                            :capacity="UnitInfo.capacity"
                            :show-plant-full-name="false"
                        ></unit-box>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import PageMixin from 'lib/common/mixins/PageMixin';
import { trackJS } from 'lib/common/util';
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';


export default {
    components: {
        UnitBox: () => import('components/UnitBox/main.vue'),
    },
    filters: {
        formatMoney(val){
            return val.toLocaleString();
        },
    },
    mixins: [PageMixin],
    props: {
        chooseTab: {
            type: String,
            default: 'basicInfo',
        },

        name: {
            type: String,
            default: '',
        },
        url: {
            type: String,
            default: '',
        },
        fullName: {
            type: String,
            default: '',
        },
        nickName: {
            type: String,
            default: '',
        },
        photo: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        geo: {
            type: Object,
            default: () => {},
        },
        org: {
            type: String,
            default: '',
        },
        amount: {
            type: [Number, String],
            default: '',
        },
        capacity: {
            type: [Number, String],
            default: '',
        },
        status: {
            type: String,
            default: '',
        },
        note: {
            type: String,
            default: '',
        },
        type: {
            type: Array,
            default: () => [],
        },
        units: {
            type: Array,
            default: () => [],
        },
    },
    data(){
        return {
            tabs: {
                basicInfo: '基本資料',
                UnitsInfo: '機組資料',
            },

            TotalCapacity: 0,
            TotalUsed: 0,
            UnitFixed: 0,
            UnitLimit: 0,
            UnitBreak: 0,

        };
    },
    computed: {
        ...mapGetters([
            'lang',
            'adBlocked',
        ]),
        usedPercent(){
            let percent = 0;
            if (this.TotalCapacity !== 0) {
                percent = (this.TotalUsed / this.TotalCapacity) * 100;
            }
            percent = percent.toFixed(2);
            return percent;
        },
        usedPercentColor(){
            const percent = this.usedPercent + 0;
            let color = '';
            if (percent > 90) {
                color = 'label-danger';
            } else if (percent > 80) {
                color = 'label-warning';
            } else if (percent === 0) {
                color = 'label-default';
            } else if (percent < 0) {
                color = 'label-info';
            } else {
                color = 'label-success';
            }
            return color;
        },
    },
    watch: {
        name: {
            immediate: true,
            handler(){
            },
        },
        chooseTab: {
            immediate: true,
            handler(){
                $('body').trigger('resizeImg');
            },
        },
        units: {
            immediate: true,
            deep: true,
            handler(){
                this.calc();
            },
        },
    },
    created(){},
    mounted(){
        const that = this;

        setTimeout(() => {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }, 500);
    },
    updated(){},
    destroyed(){
    },
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        calc(){
            const that = this;

            let TotalCapacity = 0;
            let TotalUsed = 0;
            let UnitFixed = 0;
            let UnitLimit = 0;
            let UnitBreak = 0;

            that.units.forEach((UnitInfo) => {
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
            });


            this.TotalUsed = TotalUsed;
            this.TotalCapacity = TotalCapacity;
            this.UnitFixed = UnitFixed;
            this.UnitLimit = UnitLimit;
            this.UnitBreak = UnitBreak;
        },
    },
};
</script>
<style lang="scss" scoped>
</style>