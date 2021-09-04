<template>
    <div></div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { string } from 'lib/common/util';
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {},
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
        const query = string.getJsonFromUrl(window.location.search.substr(1));
        let toPath = '/unit';
        if (!!query.path && 1) {
            const tmpPath = query.path + window.location.hash;
            console.log(tmpPath);
            const matcher = this.$router.matcher.match(tmpPath);
            console.log(matcher);
            if (matcher.name !== 'RouterDetect') {
                toPath = tmpPath;
            }
            console.log(toPath);
            const link = document.createElement('a');
            link.href = window.location.href;
            link.search = '';
            link.hash = '';
            window.history.replaceState(null, null, link.href);
        }

        this.$router.replace(toPath);
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