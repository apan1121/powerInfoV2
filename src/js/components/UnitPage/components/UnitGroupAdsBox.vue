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
            <div ref="ads"
                class="power-info-promote"
                :class="{ 'ad-blocked': adBlocked }"
            >
                <ins class="adsbygoogle"
                    style="display:block"
                    data-ad-format="fluid"
                    data-ad-layout-key="-fb+5w+4e-db+86"
                    data-ad-client="ca-pub-3068501078221920"
                    data-ad-slot="1897408904"></ins>
            </div>
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
            'adBlocked',
        ]),
    },
    watch: {
    },
    created(){},
    mounted(){
        this.$nextTick(() => {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        });
        // this.$nextTick(() => {
        //     const html = $('.adsbygoogle')[0].outerHTML;
        //     $(this.$refs.ads).html(html);
        // });
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