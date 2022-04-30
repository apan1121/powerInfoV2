import moment from 'moment';

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

    choosePlantName: state => state.choosePlantName,

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

    NoticeRecord: state => state.NoticeRecord,

    adBlocked: state => state.adBlocked,


    LastAlarmRecord: (state) => {
        const AlarmRecord = JSON.parse(JSON.stringify(state.AlarmRecord));
        let LastAlarmRecord = false;

        if (AlarmRecord.length > 0) {
            console.log(AlarmRecord[0]);
            console.log(moment().diff(moment(AlarmRecord[0].time), 'day'));
        }


        return LastAlarmRecord;
    },
};