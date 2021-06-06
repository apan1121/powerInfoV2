export default {
    config: state => state.config,

    PageSetting_width: state => state.PageSetting_width,
    PageSetting_mode_type: state => state.PageSetting_mode_type,

    lang: state => state.lang,

    chooseTypes: state => state.chooseTypes,

    sortGroup: state => state.sortGroup,
    showVal: state => state.showVal,

    MappingPlantList: state => state.MappingPlantList,
    FormatUnits: state => state.Units,

    RecordTime: state => state.RecordTime,

    choosePlantInfo(state, getters, rootState){
        const MappingPlantList = JSON.parse(JSON.stringify(rootState.MappingPlantList));
        let Units = JSON.parse(JSON.stringify(rootState.Units));
        const { choosePlantName } = state;
        let choosePlantInfo = false;
        Units = Object.values(Units);

        if (!!MappingPlantList[choosePlantName] && 1) {
            choosePlantInfo = MappingPlantList[choosePlantName];
            Units = Units.filter((unitInfo) => {
                return unitInfo.mappingName.includes(choosePlantInfo.nickName);
            });
            choosePlantInfo.units = Units;
        }
        return choosePlantInfo;
    },

    chooseUnitKey: state => state.chooseUnitKey,
    // chooseUnitInfo(state, getters, rootState){
    //     const { chooseUnitKey } = state;
    //     const Units = JSON.parse(JSON.stringify(rootState.Units));
    //     let choosePlantInfo = false;
    //     if (!!chooseUnitKey && Units[chooseUnitKey]) {
    //         choosePlantInfo = {};
    //         ['name', 'gov', 'type', 'orgType', 'orgStatus', 'location', 'plantName', 'plantFullName', 'used', 'capacity', 'key'].forEach((colKey) => {
    //             choosePlantInfo[colKey] = Units[chooseUnitKey][colKey];
    //         });
    //     }

    //     return choosePlantInfo;
    // },

    adBlocked: state => state.adBlocked,
};