<template>
    <div class="summary-filter">
        <div class="summary-item" rel="range">
            <vue-range-slider
                v-model="chooseRangeVal"
                :min="minDateTime"
                :max="maxDateTime"
                :formatter="formatter"
                :tooltip-merge="true"
                :enable-cross="false"
                :step="600000"
            ></vue-range-slider>
        </div>
        <div class="summary-item" rel="filter">
            <button type="button" class="btn btn-secondary btn-sm" @click="openFilter">
                <i class="fas fa-filter"></i>
            </button>

            <button type="button" class="btn btn-secondary btn-sm" @click="changeListType">
                <i :class="listTypeOption[chooseListTypeVal]"></i>
            </button>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import moment from 'moment';
import VueRangeSlider from 'vue-range-component';

import { module_name } from '../lib/store/index';
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        VueRangeSlider,
    },
    filters: {},
    props: {
        minDateTime: {
            type: Number,
            default: 0,
        },
        maxDateTime: {
            type: Number,
            default: 0,
        },
        chooseRange: {
            type: Array,
            default: () => [0, 0],
        },
        chooseListType: {
            type: String,
            default: '',
        },
    },
    data(){
        return {
            chooseRangeVal: [0, 0],
            chooseListTypeVal: 'box',


            listTypeOption: {
                list: 'fas fa-list',
                box: 'fas fa-th-large',
            },
        };
    },
    computed: {
        ...mapGetters([
        ]),
    },
    watch: {
        chooseRange: {
            immediate: true,
            handler(){
                if (JSON.stringify(this.chooseRangeVal) !== JSON.stringify(this.chooseRange)) {
                    this.chooseRangeVal = JSON.parse(JSON.stringify(this.chooseRange));
                }
            },
        },
        chooseRangeVal: {
            deep: true,
            handler(){
                const that = this;
                if (JSON.stringify(that.chooseRangeVal) !== JSON.stringify(that.chooseRange)) {
                    clearTimeout(that.chooseRangeValTimer);
                    that.chooseRangeValTimer = setTimeout(() => {
                        const chooseRangeVal = JSON.parse(JSON.stringify(that.chooseRangeVal));
                        that.$emit('update:choose-range', chooseRangeVal);
                    }, 300);
                }
            },
        },
        chooseListType: {
            immediate: true,
            handler(){
                if (this.chooseListType !== this.chooseListTypeVal) {
                    this.chooseListTypeVal = this.chooseListType;
                }
            },
        },
        chooseListTypeVal: {
            immediate: true,
            handler(){
                if (this.chooseListType !== this.chooseListTypeVal) {
                    this.$emit('update:choose-list-type', this.chooseListTypeVal);
                }
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
        formatter(value){
            return moment(parseInt(value)).format('YYYY-MM-DD HH:mm:ss');
        },
        openFilter(){
            this.openFilterBox(true);
        },
        changeListType(){
            const listTypeOption = Object.keys(this.listTypeOption);
            let listTypeIndex = listTypeOption.indexOf(this.chooseListTypeVal);
            listTypeIndex = (listTypeIndex + 1) % listTypeOption.length;
            this.chooseListTypeVal = listTypeOption[listTypeIndex];
        },
    },
};
</script>
<style lang="scss" scoped>
</style>