/* eslint-disable no-param-reassign */
import { jsVars } from 'lib/common/util';
import baseApi from 'lib/api/baseApi';

const API_HOST = jsVars.get('API_CONFIG.API_HOST');

const main = {
    ...baseApi,
    getUnitRecord(params){
        const unitKey = params.unitKey.replace('#', '%23');
        const api_url = `${API_HOST}log/record/${unitKey}.log?t=${new Date().getTime()}`;
        return main.run(api_url, 'GET');
    },
};

export default main;