<template>
    <pipe-group-box
        :direction-top="true"
        :direction-right="false"
        :pipe-top="accTotalUsed"
        :pipe-bottom="lastAccTotalUsed"
        :pipe-right="totalUsed"
    >
        <template v-slot:title>
            {{ groupName }}
        </template>
        <template v-slot:content>
            <div ref="ads"></div>
        </template>
    </pipe-group-box>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import PipeGroupBox from './PipeGroupBox.vue';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        PipeGroupBox,
    },
    filters: {},
    props: {
        groupName: {
            type: String,
            default: '未命名',
        },
        totalUsed: {
            type: Number,
            default: 0,
        },
        accTotalUsed: {
            type: Number,
            default: 0,
        },
        lastAccTotalUsed: {
            type: [Number, Boolean],
            default: 0,
        },
    },
    data(){
        return {};
    },
    computed: {
        ...mapGetters([
        ]),
    },
    watch: {
    },
    created(){},
    mounted(){
        this.$nextTick(() => {
            const html = $('.adsbygoogle')[0].outerHTML;
            $(this.$refs.ads).html(html);
        });
    },
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