<template>
    <div class="card" :class="{ fullscreen }">
        <div class="card-header">
            <div class="card-title" v-html="title"></div>
            <div v-if="download" class="tool-button" @click="downloadFile">
                <i class="icon-download"></i>
            </div>
            <template v-if="showFullscreenBtn">
                <div v-if="fullscreen == false" class="tool-button" @click="fullscreen = true">
                    <i class="fas fa-expand"></i>
                </div>
                <div v-if="fullscreen == true" class="tool-button" @click="fullscreen = false">
                    <i class="fas fa-compress"></i>
                </div>
            </template>
        </div>
        <div class="card-body">
            <slot></slot>
        </div>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import PageMixin from 'lib/common/mixins/PageMixin';
import { linkRegister, trackJS } from 'lib/common/util';
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

linkRegister.register([
    {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/dist/css/page/card-box.css',
    },
]);

export default {
    components: {},
    filters: {},
    mixins: [PageMixin],
    props: {
        title: {
            type: String,
            default: '未定名',
        },
        download: {
            type: Boolean,
            default: false,
        },
    },
    data(){
        return {
            fullscreen: false,
        };
    },
    computed: {
        ...mapGetters([
        ]),
        showFullscreenBtn(){
            return !!this.$listeners.fullscreen;
        },
    },
    watch: {
        fullscreen(newVal){
            this.$emit('fullscreen', this.fullscreen);
            trackJS.gtag('event', 'cardBox_click', {
                title: this.title,
                fullscreen: this.fullscreen,
            });
            trackJS.mixpanel('cardBox_click', {
                title: this.title,
                fullscreen: this.fullscreen,
            });

            if (newVal) {
                this.setPageTitle(`${this.title}`);
            } else {
                this.undoPageTitle();
            }
        },
    },
    created(){},
    mounted(){},
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        downloadFile(){
            this.$emit('download');
        },
    },
};
</script>
<style lang="scss" scoped>
</style>