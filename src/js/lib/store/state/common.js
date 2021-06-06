export default {
    PageSetting_width: 0,
    PageSetting_mode_type: 'pc',

    lang: {
        type: {
            // all: '全部',
            nuclear: '核能',
            coal: '燃煤',
            oil: '燃油',
            diesel: '輕油',
            lng: '天然氣',
            'co-gen': '汽電共生',
            solar: '太陽能',
            // water: '水力',
            wind: '風力',
            hydro: '水力',
            'pumping gen': '抽蓄發電',
            'pumping load': '抽蓄負載',
            geothermal: '地熱',
        },

        status: {
            online: '商轉中',
            break: '故障機組',
            limit: '限轉機組',
            fix: '待修機組',
        },
        plantNames: [
            '核ㄧ',
            '核二',
            '核三',
            '林口',
            '台中',
            '興達',
            '大林',
            '汽電共生',
            '和平',
            '麥寮',
            '大潭',
            '通霄',
            '南部',
            '海湖',
            '新桃',
            '國光',
        ],

        locations: [
            '臺北市',
            '新北市',
            '基隆市',
            '桃園市',
            '新竹市',
            '新竹縣',
            '宜蘭縣',
            '苗栗縣',
            '臺中市',
            '彰化縣',
            '南投縣',
            '雲林縣',
            '嘉義市',
            '嘉義縣',
            '臺南市',
            '高雄市',
            '屏東縣',
            '花蓮縣',
            '臺東縣',
            '澎湖縣',
            '金門縣',
            '連江縣',
        ],

        unit: {
        },

        sortNames: {
            plantName: '電廠名稱',
            type: '發電類型',
            status: '電廠狀態',
            name: '機組名稱',
            location: '所在縣市',
            gov: '政府/民間',
        },

        showVal: {
            capacity: '',
            used: '',
        },

        usedType: {
            cap: '可發電量',
            used: '已發電量',
            fix: '待修機組',
            break: '故障機組',
            limit: '限轉機組',
        },
    },

    chooseTypes: [
        'nuclear',
        'coal',
        'oil',
        'diesel',
        'lng',
        'co-gen',
        'solar',
        'hydro',
        'wind',
        'pumping gen',
        'pumping load',
        'geothermal',
    ],

    showVal: 'used',
    sortGroup: [
        'plantName',
        'type',
        'status',
        'name',
    ],

    MappingPlantList: {},
    Units: {},
    RecordTime: '',

    choosePlantName: '',
    chooseUnitKey: '',

    adBlocked: false,

    NoticeRecord: [],
};