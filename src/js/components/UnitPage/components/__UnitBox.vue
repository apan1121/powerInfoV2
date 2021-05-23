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
                    <span class="plant-name"
                        @click="openPlantInfo"
                        v-text="plantFullName"
                    ></span>
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


// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        Pipe: () => import('components/pipe/main.vue'),
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
        ...mapGetters([
            'PageSetting_width',
        ]),
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
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
        }),
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
        openPlantInfo(){
            this.$emit('open-plant', this.plantName);
        },
    },
};
</script>
<style lang="scss" scoped>
</style>