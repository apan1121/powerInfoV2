<template>
    <div class="pipe"
        :class="activeClass"
        :rel="vertical ? 'vertical': 'horizontal'"
        :speed="speed"
    >
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {},
    filters: {},
    props: {
        vertical: {
            type: Boolean,
            default: true,
        },
        direction: {
            type: String,
            default: 'up',
        },
        used: {
            type: Number,
            default: 0,
        },
    },
    data(){
        return {};
    },
    computed: {
        ...mapGetters([
        ]),
        activeClass(){
            const that = this;
            const className = {};
            let direction = '';
            if (that.used !== 0) {
                // eslint-disable-next-line prefer-destructuring
                direction = that.direction;
                if (that.used < 0) {
                    switch (direction) {
                        case 'up':
                            direction = 'down';
                            break;
                        case 'down':
                            direction = 'up';
                            break;
                        case 'left':
                            direction = 'right';
                            break;
                        case 'right':
                            direction = 'left';
                            break;
                        default:
                            break;
                    }
                }
                className[`progress-active-${direction}`] = true;
                if (that.used < 0) {
                    className.loss = true;
                }
            }

            return className;
        },
        speed(){
            let speed = 0;
            const used = Math.abs(this.used);
            if (used < 100) {
                speed = 1;
            } else if (used < 400) {
                speed = 2;
            } else if (used < 800) {
                speed = 3;
            } else if (used < 1000) {
                speed = 4;
            } else {
                speed = 5;
            }
            return speed;
        },
    },
    watch: {
    },
    created(){},
    mounted(){},
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
    },
};
</script>
<style lang="scss" scoped>
</style>