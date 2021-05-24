/* eslint-disable no-param-reassign */
import { jsVars } from 'lib/common/util';
import baseApi from 'lib/api/baseApi';

const API_HOST = jsVars.get('API_CONFIG.API_HOST');

const main = {
    ...baseApi,
    getSummaryInfo(params){
        const api_url = `${API_HOST}log/summary.log?t=${new Date().getTime()}`;
        return main.run(api_url, 'GET', params);
    },
};

export default main;