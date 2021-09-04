<template>
    <div id="unit-info-box" class="modal" tabindex="-1"
        role="dialog" aria-labelledby="unitInfoBox" aria-hidden="true"
    >
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        機組資訊
                    </h5>
                    <button type="button" class="close" data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <unit-info :unit-key="unitKey"></unit-info>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { trackJS } from 'lib/common/util';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import moment from 'moment';
import PageMixin from 'lib/common/mixins/PageMixin';

import { module_name, module_store } from './lib/store/index';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        UnitInfo: () => import('components/UnitInfo/main.vue'),
    },
    filters: {},
    mixins: [PageMixin],
    props: {
        unitKey: {
            type: String,
            default: '',
        },
    },
    data(){
        return {
            formatRecord: false,
        };
    },
    computed: {
        ...mapGetters({
            lang: 'lang',
            record: `${module_name}/record`,
            RecordTime: 'RecordTime',
            FormatUnits: 'FormatUnits',
            NoticeRecord: 'NoticeRecord',
            adBlocked: 'adBlocked',
        }),
        UnitInfo(){
            const that = this;
            const FormatUnits = JSON.parse(JSON.stringify(that.FormatUnits));
            let unitInfo = false;
            if (FormatUnits[that.unitKey]) {
                unitInfo = FormatUnits[that.unitKey];
            }
            return unitInfo;
        },
        filterNoticeRecord(){
            const that = this;
            const { status } = this.lang;
            let record = {};
            that.NoticeRecord.forEach((info) => {
                if (info.unitKey === this.unitKey && info.oldVal !== info.newVal) {
                    if (!record[info.recordTime]) {
                        const dateKey = moment(info.recordTime).format('MM-DD HH:mm');
                        record[info.recordTime] = {
                            date: dateKey,
                            data: [],
                        };
                    }

                    let notice = '';
                    const { oldVal, newVal, note } = info;
                    switch (info.diff_type) {
                        case 'note':
                            notice = `備註：<b>${oldVal || '--'}</b> > <b>${newVal || '--'}</b>`;
                            break;
                        case 'status':
                            notice = `狀態：<b>${status[oldVal] || '--'}</b> > <b>${status[newVal] || '--'}</b>`;
                            break;
                        case 'used':
                            notice = `使用量：<b>${note}</b>`;
                            break;
                        default:
                            console.log(info.diff_type);
                            break;
                    }
                    record[info.recordTime].data.push(notice);
                }
            });

            record = Object.values(record);
            return record;
        },
    },
    watch: {
        unitKey: {
            immediate: true,
            handler(){
            },
        },
    },
    beforeCreate(){
        const that = this;
        if (!this.$store.state[module_name]) {
            this.$store.registerModule([module_name], module_store);
        }
    },
    created(){},
    mounted(){
        const that = this;

        $(this.$el).on('shown.bs.modal', () => {
            trackJS.gtag('event', 'UnitInfoBox_open', {
                unitKey: this.unitKey,
            });
            trackJS.mixpanel('UnitInfoBox_open', {
                unitKey: this.unitKey,
            });
        });


        $(this.$el).on('hidden.bs.modal', () => {
            that.$emit('close');
            that.formatRecord = false;
            if (!!this.$route.query && !!this.$route.query.unit_key) {
                this.$router.push({ name: 'UnitPage' });
            }

            trackJS.gtag('event', 'UnitInfoBox_close', {
                unitKey: this.unitKey,
            });
            trackJS.mixpanel('UnitInfoBox_close', {
                unitKey: this.unitKey,
            });

            this.undoPageTitle();
        });

        $('.modal').modal('hide');

        $(this.$el).modal('show');
    },
    updated(){},
    destroyed(){

    },
    methods: {
        ...mapActions({}),
        ...mapMutations({
        }),
    },
};
</script>
<style lang="scss" scoped>
</style>