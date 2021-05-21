<template>
    <div class="unit-page">
        <summary-box></summary-box>
        <template v-for="(UnitGroup, UnitGroupIndex) in FormatUnitGroup">
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
    </div>
</template>
<script>
import { popup, string } from 'lib/common/util';
import { mapActions, mapMutations, mapGetters } from 'vuex';

import { module_name, module_store } from './lib/store/index';

import SummaryBox from './components/SummaryBox.vue';
import UnitGroupBox from './components/UnitGroupBox.vue';



// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        SummaryBox,
        UnitGroupBox,
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
            sortGroup: `${module_name}/sortGroup`,
            FormatUnits: `${module_name}/FormatUnits`,
            MappingPlantList: `${module_name}/MappingPlantList`,

            // FormatUnitGroup: `${module_name}/FormatUnitGroup`,
            // MappingPlantList: `${module_name}/MappingPlantList`,
        }),
    },
    watch: {
        sortGroup: {
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
        const that = this;
        if (!this.$store.state[module_name]) {
            this.$store.registerModule([module_name], module_store);
        }
    },
    created(){},
    mounted(){
        this.init();
    },
    updated(){},
    destroyed(){},
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
            that.$store.dispatch(`${module_name}/getPlantInfo`).then((response) => {
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
            that.$store.dispatch(`${module_name}/getRealTimePowerInfo`).then((response) => {
                popup.close();
            }, () => {
                popup.close();
            });
        },

        calcFormatUnitGroup(){
            const that = this;
            that.calcFormatUnitGroupTimer = setTimeout(() => {
                const MappingPlantList = JSON.parse(JSON.stringify(that.MappingPlantList));
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
                    ['name', 'gov', 'type', 'orgType', 'orgStatus', 'location', 'plantName', 'used', 'capacity', 'key'].forEach((colKey) => {
                        newUnitInfo[colKey] = UnitInfo[colKey];
                    });

                    newUnitInfo.plantFullName = '';
                    if (!!MappingPlantList[newUnitInfo.plantName] && 1) {
                        newUnitInfo.plantFullName = MappingPlantList[newUnitInfo.plantName].fullName;
                    }

                    FormatUnitGroupKeySort[key].push(newUnitInfo);
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


                const FormatUnitGroup = [];
                for (const key in FormatUnitGroupKey) {
                    const units = FormatUnitGroupKey[key];

                    let TotalCapacity = 0;
                    let TotalUsed = 0;
                    let UnitFixed = 0;
                    let UnitLimit = 0;
                    let UnitBreak = 0;

                    units.forEach((UnitInfo) => {
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
                        units,
                        total_capacity: TotalCapacity,
                        total_used: TotalUsed,
                        total_fixed: UnitFixed,
                        total_limit: UnitLimit,
                        total_break: UnitBreak,
                    });
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
    },
};
</script>
<style lang="scss" scoped>
</style>