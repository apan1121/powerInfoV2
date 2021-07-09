<template>
    <card-box
        :title="title"
        :download="Object.keys(records).length > 0"
        @download="downloadFile"
        @fullscreen="fullscreen"
    >
        <chart-trend
            v-if="records"
            ref="chartTrend"
            :title="title"
            :tooltip-total="tooltipTotal"
            :tooltip-used-percent="tooltipUsedPercent"
            :icon="icon"
            :records="records"
            :fullscreen-toggle="fullscreenToggle"
            :chart-type="chartType"
            :stacked="stacked"
        ></chart-trend>
    </card-box>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        CardBox: () => import('components/CardBox/main.vue'),
        ChartTrend: () => import('components/ChartTrend/main.vue'),
    },
    filters: {},
    props: {
        title: {
            type: String,
            default: '',
        },
        records: {
            type: Object,
            default: () => {},
        },
        tooltipTotal: {
            type: Boolean,
            default: true,
        },
        tooltipUsedPercent: {
            type: Boolean,
            default: true,
        },
        icon: {
            type: [Boolean, String],
            default: false,
        },
        chartType: {
            type: String,
            default: 'line',
        },
        stacked: {
            type: Boolean,
            default: false,
        },
    },
    data(){
        return {
            fullscreenToggle: false,
        };
    },
    computed: {
        ...mapGetters([
        ]),
    },
    watch: {
    },
    created(){},
    mounted(){
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        init(){
        },
        fullscreen(val){
            this.fullscreenToggle = val;
        },
        downloadFile(){
            this.$refs.chartTrend.downloadFile();
        },
    },
};
</script>
<style lang="scss" scoped>
</style>