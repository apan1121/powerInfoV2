<template>
    <div class="unit-page">
        <news-ticker class="mb-3"></news-ticker>

        <summary-box></summary-box>

        <template v-for="(UnitGroup, UnitGroupIndex) in FormatUnitGroup">
            <template v-if="UnitGroup.type === 'unit-group'">
                <unit-group-box
                    :key="UnitGroup.group_name"
                    :group-name="UnitGroup.group_name"
                    :total-break="UnitGroup.total_break"
                    :total-fixed="UnitGroup.total_fixed"
                    :total-limit="UnitGroup.total_limit"
                    :total-capacity="UnitGroup.total_capacity"
                    :total-used="UnitGroup.total_used"
                    :acc-total-used="UnitGroup.accTotalUsed"
                    :last-acc-total-used="typeof FormatUnitGroup[UnitGroupIndex + 1] !=='undefined' ? FormatUnitGroup[UnitGroupIndex + 1].accTotalUsed: false"
                    :units="UnitGroup.units"
                >
                </unit-group-box>
            </template>
            <template v-if="UnitGroup.type === 'unit-ads'">
                <unit-group-ads-box
                    :key="`${UnitGroupIndex}_Ads`"
                    :group-name="'廣告'"
                    :total-break="UnitGroup.total_break"
                    :total-fixed="UnitGroup.total_fixed"
                    :total-limit="UnitGroup.total_limit"
                    :total-capacity="UnitGroup.total_capacity"
                    :total-used="UnitGroup.total_used"
                    :acc-total-used="UnitGroup.accTotalUsed"
                    :last-acc-total-used="typeof FormatUnitGroup[UnitGroupIndex + 1] !=='undefined' ? FormatUnitGroup[UnitGroupIndex + 1].accTotalUsed: false"
                ></unit-group-ads-box>
            </template>

            <!-- <template v-if="UnitGroupIndex % 5 === 4">
            </template> -->
        </template>

        <template v-if="choosePlantInfo">
            <plant-info-box v-bind="choosePlantInfo" @close="closePlantInfo"></plant-info-box>
        </template>

        <template v-if="chooseUnitKey">
            <unit-info-box :unit-key="chooseUnitKey" @close="closeUnitInfo"></unit-info-box>
        </template>

        <template v-if="openFilterFlag">
            <unit-filter-box :type="true" :sort="true" @open-filter-box="openFilterBoxAct"></unit-filter-box>
        </template>
    </div>
</template>
<script>
import { popup, string, linkRegister, trackJS } from 'lib/common/util';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import PlantInfoBox from 'components/PlantInfoBox/main.vue';
import UnitInfoBox from 'components/UnitInfoBox/main.vue';


import { module_name, module_store } from './lib/store/index';

import SummaryBox from './components/SummaryBox.vue';
import UnitGroupBox from './components/UnitGroupBox.vue';
import UnitGroupAdsBox from './components/UnitGroupAdsBox.vue';

linkRegister.register([
    {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/dist/css/page/unit-page.css',
    },

]);

