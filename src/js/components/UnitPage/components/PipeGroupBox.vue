<template>
    <div class="pipe-group">
        <div class="pipe-wrapper">
            <pipe v-if="pipeTop !== false"
                class="pipe-top"
                :vertical="true"
                :direction="directionTop? 'up' :'down'"
                :used="pipeTop"
            ></pipe>
            <pipe
                v-if="pipeRight !== false"
                class="pipe-right"
                :vertical="false"
                :direction="directionRight? 'up': 'down'"
                :used="pipeRight"
            ></pipe>
            <pipe v-if="pipeBottom !== false"
                class="pipe-bottom"
                :vertical="true"
                :direction="directionTop? 'up' :'down'"
                :used="pipeBottom"
            ></pipe>
        </div>
        <div class="pipe-group-content">
            <div class="unit-group-box" :class="{ show: collapse }">
                <div v-if="hasTitleSlot" class="unit-group-header" @click="collapseToggle">
                    <slot name="title"></slot>
                </div>

                <div class="unit-group-content">
                    <slot name="content"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { trackJS }  from 'lib/common/util';
import { module_name } from '../lib/store/index';

// import Pipe from './pipe.vue';
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        Pipe: () => import('components/pipe/main.vue'),
    },
    filters: {},
    props: {
        pipeTop: {
            type: [Boolean, Number],
            default: false,
        },
        pipeRight: {
            type: [Boolean, Number],
            default: false,
        },
        pipeBottom: {
            type: [Boolean, Number],
            default: false,
        },
        directionTop: {
            type: Boolean,
            default: true,
        },
        directionRight: {
            type: Boolean,
            default: true,
        },
        groupName: {
            type: String,
            default: '',
        },
    },
    data(){
        return {
            collapse: true,
        };
    },
    computed: {
        ...mapGetters([]),
        hasTitleSlot(){
            return !!this.$slots.title;
        },
    },
    watch: {
        collapse(){
            trackJS.gtag('event', 'PipeGroupBox', {
                groupName: this.groupName,
                collapse: this.collapse,
            });
            trackJS.mixpanel('PipeGroupBox_collapse', {
                groupName: this.groupName,
                collapse: this.collapse,
            });
        },
    },
    created(){},
    mounted(){},
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        collapseToggle(){
            this.collapse = !this.collapse;
        },
    },
};
</script>
<style lang="scss" scoped>
</style>