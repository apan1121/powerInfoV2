<template>
    <card-box :title="title" @fullscreen="fullscreen">
        <chart-trend
            v-if="records"
            :title="title"
            :height="chartHeight"
            :tooltip-total="tooltipTotal"
            :icon="icon"
            :records="records"
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
        normalHeight: {
            type: Number,
            default: 60,
        },
        fullscreenHeight: {
            type: Number,
            default: 100,
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
        chartHeight(){
            let height = this.normalHeight;
            if (this.fullscreenToggle) {
                height = this.fullscreenHeight;
            }
            return height;
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
        fullscreen(val){
            this.fullscreenToggle = val;
        },
    },
};
</script>
<style lang="scss" scoped>
</style>