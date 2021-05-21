/* eslint-disable no-extra-boolean-cast */
import api from '../api/index';

export default {
    getPlantInfo({ commit }, params){
        return new Promise((resolve, reject) => {
            api.getPlantInfo(params).success((response) => {
                commit('setPlantInfo', response);
                resolve(response);
            }).error((response) => {
                reject(response);
            });
        });
    },

    getRealTimePowerInfo({ commit, rootState }, params){
        return new Promise((resolve, reject) => {
            api.getRealTimePowerInfo(params).success((response) => {
                commit('setRecordTime', response.time);
                commit('setUnits', { Units: response.info, lang: rootState.lang });
                resolve(response);
            }).error((response) => {
                reject(response);
            });
        });
    },
};