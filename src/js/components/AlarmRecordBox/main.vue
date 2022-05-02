<template>
    <card-box
        :title="`${time} 減少 ${ formatMoney(diff_used * -1) } <small>MW</small>`"
        :class="{
            fullscreen: fullscreenToggle,
        }"
        @fullscreen="fullscreen"
    >
        <vue-perfect-scrollbar class="scroll-area">
            <div class="row mb-4">
                <div class="col-12 mb-2">
                    <h4>發電狀態</h4>
                </div>
                <template v-for="(diffInfo, typeIndex) in diffTypes">
                    <div :key="typeIndex"  class="col-6 col-md-4 col-lg-3 col-xl-2 text-center">
                        <div class="diff-type-box">
                            <div class="diff-type-icon">
                                <div class="icon" :class="`icon-${diffInfo.type.replace(/\s/ig,'_').replace('-', '_')}`"></div>
                            </div>
                            <h5 class="diff-type-title" v-text="lang.type[diffInfo.type]">
                            </h5>
                            <div class="diff-power" :rel="diffInfo.diff > 0 ? 'up': 'down'">
                                <span class="icon" v-text="diffInfo.diff > 0 ? '▲': '▼'"></span>
                                <span class="info">{{ formatMoney(Math.abs(diffInfo.diff)) }}
                                    <small>MW</small>
                                    <small>({{ formatMoney(diffInfo.percent) }} <small>%</small>)</small>
                                </span>
                            </div>
                            <div class="diff-date">
                                <div class="date-item">
                                    <div class="date-title">
                                        {{ diffInfo.nowTime }}
                                    </div>
                                    <div class="date-value">
                                        {{ diffInfo.now }} <small>MW</small>
                                    </div>
                                </div>
                                <div class="date-item">
                                    <div class="date-title">
                                        {{ diffInfo.lastTime }}
                                    </div>
                                    <div class="date-value">
                                        {{ diffInfo.last }} <small>MW</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </template>
            </div>

            <template v-if="fullscreenToggle">
                <div
                    ref="ads"
                    class="power-info-promote"
                    :class="{ 'ad-blocked': adBlocked }"
                >
                    <ins class="adsbygoogle"
                        style="display:block"
                        data-ad-format="fluid"
                        data-ad-layout-key="-fb+5w+4e-db+86"
                        data-ad-client="ca-pub-3068501078221920"
                        data-ad-slot="1897408904"></ins>
                </div>
            </template>

            <div class="row">
                <div class="col-12 mb-2">
                    <h4>可能異常裝置</h4>
                </div>
                <template v-for="(reduceInfo, reduceIndex) in reduceRecords">
                    <div :key="reduceIndex"  class="col-12 col-md-6">
                        <div class="abnormal-box">
                            <span class="name">{{ reduceInfo.name }}({{lang.type[reduceInfo.type]}})</span>
                            降載 <span>{{formatMoney(Math.abs(reduceInfo.diff))}} <small>MW</small></span>
                            約 <span>{{reduceInfo.percent}} <small>%</small></span>
                            <a class="now-unit-info" :href="unitInfoPath(reduceInfo)" @click.stop.prevent="openUnitInfo(reduceInfo)">查看目前狀態</a>
                        </div>
                    </div>
                </template>
            </div>
        </vue-perfect-scrollbar>
    </card-box>
</template>
<script>
import moment from 'moment';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        CardBox: () => import('components/CardBox/main.vue'),
        VuePerfectScrollbar,
    },
    filters: {},
    props: {
        DIFF_TOTAL_USED_LIMIT: {
            type: Number,
            default: 0,
        },
        time: {
            type: String,
            default: '',
        },
        diff_used: {
            type: Number,
            default: 0,
        },
        diff_records: {
            type: Object,
            default: () => {},
        },
        reduce_records: {
            type: Array,
            default: () => [],
        },
    },
    data(){
        return {
            fullscreenToggle: false,
        };
    },
    computed: {
        ...mapGetters({
            lang: 'lang',
            adBlocked: 'adBlocked',
        }),
        reduceRecords(){
            const that = this;
            let reduce_records = [];

            that.reduce_records.forEach((recordInfo) => {
                const diff = recordInfo.newVal - recordInfo.oldVal;
                let diffPercent = 0;
                if (recordInfo.oldVal !== 0) {
                    diffPercent = parseInt((diff / recordInfo.oldVal) * 10000) / 100;
                }

                reduce_records.push({
                    ...recordInfo,
                    diff,
                    percent: that.formatMoney(Math.abs(diffPercent)),
                });
            });


            reduce_records = reduce_records.sort((a, b) => {
                if (a.diff > b.diff) {
                    return 1;
                } else if (a.diff === b.diff) {
                    return 0;
                } else {
                    return -1;
                }
            });

            return reduce_records;
        },

        diffTypes(){
            const that = this;
            const [lastDate, nowDate] = Object.keys(JSON.parse(JSON.stringify(that.diff_records)));
            const [lastRecord, nowRecord] = Object.values(JSON.parse(JSON.stringify(that.diff_records)));

            let diffTypes = [];

            Object.keys(that.lang.type).forEach((typeKey) => {
                const last = parseFloat(lastRecord[typeKey].used);
                const now = parseFloat(nowRecord[typeKey].used);
                const diff = now - last;
                let diffPercent = 0;
                if (last !== 0) {
                    diffPercent = parseInt((diff / last) * 10000) / 100;
                }


                if (diff !== 0) {
                    diffTypes.push({
                        lastTime: moment(lastDate).format('HH:mm'),
                        nowTime: moment(nowDate).format('HH:mm'),
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

            return diffTypes;
        },
    },
    watch: {
        fullscreenToggle(newVal){
            if (newVal) {
                setTimeout(() => {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }, 500);

                $('body').addClass('lock-scroll');
            } else {
                $('body').removeClass('lock-scroll');
            }
        },
    },
    created(){},
    mounted(){},
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
            chooseUnitByKey: 'chooseUnitByKey',
        }),
        openUnitInfo(reduceInfo){
            this.chooseUnitByKey(reduceInfo.unitKey);
        },
        formatMoney(val){
            return val.toLocaleString();
        },
        unitInfoPath(info){
            const a = document.createElement('a');
            a.href = window.location.href;
            a.hash = '';
            a.query = '';
            a.href = a.href + '?path=' + encodeURIComponent(`unit/${info.unitKey}`);
            return a.href;
        },
        fullscreen(){
            this.fullscreenToggle = !this.fullscreenToggle;
        },
    },
};
</script>
<style lang="scss" scoped>
</style>