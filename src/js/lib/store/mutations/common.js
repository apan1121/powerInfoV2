import Vue from 'vue';

export default {
    initSystem(state, params){
        // state.prizeList = prizeList;
    },
    SetPageSetting(state, params){
        for (const key in params) {
            state[`PageSetting_${key}`] = params[key];
        }
    },
    SetChooseTypes(state, params){
        state.chooseTypes = params;
    },

    SetSortGroup(state, params){
        state.sortGroup = params;
    },
    SetShowVal(state, params){
        state.showVal = params;
    },

    choosePlantByName(state, val){
        state.choosePlantName = val;
    },
    chooseUnitByKey(state, val){
        state.chooseUnitKey = val;
    },

    setPlantInfo(state, data){
        state.PlantList = data;

        const MappingPlantList = {};
        data.forEach((plantInfo, index) => {
            if (!!plantInfo.nickName && 1) {
                MappingPlantList[plantInfo.nickName] = plantInfo;
            }
        });
        state.MappingPlantList = MappingPlantList;
    },
    setRecordTime(state, data){
        state.RecordTime = data;
    },
    setUnits(state, data){
        const { MappingPlantList } = state;
        const { Units, lang } = data;

        const locations = {};
        const unitMapping = {};
        for (const unitInfo of Units) {
            let unitKey = [];

            unitInfo.orgType = unitInfo.type;
            unitInfo.orgStatus = unitInfo.status;
            unitInfo.type = lang.type[unitInfo.type];
            unitInfo.status = lang.status[unitInfo.status];
            let plantName = unitInfo.mappingName[0];
            if (Array.isArray(plantName)) {
                plantName = plantName.join('、');
            }
            unitInfo.plantName = plantName;

            unitInfo.plantFullName = '';
            if (!!MappingPlantList[unitInfo.plantName] && 1) {
                unitInfo.plantFullName = MappingPlantList[unitInfo.plantName].fullName;
            }


            let location = '其他';
            if (MappingPlantList[plantName]) {
                // eslint-disable-next-line prefer-destructuring
                location = MappingPlantList[plantName].location;
            }
            unitInfo.location = location;

            unitInfo.orgGov = unitInfo.gov;
            unitInfo.gov = (unitInfo.gov == 1) ? '政府' : '民間';

            unitMapping[unitInfo.key] = unitInfo;
        }

        state.Units = unitMapping;
    },

    CheckAdBlock(state, data){
        state.adBlocked = data;
    },

    setNoticeRecord(state, params){
        state.NoticeRecord = params.reverse();
    },
};