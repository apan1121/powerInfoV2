<template>
    <div class="pipe"
        :class="activeClass"
        :rel="vertical ? 'vertical': 'horizontal'"
        :speed="speed"
        :title="title"
        :used="used"
    >
    </div>
</template>
<script>

import IntersectionObserverBox from 'lib/common/mixins/IntersectionObserverBox';

export default {
    components: {},
    filters: {},
    mixins: [IntersectionObserverBox],
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
        return {
            hover: false,
        };
    },
    computed: {
        activeClass(){
            const that = this;
            const className = {};
            let direction = '';
            if (that.intersecting && that.used !== 0) {
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

                if (that.hover) {
                    className.hover = true;
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
        title(){
            const that = this;
            const used = that.formatMoney(Math.abs(this.used));
            const title = [];
            if (this.used > 0) {
                title.push('產生');
                title.push(used);
                title.push('MW');
            } else if (this.used < 0) {
                title.push('消耗');
                title.push(used);
                title.push('MW');
            } else {
                title.push('無電力通過');
            }

            return title.join(' ');
        },
    },
    watch: {
        title: {
            immediate: true,
            handler(){
                const that = this;
                that.$nextTick(() => {
                    $(that.$el).tooltip('dispose');
                    $(that.$el).tooltip();
                });
            },
        },
    },
    created(){},
    mounted(){
        const that = this;
        $(that.$el).off('mouseover').on('mouseover', () => {
            that.hover = true;
        });
        $(that.$el).off('mouseout').on('mouseout', () => {
            that.hover = false;
        });
    },
    updated(){},
    destroyed(){},
    methods: {
        formatMoney(val){
            return val.toLocaleString();
        },
    },
};
</script>
<style lang="scss" scoped>
</style>