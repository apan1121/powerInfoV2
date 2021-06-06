/* eslint-disable no-param-reassign */
import { jsVars } from 'lib/common/util';
import baseApi from 'lib/api/baseApi';

import PlantUnitInfo from './PlantUnitInfo';
import NewsTicker from './NewsTicker';

const main = {
    ...baseApi,

    ...PlantUnitInfo,
    ...NewsTicker,
};

export default main;