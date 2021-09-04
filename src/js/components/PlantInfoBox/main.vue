<template>
    <div id="plant-info-box" class="modal fade" tabindex="-1"
        role="dialog" aria-labelledby="plantInfoBox" aria-hidden="true"
    >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="exampleModalLabel" class="modal-title">
                        電廠介紹
                        <ul class="nav nav-pills">
                            <template v-for="(val, key) in tabs">
                                <li :key="key" class="nav-item">
                                    <a class="nav-link"
                                        :class="{
                                            active: key === chooseTab,
                                            disabled: (chooseTab === 'UnitsInfo' && Units.length === 0),
                                        }"
                                        href="javascript:;"
                                        @click="chooseTab = key"
                                        v-text="val"
                                    ></a>
                                </li>
                            </template>
                        </ul>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <plant-info v-if="plantInfo" v-bind="plantInfo" :choose-tab="chooseTab"></plant-info>
                </div>
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
        PlantInfo: () => import('components/PlantInfo/main.vue'),
    },
    filters: {
        formatMoney(val){
            return val.toLocaleString();
        },
    },
    mixins: [PageMixin],
    props: {
        plantName: {
            type: String,
            default: '',
        },
    },
    data(){
        return {
            tabs: {
                basicInfo: '基本資料',
                UnitsInfo: '機組資料',
            },
            chooseTab: 'basicInfo',
            UnitsCount: 0,

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
            'MappingPlantList',
            'FormatUnits',
        ]),
        Units(){
            return Object.values(JSON.parse(JSON.stringify(this.FormatUnits)));
        },
        plantInfo(){
            const MappingPlantList = JSON.parse(JSON.stringify(this.MappingPlantList));
            let { Units } = this;
            const { plantName } = this;
            let choosePlantInfo = false;

            if (!!MappingPlantList[plantName] && 1) {
                choosePlantInfo = MappingPlantList[plantName];
                Units = Units.filter((unitInfo) => {
                    return unitInfo.mappingName.includes(choosePlantInfo.nickName);
                });
                choosePlantInfo.units = Units;
            }
            return choosePlantInfo;
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
        plantInfo: {
            immediate: true,
            deep: true,
            handler(newVal){
                const that = this;
                if (!!newVal && 1) {
                    that.setPageTitle(`${that.plantInfo.name}`);
                }
            },
        },
        // units: {
        //     immediate: true,
        //     deep: true,
        //     handler(){
        //         this.calc();
        //     },
        // },
    },
    created(){},
    mounted(){
        const that = this;

        that.chooseTab = 'basicInfo';

        $(that.$el).on('shown.bs.modal', () => {
            trackJS.gtag('event', 'PlantInfoBox_open', {
                name: this.plantInfo.name,
            });
            trackJS.mixpanel('PlantInfoBox_open', {
                name: this.name,
            });
            that.setPageTitle(`${that.name}`);
        });

        $(that.$el).on('hidden.bs.modal', () => {
            if (!!this.$route.query && !!this.$route.query.plant_name) {
                this.$router.push({ name: 'UnitPage' });
            }

            trackJS.gtag('event', 'PlantInfoBox_close', {
                name: this.name,
            });
            trackJS.mixpanel('PlantInfoBox_close', {
                name: this.name,
            });
            that.$emit('close');
            that.undoPageTitle();
        });

        $('.modal').modal('hide');

        $(this.$el).modal('show');

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
        // calc(){
        //     const that = this;

        //     let TotalCapacity = 0;
        //     let TotalUsed = 0;
        //     let UnitFixed = 0;
        //     let UnitLimit = 0;
        //     let UnitBreak = 0;

        //     that.units.forEach((UnitInfo) => {
        //         switch (UnitInfo.orgStatus) {
        //             case 'fix':
        //                 UnitFixed += UnitInfo.capacity;
        //                 break;
        //             case 'break':
        //                 UnitBreak += UnitInfo.capacity;
        //                 break;
        //             case 'limit':
        //                 UnitLimit += UnitInfo.capacity;
        //                 break;
        //             case 'online':
        //                 TotalCapacity += UnitInfo.capacity;
        //                 TotalUsed += UnitInfo.used;
        //                 break;
        //             default:
        //                 break;
        //         }
        //     });


        //     this.TotalUsed = TotalUsed;
        //     this.TotalCapacity = TotalCapacity;
        //     this.UnitFixed = UnitFixed;
        //     this.UnitLimit = UnitLimit;
        //     this.UnitBreak = UnitBreak;
        // },
    },
};
</script>
<style lang="scss" scoped>
</style>