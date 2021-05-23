/* eslint-disable no-param-reassign */
import { jsVars } from 'lib/common/util';
import baseApi from 'lib/api/baseApi';

import PlantUnitInfo from './PlantUnitInfo';

const main = {
    ...baseApi,

    ...PlantUnitInfo,
};

export default main;