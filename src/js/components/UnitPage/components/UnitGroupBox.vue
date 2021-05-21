<template>
    <pipe-group-box
        :direction-top="true"
        :direction-right="false"
        :pipe-top="accTotalUsed"
        :pipe-bottom="lastAccTotalUsed"
        :pipe-right="totalUsed"
    >
        <template v-slot:title>
            {{ groupName }}
        </template>
        <template v-slot:content>
            <div class="unit-group-info">
                發電量(已/可)：
                {{ totalUsed | formatMoney }} <small>MW</small>
                /
                {{ totalCapacity | formatMoney }} <small>MW</small>
                <span class="label" :class="usedPercentColor">{{ usedPercent }}<small>%</small></span>
            </div>

            <div class="unit-group-info">
                <div v-if="totalFixed > 0" class="unit-group-label" rel="fix">
                    待修機組： {{ totalFixed | formatMoney }} <small>MW</small>
                </div>
                <div v-if="totalBreak > 0" class="unit-group-label" rel="break">
                    故障機組： {{ totalBreak | formatMoney }} <small>MW</small>
                </div>
                <div v-if="totalLimit > 0" class="unit-group-label" rel="limit">
                    限轉機組： {{ totalLimit | formatMoney }} <small>MW</small>
                </div>
            </div>

            <div class="row">
                <template v-for="(UnitInfo, UnitInfoIndex) in units">
                    <div :key="`${groupName}-${UnitInfoIndex}`" class="col-6 col-md-4 col-lg-3 col-xl-2 text-center">
                        <unit-box
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
                </template>
            </div>
        </template>
    </pipe-group-box>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import PipeGroupBox from './PipeGroupBox.vue';
import UnitBox from './UnitBox.vue';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        PipeGroupBox,
        UnitBox,
    },
    filters: {
        formatMoney(val){
            return val.toLocaleString();
        },
    },
    props: {
        groupName: {
            type: String,
            default: '未命名',
        },
        totalBreak: {
            type: Number,
            default: 0,
        },
        totalFixed: {
            type: Number,
            default: 0,
        },
        totalLimit: {
            type: Number,
            default: 0,
        },
        totalCapacity: {
            type: Number,
            default: 0,
        },
        totalUsed: {
            type: Number,
            default: 0,
        },
        accTotalUsed: {
            type: Number,
            default: 0,
        },
        lastAccTotalUsed: {
            type: [Number, Boolean],
            default: 0,
        },
        units: {
            type: Array,
            default: () => [],
        },
    },
    data(){
        return {};
    },
    computed: {
        ...mapGetters([
        ]),
        usedPercent(){
            let percent = 0;
            if (this.totalCapacity !== 0) {
                percent = (this.totalUsed / this.totalCapacity) * 100;
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
    },
    created(){},
    mounted(){},
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
    },
};
</script>
<style lang="scss" scoped>
</style>