<template>
    <card-box :title="'廣告'">
        <div ref="ads">
        </div>
        <!-- <in-feed-adsense
            data-ad-format="fluid"
            data-ad-layout-key="-fb+5w+4e-db+86"
            data-ad-client="ca-pub-3068501078221920"
            data-ad-slot="1897408904">
        </in-feed-adsense> -->
    </card-box>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        CardBox: () => import('components/CardBox/main.vue'),
    },
    filters: {},
    props: {},
    data(){
        return {};
    },
    computed: {
        ...mapGetters([
        ]),
    },
    watch: {
    },
    beforeCreate(){

    },
    created(){
    },
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