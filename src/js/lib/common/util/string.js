const deepDiffMapper_func = (function(){
    return {
        VALUE_CREATED: 'created',
        VALUE_UPDATED: 'updated',
        VALUE_DELETED: 'deleted',
        VALUE_UNCHANGED: 'unchanged',
        map(obj1, obj2){
            if (this.isFunction(obj1) || this.isFunction(obj2)) {
                throw 'Invalid argument. Function given, object expected.';
            }
            if (this.isValue(obj1) || this.isValue(obj2)) {
                return {
                    type: this.compareValues(obj1, obj2),
                    data: (obj1 === undefined) ? obj2 : obj1,
                };
            }

            const diff = {};
            for (var key in obj1) {
                if (this.isFunction(obj1[key])) {
                    continue;
                }

                let value2;
                if (typeof (obj2[key]) !== 'undefined') {
                    value2 = obj2[key];
                }

                diff[key] = this.map(obj1[key], value2);
            }
            for (var key in obj2) {
                if (this.isFunction(obj2[key]) || (typeof (diff[key]) !== 'undefined')) {
                    continue;
                }

                diff[key] = this.map(undefined, obj2[key]);
            }

            return diff;
        },
        compareValues(value1, value2){
            if (value1 === value2) {
                return this.VALUE_UNCHANGED;
            }
            if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
                return this.VALUE_UNCHANGED;
            }
            if (typeof (value1) === 'undefined') {
                return this.VALUE_CREATED;
            }
            if (typeof (value2) === 'undefined') {
                return this.VALUE_DELETED;
            }

            return this.VALUE_UPDATED;
        },
        isFunction(obj){
            return {}.toString.apply(obj) === '[object Function]';
        },
        isArray(obj){
            return {}.toString.apply(obj) === '[object Array]';
        },
        isDate(obj){
            return {}.toString.apply(obj) === '[object Date]';
        },
        isObject(obj){
            return {}.toString.apply(obj) === '[object Object]';
        },
        isValue(obj){
            return !this.isObject(obj) && !this.isArray(obj);
        },
    };
}());


