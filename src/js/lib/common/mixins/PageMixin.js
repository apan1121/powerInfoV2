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