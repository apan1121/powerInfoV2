/* eslint-disable no-extra-boolean-cast */
import api from '../api/index';

export default {
    getSummaryInfo({ commit }, params){
        return new Promise((resolve, reject) => {
            api.getSummaryInfo(params).success((response) => {
                commit('setSummaryInfo', response);
                resolve(response);
            }).error((response) => {
                reject(response);
            });
        });
    },

};