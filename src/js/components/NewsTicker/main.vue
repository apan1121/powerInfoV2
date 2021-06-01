<template>
    <div class="news-ticker">
        <div class="news-ticker-wrapper" @click.stop="openNewsTicker">
            <div class="news-ticker-title">
                快訊
            </div>
            <div ref="newsTickerContent" class="news-ticker-content">
                <template v-if="!!showNewsList[0]">
                    <div :key="showNewsList[0].key" ref="firstItem" class="news-ticker-content-item">
                        <span v-if="showNewsList[0].is_new" class="is-new">New</span>
                        <span class="record-time">{{ showNewsList[0].record_time }}</span>
                        <span class="unit-key" @click.stop="openUnitInfo(showNewsList[0].unitKey)">{{ showNewsList[0].name }}</span>
                        <span class="diff-type">{{ diffTypeMapping[showNewsList[0].diff_type] }}</span>
                        <span v-html="showNewsList[0].text"></span>
                    </div>
                </template>
                <template v-if="!!showNewsList[1]">
                    <div :key="showNewsList[1].key" class="news-ticker-content-item">
                        <span v-if="showNewsList[1].is_new" class="is-new">New</span>
                        <span class="record-time">{{ showNewsList[1].record_time }}</span>
                        <span class="unit-key" @click.stop="openUnitInfo(showNewsList[0].unitKey)">{{ showNewsList[1].name }}</span>
                        <span class="diff-type">{{ diffTypeMapping[showNewsList[1].diff_type] }}</span>
                        <span v-html="showNewsList[1].text"></span>
                    </div>
                </template>
            </div>
        </div>

        <div v-if="NoticeRecord.length > 0" ref="NewsTickerModal" class="modal"
            tabindex="-1" role="dialog"
        >
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            異動快訊
                        </h5>
                        <button type="button" class="close" data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-striped">
                            <tbody>
                                <template v-for="(record, key) in NoticeRecord">
                                    <template v-if="key % 10 === 0">
                                        <tr :key="`header_${key}`">
                                            <th scope="col" class="text-center">
                                                時間
                                            </th>
                                            <th scope="col" class="text-center">
                                                機組名稱
                                            </th>
                                            <th scope="col" class="text-center">
                                                發電類型
                                            </th>
                                            <th scope="col" class="text-center">
                                                變動項目
                                            </th>
                                            <th scope="col" class="text-center">
                                                舊值
                                            </th>
                                            <th scope="col" class="text-center">
                                                新值
                                            </th>
                                            <th scope="col" class="text-center">
                                                備註
                                            </th>
                                        </tr>
                                    </template>

                                    <tr :key="key">
                                        <th scope="row" class="text-center" v-html="record.recordTime.replace(&quot; &quot;, &quot;<br>&quot;)">
                                        </th>
                                        <td class="text-center">
                                            {{ record.name }}
                                        </td>
                                        <td class="text-center">
                                            {{ lang.type[record.type] }}
                                        </td>
                                        <td class="text-center">
                                            {{ diffTypeMapping[record.diff_type] }}
                                        </td>
                                        <td class="text-center">
                                            <template v-if="record.diff_type ==='used'">
                                                {{ record.oldVal }} <small>MW</small>
                                            </template>
                                            <template v-else>
                                                {{ powerStatusMapping[record.oldVal] || record.oldVal || '--' }}
                                            </template>
                                        </td>
                                        <td class="text-center">
                                            <template v-if="record.diff_type ==='used'">
                                                {{ record.newVal }} <small>MW</small>
                                            </template>
                                            <template v-else>
                                                {{ powerStatusMapping[record.newVal] || record.newVal || '--' }}
                                            </template>
                                        </td>
                                        <td>{{ record.note }}</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment';

import { mapActions, mapMutations, mapGetters } from 'vuex';
import { localStorage } from 'lib/common/util';

import { module_name, module_store } from './lib/store/index';


// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {},
    filters: {},
    props: {},
    data(){
        return {
            NewsIndex: 0,
            waitTime: 5000,
            noticeRecordListReadTime: 0,
            NoticeRecordFormat: [],
            NewsLimit: 5,
            diffTypeMapping: {
                used: '發電',
                status: '機組狀態',
                note: '備註',
            },
            powerStatusMapping: {
                online: '商轉中',
                break: '故障機組',
                limit: '限轉機組',
                fix: '待修機組',
            },
        };
    },
    computed: {
        ...mapGetters({
            lang: 'lang',
            NoticeRecord: `${module_name}/NoticeRecord`,
        }),
        showNewsList(){
            const that = this;
            const showNewsList = [];

            if (!!that.NoticeRecordFormat[that.NewsIndex] && 1) {
                showNewsList.push(that.NoticeRecordFormat[that.NewsIndex]);

                let nextNewsIndex = (that.NewsIndex + 1) % that.NoticeRecordFormat.length;
                if (!that.NoticeRecordFormat[that.NewsIndex]) {
                    nextNewsIndex = 0;
                }
                showNewsList.push(that.NoticeRecordFormat[nextNewsIndex]);
            }

            return showNewsList;
        },
    },
    watch: {
        NoticeRecord(){
            const that = this;
            if (that.NoticeRecord.length > 0) {
                const NoticeRecordFormat = [];
                for (let i = 0; i < that.NoticeRecord.length; i++) {
                    const item = that.NoticeRecord[i];
                    let text = '';
                    const is_new = moment(item.recordTime).format('X') > that.noticeRecordListReadTime;
                    const record_time = moment(item.recordTime).format('MM-DD HH:mm');
                    const name = `${item.name}`;
                    const diff_type = `${item.diff_type}`;
                    const unitKey = `${item.unitKey}`;

                    let { oldVal, newVal } = item;

                    oldVal = oldVal || '--';
                    newVal = newVal || '--';

                    switch (item.diff_type) {
                        case 'used':
                            oldVal = `${item.oldVal} <small>MW</small>`;
                            newVal = `${item.newVal} <small>MW</small>`;
                            break;
                        case 'status':
                            oldVal = that.powerStatusMapping[oldVal];
                            newVal = that.powerStatusMapping[newVal];
                            break;
                        default:
                            break;
                    }

                    text = `${oldVal} -> ${newVal}`;
                    if (!!item.note && 1) {
                        text = `${text}；${item.note}`;
                    }

                    NoticeRecordFormat.push({ key: i, diff_type, name, unitKey, text, is_new, record_time });
                    if (NoticeRecordFormat.length > that.NewsLimit) {
                        break;
                    }
                }
                that.NoticeRecordFormat = NoticeRecordFormat;
            }
        },
        showNewsList(){
            const that = this;

            that.$nextTick(() => {
                that.$refs.firstItem.addEventListener('animationend', () => {
                    clearTimeout(that.animationendTimer);
                    that.animationendTimer = setTimeout(() => {
                        that.goToNext();
                    }, 10);
                }, true);
            });

            that.runNewsTicker();
        },
    },
    beforeCreate(){
        if (!this.$store.state[module_name]) {
            this.$store.registerModule([module_name], module_store);
        }
    },
    created(){},
    mounted(){
        const that = this;
        that.noticeRecordListReadTime = localStorage.get('noticeRecordListReadTime', 0);

        that.loadNoticeRecord();
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
            chooseUnitByKey: 'chooseUnitByKey',
        }),
        loadNoticeRecord(){
            const that = this;
            that.$store.dispatch(`${module_name}/loadNoticeRecord`).then(() => {

            }, () => {});
        },
        runNewsTicker(){
            const that = this;

            that.runNewsTickerTimer = setTimeout(() => {
                $(that.$refs.newsTickerContent).addClass('run');
            }, that.waitTime);
        },
        goToNext(){
            const that = this;
            that.NewsIndex = (that.NewsIndex + 1) % that.NoticeRecordFormat.length;
            $(that.$refs.newsTickerContent).removeClass('run');
            that.runNewsTicker();
        },
        openUnitInfo(unitKey){
            this.chooseUnitByKey(unitKey);
        },
        openNewsTicker(bool){
            $(this.$refs.NewsTickerModal).modal('show');
        },
    },
};
</script>
<style scoped>
.table{
    font-size: 12px;
}
</style>