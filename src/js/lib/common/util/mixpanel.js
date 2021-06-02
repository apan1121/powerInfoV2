import Fingerprint2 from 'fingerprintjs2';
import string from './string';

const fingerInfo = null;
new Fingerprint2().get((result, components) => {
    const identify = new Fingerprint2().x64hash128(components.map(pair => pair.value).join(), 31);
    // console.log(identify);
    mixpanel_modul.data.identify = identify;
    mixpanel.identify(identify);
    mixpanel_modul.actWaitFunc();
});

const mixpanel_modul = {
    data: {
        identify: '',
        tabId: string.getRandomString(10),
        data: null,
    },
    waitFunc: [],
    actWaitFunc(){
        if (mixpanel_modul.waitFunc.length >= 0) {
            // console.log('actWaitFunc', mixpanel_modul.waitFunc);
            mixpanel_modul.waitFunc.forEach((actFunc) => {
                actFunc();
            });
        }
    },
    track(action, inputData){
        const actionFunc = function(){
            const data = { ...mixpanel_modul.data, data: inputData };
            // console.log('mixpanel', action, data);
            window.mixpanel.track(action, data);
        };

        if (mixpanel_modul.data.identify) {
            actionFunc();
        } else {
            mixpanel_modul.waitFunc.push(actionFunc);
        }
    },
};
export default mixpanel_modul;