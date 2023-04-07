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
        <template v-if="hasFooter" v-slot:footer>
            <slot name="footer"></slot>
        </template>
    </card-box>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import PageMixin from 'lib/common/mixins/PageMixin';
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
    mixins: [PageMixin],
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
            'adBlocked',
        ]),
        hasFooter(){
            return Object.keys(this.$slots).includes('footer');
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
    mounted(){
    },
    updated(){},
    destroyed(){
    },
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