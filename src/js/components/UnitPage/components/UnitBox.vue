<template>
    <div class="unit-box" :class="orgStatus">
        <div class="unit-wrapper">
            <div class="unit-progress-group">
                <!-- <div ref="circle-progress" class="circle-progress"></div> -->
                <div ref="circle-progress" class="circle-progress" data-thickness="5">
                </div>
                <div class="percent">
                    {{ percent }}<small>%</small>
                </div>
                <div class="icon" :class="`icon-${orgType.replace(' ','_').replace('-', '_')}`"></div>
            </div>
            <h5 class="unit-name">
                {{ name }}
            </h5>
            <div class="plant-name-area">
                <template v-if="plantFullName">
                    <span class="plant-name" v-text="plantFullName"></span>
                </template>
                <template v-else>
                    --
                </template>
            </div>
            <div class="unit-info">
                {{ AbsUsed | formatMoney }}<small>MW</small> / {{ capacity | formatMoney }}<small>MW</small>
            </div>
        </div>
        <div class="pipe-wrapper">
            <pipe :vertical="true" :direction="'down'" :used="used"></pipe>
            <div class="pipe-port progress-active"></div>
            <div class="pipe-adapter" :class="{ unlink: orgStatus !== 'online' }"></div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import 'jquery-circle-progress';
import IntersectionObserverBox from 'lib/common/mixins/IntersectionObserverBox';

import { module_name } from '../lib/store/index';
import Pipe from './pipe.vue';
// import ProgressBar from 'progressbar.js';
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        Pipe,
    },
    filters: {
        formatMoney(val){
            return val.toLocaleString();
        },
    },
    mixins: [IntersectionObserverBox],
    props: {
        unitKey: {
            type: String,
            default: '',
        },
        name: {
            type: String,
            default: '',
        },
        orgType: {
            type: String,
            default: '',
        },
        orgStatus: {
            type: String,
            default: '',
        },
        plantName: {
            type: String,
            default: '',
        },
        plantFullName: {
            type: String,
            default: '',
        },
        capacity: {
            type: Number,
            default: 0,
        },
        used: {
            type: Number,
            default: 0,
        },
    },
    data(){
        return {
            exposured: false,
        };
    },
    computed: {
        ...mapGetters({
            MappingPlantList: `${module_name}/MappingPlantList`,
        }),
        ...mapGetters([
            'PageSetting_width',
        ]),
        PlantInfo(){
            let PlantInfo = false;
            if (!!this.MappingPlantList[this.plantName] && 1) {
                PlantInfo = this.MappingPlantList[this.plantName];
            }
            return PlantInfo;
        },
        percent(){
            let percent = 0;
            if (this.capacity !== 0) {
                percent = (this.used / this.capacity) * 100;
            } else {
                if (this.used < 0) {
                    percent = 100;
                }
            }
            percent = percent.toFixed(2);
            return percent;
        },
        AbsUsed(){
            return Math.abs(this.used);
        },
    },
    watch: {
        PageSetting_width(){
            this.reDraw(500);
        },
        exposured(){
            this.reDraw(1);
        },
    },
    created(){},
    mounted(){
        // const bar = new ProgressBar.Circle(this.$refs['circle-progress'], {
        //     strokeWidth: 6,
        //     easing: 'easeInOut',
        //     duration: 2000,
        //     color: '#FFEA82',
        //     trailColor: '#eee',
        //     trailWidth: 1,
        //     svgStyle: null,
        //     from: { width: 1 },
        //     to: { width: 4 },
        //     value: (value) => {
        //         console.log(value);
        //     },
        // });

        // bar.animate(1.0); // Number from 0.0 to 1.0
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        exposureAct(){
            this.exposured = true;
        },
        reDraw(delay){
            const that = this;
            clearTimeout(that.reDrawTimer);
            if (that.exposured) {
                that.reDrawTimer = setTimeout(() => {
                    let value = this.percent;
                    let color = "#dedede";
                    if (!isNaN(value)) {
                        if (value > 90) {
                            color = '#e74c3c';
                        } else if (value <= 90 && value > 80) {
                            color = '#e67e22';
                        } else if (value < 80 && value >= 60) {
                            color = '#f1c40f';
                        } else if (value < 60 && value >= 40) {
                            color = '#2ecc71';
                        } else if (value < 40 && value >= 10) {
                            color = '#1abc9c';
                        } else if (value < 10) {
                            color = '#3498db';
                        }
                        value /= 100;
                    } else {
                        value = 0;
                    }


                    $(that.$refs['circle-progress']).circleProgress({
                        value,
                        size: $(that.$refs['circle-progress']).width(),
                        fill: {
                            color: [color],
                        },
                        startAngle: -190,
                        thickness: 'auto',
                    });
                }, delay);
            }
        },
    },
};
</script>
<style lang="scss" scoped>
</style>