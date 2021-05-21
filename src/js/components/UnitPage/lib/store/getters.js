import { string } from 'lib/common/util';

const _formatKeyMapping = function(data){
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
};

export default {
    MappingPlantList: state => state.MappingPlantList,
    FormatUnits: state => state.Units,
    sortGroup: state => state.sortGroup,


    FormatUnitGroup(state, getters, rootState){
        const Units = JSON.parse(JSON.stringify(state.Units));
        const lang = JSON.parse(JSON.stringify(rootState.lang));

        const { status, type, locations, plantNames } = lang;
        const statusRank = _formatKeyMapping(status);
        const typeRank = _formatKeyMapping(type);
        const locationsRank = _formatKeyMapping(locations);
        const plantNamesRank = _formatKeyMapping(plantNames);

        // console.log(statusRank, typeRank, locationsRank, plantNamesRank);

        const sortGroup = [
            'plantName',
            // 'type',
            // 'status',
            // 'location',
            // 'gov',
            // 'name',
        ];

        let FormatUnitGroupKeySort = {};
        Units.forEach((UnitInfo) => {
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
            delete UnitInfo.records;
            FormatUnitGroupKeySort[key].push(UnitInfo);
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


        return FormatUnitGroup;
    },
    RecordTime: state => state.RecordTime,
    Units: state => state.Units,
    sortGroup: state => state.sortGroup,
    showVal: state => state.showVal,
};