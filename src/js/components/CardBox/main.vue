<template>
    <div class="card" :class="{ fullscreen, 'card-close': !boxToggle }">
        <div class="card-header">
            <div class="card-title" v-html="title"></div>
            <div v-if="download" class="tool-button" rel="download" @click="downloadFile">
                <i class="icon-download"></i>
            </div>

            <template v-if="showToggleButton">
                <div v-if="boxToggle == false" class="tool-button" rel="toggle" @click="boxToggle = true">
                    <i class="fas fa-plus"></i>
                </div>
                <div v-if="boxToggle == true" class="tool-button" rel="toggle" @click="boxToggle = false">
                    <i class="fas fa-minus"></i>
                </div>
            </template>

            <template v-if="showFullscreenBtn">
                <div v-if="fullscreen == false" class="tool-button" rel="fullscreen" @click="fullscreen = true">
                    <i class="fas fa-expand"></i>
                </div>
                <div v-if="fullscreen == true" class="tool-button" rel="fullscreen" @click="fullscreen = false">
                    <i class="fas fa-compress"></i>
                </div>
            </template>
        </div>
        <div class="card-body">
            <slot></slot>
        </div>
        <div v-if="hasFooter" class="card-footer">
            <slot name="footer"></slot>
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
        defaultOpen: {
            type: [Boolean, null],
            default: null,
        },
    },
    data(){
        return {
            fullscreen: false,
            boxToggle: true,
        };
    },
    computed: {
        ...mapGetters([
        ]),
        showToggleButton(){
            const that = this;
            return typeof that.defaultOpen === "boolean";
        },
        showFullscreenBtn(){
            return !!this.$listeners.fullscreen;
        },
        hasFooter(){
            return Object.keys(this.$slots).includes('footer');
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
                this.boxToggle = true;
            } else {
                this.undoPageTitle();
            }
        },
    },
    created(){},
    mounted(){
        const that = this;
        if (typeof that.defaultOpen === "boolean"){
            that.boxToggle = that.defaultOpen;
        }
    },
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