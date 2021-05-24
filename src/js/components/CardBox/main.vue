<template>
    <div class="card" :class="{ fullscreen }">
        <div class="card-header">
            <div class="card-title" v-text="title"></div>
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

import { linkRegister } from 'lib/common/util';
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
    props: {
        title: {
            type: String,
            default: '未定名',
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
        fullscreen(){
            this.$emit('fullscreen', this.fullscreen);
        },
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