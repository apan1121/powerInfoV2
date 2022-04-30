/* eslint-disable no-param-reassign */
import { jsVars } from 'lib/common/util';
import baseApi from 'lib/api/baseApi';

import PlantUnitInfo from './PlantUnitInfo';
import NewsTicker from './NewsTicker';
import Alarm from './Alarm';

const main = {
    ...baseApi,

    ...PlantUnitInfo,
    ...NewsTicker,
    ...Alarm,
};

export default main;