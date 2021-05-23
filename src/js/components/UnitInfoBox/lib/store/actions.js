/* eslint-disable no-extra-boolean-cast */
import api from '../api/index';

export default {
    // clearFocusDiscussId({ commit }, params){
    //     commit('focusDiscussId', '');
    // },
    getUnitRecord({ commit }, params){
        return new Promise((resolve, reject) => {
            api.getUnitRecord(params).success((response) => {
                commit('setRecord', response);
            }).error((response) => {
                reject(response);
            });
        });
    },
};