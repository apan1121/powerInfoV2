<template>
    <card-box :title="title" @fullscreen="fullscreen">
        <chart-trend
            v-if="records"
            :title="title"
            :tooltip-total="tooltipTotal"
            :tooltip-used-percent="tooltipUsedPercent"
            :icon="icon"
            :records="records"
            :fullscreen-toggle="fullscreenToggle"
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
    },
};
</script>
<style lang="scss" scoped>
</style>