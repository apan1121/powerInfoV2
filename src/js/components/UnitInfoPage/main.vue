<template>
    <div v-if="!!FormatUnits && FormatUnits[unit_key]" style="margin: 0 auto; max-width: 700px;">
        <unit-info :unit-key="unit_key"></unit-info>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { popup } from 'lib/common/util';
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        UnitInfo: () => import('components/UnitInfo/main.vue'),
    },
    filters: {},
    props: {
    },
    data(){
        return {};
    },
    computed: {
        ...mapGetters({
            FormatUnits: 'FormatUnits',
        }),
        unit_key(){
            let unit_key = '';
            if (!!this.$route.params && !!this.$route.params.unit_key) {
                unit_key = this.$route.params.unit_key;
            }
            return unit_key;
        },
    },
    watch: {
        unit_key: {
            immediate: true,
            deep: true,
            handler(newVal){
                console.log(newVal);
            },
        },
    },
    created(){
        this.init();
    },
    mounted(){},
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        init(){
            this.loadPlantInfo();
        },
        loadPlantInfo(){
            const that = this;

            popup.loading({
                title: '讀取中',
            });
            that.$store.dispatch('getPlantInfo').then((response) => {
                that.loadPowerInfo();
            }, () => {
                popup.close();
            });
        },
        loadPowerInfo(){
            const that = this;
            popup.loading({
                title: '讀取中',
            });
            that.$store.dispatch('getRealTimePowerInfo').then((response) => {
                popup.close();
            }, () => {
                popup.close();
            });
        },
    },
};
</script>
<style lang="scss" scoped>
</style>