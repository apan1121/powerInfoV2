import axios from 'axios';
import { jsVars } from 'lib/common/util';

const main = {
    apiURL: '',

    axios,
    axPromise: null,

    // apiUrl: {
    //     ...route,
    // },

    run: (run, method, params) => {
        // if (jsVars != undefined && jsVars.debug == 1) {
        //     console.log(run, method, params);
        // }

        let axPromise = null;
        switch (method.toUpperCase()) {
            case 'GET':
                axPromise = axios.get(run, params);
                break;
            case 'POST':
                axPromise = axios.post(run, params);
                break;
            case 'PUT':
                axPromise = axios.put(run, params);
                break;
            case 'PATCH':
                axPromise = axios.patch(run, params);
                break;
            case 'DELETE':
                axPromise = axios.delete(run, params);
                break;
            default:
                console.log(`ERROR: ${methodmethod}`);
                break;
        }
        main.axPromise = axPromise;
        return main;
    },

    success: (callback) => {
        main.axPromise.then(response => callback(response.data));
        return main;
    },

    error: (callback) => {
        main.axPromise.catch((response) => {
            let returnData = null;
            try {
                returnData = JSON.parse(response.request.response);
            } catch (e) {
                main.writeErrorLog(response);
                returnData = {};
            }
            callback(returnData, response.request.status);
        });
        return main;
    },
    writeErrorLog: (error) => {
        console.log(error);
    },

    /* 移至 uti/route */
    route: (uri, params) => route(uri, params),
    // formatUrl: (urlPath, params) => {
    //     for (let key in params) {
    //         let reg = new RegExp('_'+ key+'_', 'ig');

    //         urlPath = urlPath.replace(reg, params[key]);
    //     }
    //     return urlPath;
    // }
};
export default main;