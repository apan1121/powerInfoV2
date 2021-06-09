import { BoxIntersectionObserver } from 'lib/common/util/exposure';

export default {
    props: {
        observeWaitTime: {
            type: Number,
            default: 0,
        },
    },
    data(){
        return {
            exposureName: 'none',
            exposureCount: 0,
            intersecting: false,
        };
    },
    computed: {},
    methods: {
        exposureInit(){
            const that = this;
            BoxIntersectionObserver.observe(that.$el);
            $(that.$el).off('exposure-act').on('exposure-act', () => {
                that.exposureAct();
            });
            $(that.$el).off('intersecting-act').on('intersecting-act', (e, val) => {
                that.intersecting = val;
            });
        },
        exposureAct(){
            const that = this;
        },
        isNode(o){
            // Returns true if it is a DOM node
            return (
                typeof Node === 'object'
                    ? o instanceof Node
                    : o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
            );
        },
        isElement(o){
            // Returns true if it is a DOM element
            return (
                typeof HTMLElement === 'object'
                    ? o instanceof HTMLElement
                    : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
            );
        },
    },
    beforeDestroyed(){
        const that = this;
        BoxIntersectionObserver.unobserve(that.$el);
    },
    destroyed(){},
    mounted(){
        const that = this;
        setTimeout(() => {
            that.exposureInit();
        }, that.observeWaitTime);
    },
};