const getRandomString_func = function(strLen = 5){
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < strLen; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const formatMoney_func = function(num){
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

const object2QueryStr_func = function(obj, prefix){
    obj = sortObject_func(obj);
    const str = [];
    let p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            const k = prefix ? `${prefix}[${p}]` : p;
            const v = obj[p];
            str.push((v !== null && typeof v === 'object')
                ? object2QueryStr_func(v, k)
                : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        }
    }
    return str.join('&');
};

const sortObject_func = function(o){
    const sorted = {};
    let key; const
        a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
};


const getJsonFromUrl_func = function(queryString){
    let result = {};
    queryString.split('&').forEach((part) => {
        if (!part) return;
        part = part.split('+').join(' '); // replace every + with space, regexp-free version
        const eq = part.indexOf('=');
        const key = eq > -1 ? part.substr(0, eq) : part;
        let val = null;
        if (eq > -1) {
            try {
                val = decodeURIComponent(part.substr(eq + 1));
            } catch (e) {
                console.log(`${part.substr(eq + 1)} can't decode`);
            }
        }

        const from = key.indexOf('[');
        var newKey = null;
        if (from == -1) {
            try {
                newKey = decodeURIComponent(key);
            } catch (e) {
                console.log(`${key} can't decode`);
            }
            if (newKey != null && val != null) {
                result[newKey] = val;
            }
        } else {
            const to = key.indexOf(']');
            var newKey = null;
            let index = null;
            try {
                newKey = decodeURIComponent(key.substring(0, from));
            } catch (e) {
                console.log(`${key.substring(0, from)} can't decode`);
            }

            try {
                index = decodeURIComponent(key.substring(from + 1, to));
            } catch (e) {
                console.log(`${key.substring(from + 1, to)} can't decode`);
            }

            if (newKey != null && index != null && val != null) {
                if (!result[newKey]) result[newKey] = [];

                if (!index) {
                    result[newKey].push(val);
                } else {
                    result[newKey][index] = val;
                }
            }
        }
    });

    result = sortObject_func(result);
    return result;
};

const keywordRemover_func = function(uri){
    uri = uri.replace(/%/g, '％');
    uri = uri.replace(/\?/g, '？');
    uri = encodeURIComponent(uri).replace(/%2F/g, '');
    return uri;
};

const formatContent_func = function(content, formatType = null){
    if (formatType == null || typeof (formatType) !== 'object' || formatType.length == 0) {
        formatType = ['url'];
    }


    formatType.forEach((formatTypeKey) => {
        switch (formatTypeKey) {
            case 'url':
                content = formatContent_url(content);
                break;
            case 'nl2br':
                content = nl2br_func(content);
                break;
        }
    });


    return content;
};

const formatContent_url = function($content){
    // 訊息內容中，URL處理 原：(https?:\/\/[\w-\.]+(:\d+)?(\/[\w\-\%\/\.]*)?(\?\S*)?(#\S*)?)
    $content = $content.replace(
        /(https?:\/\/[\w-\.]+(:\d+)?(\/[(\w\/\.\u3000-\u303F\u4e00-\u9fa5\u0080-\uFFEF\+\-%)]*)?(\?\S*)?(#\S*)?)/g,
        $match => `<a class="word-wrap js-outsite-link" href="${_greatUrlEncode($match)}" target="_blank">${$match}</a>`,
    );

    return $content;
};

const getUrlFromContent_func = function($content){
    const matchUrl = $content.match(/(https?:\/\/[\w-\.]+(:\d+)?(\/[(\w\/\.\u3000-\u303F\u4e00-\u9fa5\u0080-\uFFEF\+\-%)]*)?(\?\S*)?(#\S*)?)/g);
    return matchUrl;
};

const _greatUrlEncode = function($url){
    const a = document.createElement('a');
    a.href = $url;
    return a.href;

    // //query_string
    // $query_string = '';
    // if ($url.indexOf('?')){ // strpos($url, '?')
    //     $tmp = $url.split('?'); // explode('?', $url)
    //     $query_string = $tmp[1];
    //     $str = $tmp[0];
    // } else {
    //     $str = $url;
    // }

    // //protocol
    // $protocol = '';
    // if ($url.indexOf('://')){ // strpos($url, '://')
    //     $tmp = $str.split('://'); // explode('://', $str)
    //     $protocol = $tmp[0];
    //     $path = $tmp[1];
    // } else {
    //     $path = $str;
    // }

    // //url
    // $tmp = $path.split('/'); // explode('/', $path)
    // $path = [];

    // for (var $part in $tmp){
    //     $path.push(encodeURI($tmp[$part]));
    // }

    // $url_enc = ($protocol == '') ? '' : $protocol + '://';
    // $url_enc += $path.join('/'); // implode('/', $path)
    // $url_enc += ($query_string == undefined) ? '' : '?' + $query_string;

    // return $url_enc
};


const formatUrlByParams_func = function(urlPath, params){
    for (const key in params) {
        const reg = new RegExp(`\{${key}\}`, 'ig');

        const oldUrlPath = urlPath;
        urlPath = urlPath.replace(reg, params[key]);
        if (urlPath != oldUrlPath) {
            delete params[key];
        }
    }
    if (params && Object.keys(params).length > 0) {
        urlPath += `?${object2QueryStr_func(params)}`;
    }
    return urlPath;
};

const htmlEntityDecode_func = function(content){
    return $('<textarea/>').html(content).text();
};

/*
    PHP nl2br function 的 JavaScript 版本。
    把 nl ("\r\n", "\n\r", "\r", "\n") 代換成 HTML tag "<br/>"。

    source: https://stackoverflow.com/questions/7467840/nl2br-equivalent-in-javascript
*/
const nl2br_func = function(str, is_xhtml){
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (`${str}`).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n|\&\#10\;)/g, `$1${breakTag}$2`);
};

const formatSecond_func = function(secs){
    const hr = Math.floor(secs / 3600);
    const min = Math.floor((secs - (hr * 3600)) / 60);
    const sec = parseInt(secs - (hr * 3600) - (min * 60));

    const timer = [];
    timer.push((`00${sec}`).slice(-2));
    timer.push((`00${min}`).slice(-2));
    // if ((!isNaN(sec) && sec > 0) || (!isNaN(min) && min > 0) || (isNaN(hr) && hr > 0)) {
    //     timer.push(("00" + sec).slice(-2));
    // }

    // if ((!isNaN(min) && min > 0) || (isNaN(hr) && hr > 0)) {
    //     timer.push(("00" + min).slice(-2));
    // }

    if ((!isNaN(hr) && hr > 0)) {
        timer.push(hr);
    }

    return timer.reverse().join(':');
};

const toSnakeCase_func = function(val){
    const upperChars = val.match(/([A-Z])/g);
    if (!upperChars) {
        return val;
    }

    let str = val.toString();
    for (let i = 0, n = upperChars.length; i < n; i++) {
        str = str.replace(new RegExp(upperChars[i]), `_${upperChars[i].toLowerCase()}`);
    }

    if (str.slice(0, 1) === '_') {
        str = str.slice(1);
    }

    return str;
};

const uuid_func = function(){
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

const carryFormatter_func = function(num, digits){
    const si = [
        { value: 1, symbol: '' },
        { value: 1E3, symbol: 'k' },
        { value: 1E6, symbol: 'M' },
        { value: 1E9, symbol: 'G' },
        { value: 1E12, symbol: 'T' },
        { value: 1E15, symbol: 'P' },
        { value: 1E18, symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};


const main = {
    deepDiffMapper: deepDiffMapper_func,

    getRandomString: getRandomString_func,

    object2QueryStr: object2QueryStr_func,
    sortObject: sortObject_func,
    getJsonFromUrl: getJsonFromUrl_func,
    formatMoney: formatMoney_func,

    keywordRemover: keywordRemover_func,

    formatContent: formatContent_func,

    formatUrlByParams: formatUrlByParams_func,

    getUrlFromContent: getUrlFromContent_func,

    htmlEntityDecode: htmlEntityDecode_func,

    nl2br: nl2br_func,

    formatSecond: formatSecond_func,
    toSnakeCase: toSnakeCase_func,

    uuid: uuid_func,

    carryFormatter: carryFormatter_func,
};

export const deepDiffMapper = deepDiffMapper_func;
export const getRandomString = getRandomString_func;
export const object2QueryStr = object2QueryStr_func;
export const sortObject = sortObject_func;
export const getJsonFromUrl = getJsonFromUrl_func;
export const formatMoney = formatMoney_func;
export const keywordRemover = keywordRemover_func;
export const formatContent = formatContent_func;
export const htmlEntityDecode = htmlEntityDecode_func;
export const nl2br = nl2br_func;
export const formatSecond = formatSecond_func;
export const toSnakeCase = toSnakeCase_func;
export const uuid = uuid_func;
export const carryFormatter = carryFormatter_func;
export default main;