export default {
    components: {
        NewsTicker: () => import('components/NewsTicker/main.vue'),
        UnitFilterBox: () => import('components/UnitFilterBox/main.vue'),
        PlantInfoBox,
        SummaryBox,
        UnitGroupBox,
        UnitInfoBox,
        UnitGroupAdsBox,
    },
    filters: {},
    props: {},
    data(){
        return {
            FormatUnitGroup: [],
        };
    },
    computed: {
        ...mapGetters({
            lang: 'lang',
            sortGroup: 'sortGroup',
            FormatUnits: 'FormatUnits',
            MappingPlantList: 'MappingPlantList',

            choosePlantInfo: 'choosePlantInfo',
            chooseUnitKey: 'chooseUnitKey',

            openFilterFlag: `${module_name}/openFilterFlag`,

            chooseTypes: 'chooseTypes',
        }),
        route(){
            return this.$route || false;
        },
    },
    watch: {
        sortGroup: {
            immediate: false,
            handler(){
                this.calcFormatUnitGroup();
            },
        },
        chooseTypes: {
            immediate: false,
            handler(){
                this.calcFormatUnitGroup();
            },
        },
        FormatUnits: {
            immediate: false,
            handler(){
                this.calcFormatUnitGroup();
            },
        },
    },
    beforeCreate(){
        if (!this.$store.state[module_name]) {
            this.$store.registerModule([module_name], module_store);
        }
    },
    created(){},
    mounted(){
        if (!!this.route && !!this.route.query && !!this.route.query.unit_key) {
            this.chooseUnitByKey(this.route.query.unit_key);
        }
        this.init();
        trackJS.gtag('event', 'page_view', {
            page_id: 'UnitPage',
        });
        trackJS.mixpanel('page_view', {
            page_id: 'UnitPage',
        });
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
            choosePlantByName: 'choosePlantByName',
            chooseUnitByKey: 'chooseUnitByKey',
            openFilterBox: `${module_name}/openFilterBox`,
        }),
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

        calcFormatUnitGroup(){
            const that = this;
            clearTimeout(that.calcFormatUnitGroupTimer);
            that.calcFormatUnitGroupTimer = setTimeout(() => {
                const sortGroup = JSON.parse(JSON.stringify(that.sortGroup));
                const Units = JSON.parse(JSON.stringify(that.FormatUnits));
                const lang = JSON.parse(JSON.stringify(that.lang));

                const { status, type, locations, plantNames } = lang;
                const statusRank = that._formatKeyMapping(status);
                const typeRank = that._formatKeyMapping(type);
                const locationsRank = that._formatKeyMapping(locations);
                const plantNamesRank = that._formatKeyMapping(plantNames);

                let FormatUnitGroupKeySort = {};
                Object.values(Units).forEach((UnitInfo) => {
                    if (!that.chooseTypes.includes(UnitInfo.orgType)) {
                        return true;
                    }

                    let key = [];
                    sortGroup.forEach((sortKey) => {
                        switch (sortKey) {
                            case 'gov':
                                if (UnitInfo.orgGov === '1') {
                                    key.push('0000');
                                } else {
                                    key.push('0999');
                                }
                                break;
                            case 'location':
                                if (typeof locationsRank[UnitInfo.location] !== 'undefined') {
                                    key.push(locationsRank[UnitInfo.location]);
                                } else {
                                    key.push('0999');
                                }
                                break;
                            case 'plantName':
                                if (typeof plantNamesRank[UnitInfo.plantName] !== 'undefined') {
                                    key.push(plantNamesRank[UnitInfo.plantName]);
                                } else {
                                    key.push(`________________________${UnitInfo[sortKey]}`.substr(-10));
                                }
                                break;
                            case 'type':
                                if (typeof typeRank[UnitInfo.orgType] !== 'undefined') {
                                    key.push(typeRank[UnitInfo.orgType] || '9999');
                                } else {
                                    key.push('0999');
                                }
                                break;
                            case 'status':
                                if (typeof statusRank[UnitInfo.orgStatus] !== 'undefined') {
                                    key.push(statusRank[UnitInfo.orgStatus] || '9999');
                                } else {
                                    key.push('0999');
                                }
                                break;
                            default:
                                key.push(`________________________${UnitInfo[sortKey]}`.substr(-10));
                                break;
                        }
                    });
                    key = key.join('-');

                    if (!FormatUnitGroupKeySort[key]) {
                        FormatUnitGroupKeySort[key] = [];
                    }

                    const newUnitInfo = {};
                    ['name', 'gov', 'type', 'orgType', 'orgStatus', 'location', 'plantName', 'plantFullName', 'used', 'capacity', 'key'].forEach((colKey) => {
                        newUnitInfo[colKey] = UnitInfo[colKey];
                    });

                    FormatUnitGroupKeySort[key].push(newUnitInfo);
                    return true;
                });

                FormatUnitGroupKeySort = string.sortObject(FormatUnitGroupKeySort);

                const groupKey = sortGroup[0];
                const FormatUnitGroupKey = {};
                for (const key in FormatUnitGroupKeySort) {
                    const firstUnit = FormatUnitGroupKeySort[key][0];
                    const groupName = firstUnit[groupKey];
                    if (typeof FormatUnitGroupKey[groupName] === 'undefined') {
                        FormatUnitGroupKey[groupName] = [];
                    }

                    FormatUnitGroupKey[groupName] = FormatUnitGroupKey[groupName].concat(FormatUnitGroupKeySort[key]);
                }

                const unitTypes = {};
                const FormatUnitGroup = [];
                for (const key in FormatUnitGroupKey) {
                    const units = FormatUnitGroupKey[key];

                    let TotalCapacity = 0;
                    let TotalUsed = 0;
                    let UnitFixed = 0;
                    let UnitLimit = 0;
                    let UnitBreak = 0;

                    units.forEach((UnitInfo) => {
                        unitTypes[UnitInfo.orgType] = 1;
                        switch (UnitInfo.orgStatus) {
                            case 'fix':
                                UnitFixed += UnitInfo.capacity;
                                break;
                            case 'break':
                                UnitBreak += UnitInfo.capacity;
                                break;
                            case 'limit':
                                UnitLimit += UnitInfo.capacity;
                                break;
                            case 'online':
                                TotalCapacity += UnitInfo.capacity;
                                TotalUsed += UnitInfo.used;
                                break;
                            default:
                                break;
                        }
                    });

                    FormatUnitGroup.push({
                        group_name: key,
                        type: 'unit-group',
                        units,
                        total_capacity: TotalCapacity,
                        total_used: TotalUsed,
                        total_fixed: UnitFixed,
                        total_limit: UnitLimit,
                        total_break: UnitBreak,
                    });

                    if ((FormatUnitGroup.length % 5) === 3) {
                        FormatUnitGroup.push({
                            group_name: `ads_${key}`,
                            type: 'unit-ads',
                            units: [],
                            total_capacity: 0,
                            total_used: 0,
                            total_fixed: 0,
                            total_limit: 0,
                            total_break: 0,
                        });
                    }
                }

                // eslint-disable-next-line no-plusplus
                for (let i = FormatUnitGroup.length - 1; i >= 0; i--) {
                    let accTotalUsed = 0;
                    if (!!FormatUnitGroup[i + 1] && 1) {
                        // eslint-disable-next-line prefer-destructuring
                        accTotalUsed = FormatUnitGroup[i + 1].accTotalUsed;
                    }

                    FormatUnitGroup[i].accTotalUsed = accTotalUsed + FormatUnitGroup[i].total_used;
                }

                that.FormatUnitGroup = FormatUnitGroup;
            }, 100);
        },
        _formatKeyMapping(data){
            const mapping = {};
            if (Array.isArray(data)) {
                data.forEach((val, index) => {
                    mapping[val] = `0000${index}`.substr(-4);
                });
            } else {
                const dataKeys = Object.keys(data);
                dataKeys.forEach((key, index) => {
                    mapping[key] = `0000${index}`.substr(-4);
                });
            }

            return mapping;
        },

        closePlantInfo(){
            this.choosePlantByName('');
        },
        closeUnitInfo(){
            this.chooseUnitByKey('');
        },
        openFilterBoxAct(val){
            this.openFilterBox(val);
        },
    },
};
</script>
<style lang="scss" scoped>
</style>