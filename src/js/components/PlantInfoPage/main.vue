<template>
    <div id="plant-info-box" style="margin: 0 auto; max-width: 500px;">
        <ul class="nav nav-pills mb-3">
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

        <plant-info v-if="plantInfo" v-bind="plantInfo" :choose-tab="chooseTab"></plant-info>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import PageMixin from 'lib/common/mixins/PageMixin';
import { trackJS, popup, linkRegister } from 'lib/common/util';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';


linkRegister.register([
    {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/dist/css/page/unit-page.css',
    },

]);


export default {
    components: {
        PlantInfo: () => import('components/PlantInfo/main.vue'),
    },
    filters: {
    },
    mixins: [PageMixin],
    props: {
    },
    data(){
        return {
            tabs: {
                basicInfo: '基本資料',
                UnitsInfo: '機組資料',
            },
            chooseTab: 'basicInfo',
        };
    },
    computed: {
        ...mapGetters([
            'lang',
            'MappingPlantList',
            'FormatUnits',
        ]),
        plantName(){
            let plant_name = '';
            if (!!this.$route.params && !!this.$route.params.plant_name) {
                plant_name = this.$route.params.plant_name;
            }
            return plant_name;
        },
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
    },
    created(){},
    mounted(){
        const that = this;

        that.chooseTab = 'basicInfo';
        this.init();
    },
    updated(){},
    destroyed(){
    },
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        init(){
            this.loadPlantInfo();
        },
        loadPlantInfo(){
            const that = this;

            popup.loading({
                title: '讀取中',
            });
            that.$store.dispatch('getPlantInfo').then((response) => {
                that.loadPowerInfo();
            }, () => {
                popup.close();
            });
        },
        loadPowerInfo(){
            const that = this;
            popup.loading({
                title: '讀取中',
            });
            that.$store.dispatch('getRealTimePowerInfo').then((response) => {
                popup.close();
            }, () => {
                popup.close();
            });
        },
    },
};
</script>
<style lang="scss" scoped>
</style>