/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-param-reassign */
import { string } from 'lib/common/util';

const main = {
    // setDiscussSortDirection(state, params){
    //     const DiscussSortDirection = JSON.parse(JSON.stringify(state.DiscussSortDirection));
    //     DiscussSortDirection[params.discussBoxId] = params.sortDirection;
    //     state.DiscussSortDirection = DiscussSortDirection;
    // },
    openFilterBox(state, val){
        state.openFilterFlag = !!val;
    },
    setSummaryInfo(state, params){
        params = string.sortObject(params);
        console.log('setSummaryInfo');
        state.summaryInfo = params;
    },
};

export default main;