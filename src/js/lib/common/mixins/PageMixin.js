import { jsVars } from 'lib/common/util';

export default {
    props: {
    },
    data(){
        return {
            prevRoute: null,
            lastTitle: '',
        };
    },
    computed: {},
    methods: {
        setPageSEO(data){
            const ASSETS_HOST = jsVars.get('ASSETS_HOST');
            this.lastTitle = window.document.title;

            const WebTitle = '台灣電廠即時資訊';
            const SEO = {
                title: 'WebTitle',
                description: '讓你一目了然全台灣電廠即時發電量資訊',
                image: 'https://apan1121.github.io/powerInfoV2/dist/img/logo.jpg',
                ...data,
            };

            if (SEO.title) {
                SEO.title = `${SEO.title} - ${WebTitle}`;
            }

            let location = window.location.href;
            if (location.includes('#/unit/')) {
                location = `${ASSETS_HOST}?path=${encodeURIComponent(window.location.hash.substr(2))}`;
            } else if (location.includes('#/plant/')) {
                location = `${ASSETS_HOST}?path=${encodeURIComponent(window.location.hash.substr(2))}`;
            }

            window.document.title = SEO.title;
            document.querySelector("meta[property='og:title']").content = SEO.title;
            document.querySelector("meta[name='description']").content = SEO.description;
            document.querySelector("meta[property='og:description']").content = SEO.description;
            document.querySelector("meta[property='og:url']").content = location;
            document.querySelector("link[rel='canonical']").href = location;
        },
        setPageTitle(title){
            this.lastTitle = window.document.title;
            const WebTitle = '台灣電廠即時資訊';
            if (!title) {
                title = WebTitle;
            } else {
                title = `${title} - ${WebTitle}`;
            }
            window.document.title = title;
        },
        undoPageTitle(){
            window.document.title = this.lastTitle;
        },
    },
    beforeDestroyed(){
    },
    destroyed(){},
    mounted(){
    },
};