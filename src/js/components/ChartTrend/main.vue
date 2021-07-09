<template>
    <div v-if="records"
        class="chart-trend"
        :class="{ wait: !exposured || drawFlag }"
    >
        <div v-if="download && Object.keys(records).length > 0"
            class="trend-download-btn"
            @click="downloadFile"
        >
            <i class="icon-download"></i>
        </div>
        <canvas ref="canvas"></canvas>
        <i v-if="icon" class="icon" :class="icon"></i>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { string, trackJS, popup } from 'lib/common/util';
import Chart from 'chart.js';
import ChartAnnotation from 'chartjs-plugin-annotation';

import IntersectionObserverBox from 'lib/common/mixins/IntersectionObserverBox';

import { module_name, module_store } from './lib/store/index';


export default {
    components: {},
    filters: {},
    mixins: [IntersectionObserverBox],
    props: {
        title: {
            type: String,
            default: '',
        },
        records: {
            type: [Object, Boolean],
            default: false,
        },
        height: {
            type: [Boolean, Number],
            default: false,
        },
        tooltipTotal: {
            type: Boolean,
            default: true,
        },
        icon: {
            type: [Boolean, String],
            default: false,
        },
        newsTicker: {
            type: Array,
            default: () => [],
        },
        fullscreenToggle: {
            type: Boolean,
            default: false,
        },
        tooltipUsedPercent: {
            type: Boolean,
            default: false,
        },
        chartType: {
            type: String,
            default: 'line',
        },
        stacked: {
            type: Boolean,
            default: false,
        },
        download: {
            type: Boolean,
            default: false,
        },
    },
    data(){
        return {
            ChartJS: null,
            exposured: false,
            drawFlag: false,
        };
    },
    computed: {
        ...mapGetters({
            ChartColor: `${module_name}/ChartColor`,
            PageSetting_width: 'PageSetting_width',
        }),
    },
    watch: {
        PageSetting_width: {
            immediate: true,
            handler(){
                const that = this;
                that.draw();
            },
        },
        records: {
            immediate: true,
            handler(){
                const that = this;
                that.draw();
            },
        },
        height: {
            immediate: true,
            handler(){
                const that = this;
                that.draw();
            },
        },
        exposured: {
            handler(){
                const that = this;
                that.draw();
            },
        },
        fullscreenToggle: {
            handler(){
                const that = this;
                that.draw();
            },
        },
    },
    beforeCreate(){
        const that = this;
        if (!that.$store.state[module_name]) {
            that.$store.registerModule([module_name], module_store);
        }
    },
    created(){},
    mounted(){
        this.ChartTarget = this.$refs.canvas;
        // if (this.height !== false) {
        //     this.ChartTarget.height = this.height;
        // }
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        exposureAct(){
            this.exposured = true;
        },
        formatMoney(val){
            return val.toLocaleString();
        },
        draw(){
            const that = this;
            clearTimeout(that.drawTimer);
            if (that.exposured) {
                that.drawFlag = true;
                that.drawTimer = setTimeout(() => {
                    const { records } = that;
                    const { color } = Chart.helpers;

                    if (that.ChartJS !== null) {
                        that.ChartJS.destroy();
                    }


                    this.ChartTarget.height = this.calHeight();


                    const labels = [];
                    let datasets = {};

                    for (const label in records) {
                        labels.push(label);
                        const record = records[label];
                        // eslint-disable-next-line no-loop-func
                        Object.keys(record).forEach((key, index) => {
                            if (!datasets[key]) {
                                datasets[key] = {
                                    type: that.chartType,
                                    label: key,
                                    backgroundColor: color(that.ChartColor[index]).alpha(0.5).rgbString(),
                                    borderColor: that.ChartColor[index],
                                    borderWidth: 1,
                                    fill: false,
                                    data: [],
                                    pointRadius: 1,
                                };
                            }
                            datasets[key].data.push(record[key] || 0);
                        });
                    }

                    datasets = Object.values(datasets);

                    const customTooltips = function(tooltip){
                        let tooltipEl = that.$el.querySelector('#chartjs-tooltip');
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.innerHTML = '<table></table>';
                            this._chart.canvas.parentNode.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        if (tooltip.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        // Set caret Position
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if (tooltip.yAlign) {
                            tooltipEl.classList.add(tooltip.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }

                        function getBody(bodyItem){
                            return bodyItem.lines;
                        }

                        // Set Text
                        let cap = 0;
                        let used = 0;
                        if (tooltip.body) {
                            const titleLines = tooltip.title || [];
                            const bodyLines = tooltip.body.map(getBody);

                            let innerHtml = '<thead>';

                            titleLines.forEach((title) => {
                                innerHtml += `<tr><th colspan="3">${title}</th></tr>`;
                            });
                            innerHtml += '</thead><tbody>';
                            let total_value = 0;
                            bodyLines.forEach((body, i) => {
                                // console.log(body);
                                const colors = tooltip.labelColors[i];
                                let style = [];
                                style.push(`background:${colors.backgroundColor}`);
                                style.push(`border-color:${colors.borderColor}`);
                                style.push('border-width: 2px');
                                style.push('width: 16px;');
                                style.push('height: 16px');
                                style.push('display: inline-block');
                                style = style.join(';');

                                const span = `<span class="chartjs-tooltip-key" style="${style}"></span>`;
                                let [labelName, value] = body[0].split(': ');
                                if (that.tooltipUsedPercent) {
                                    switch (labelName) {
                                        case '可發電量':
                                            cap += parseFloat(value);
                                            break;
                                        case '已發電量':
                                            used += parseFloat(value);
                                            break;
                                        default:
                                            break;
                                    }
                                }

                                total_value += parseInt(value);
                                value = that.formatMoney(value);
                                innerHtml += `  <tr>
                                                <td>${span}</td><td style="white-space:nowrap;">${labelName}</td><td style='text-align: right; white-space:nowrap;'>${value} <small>MW</small></td>
                                            </tr>`;
                            });

                            if (that.tooltipTotal) {
                                total_value = that.formatMoney(total_value);


                                let style = [];
                                style.push('background: #EEE');
                                style.push('border-color: #EEE');
                                style.push('border-width: 2px');
                                style.push('width: 16px;');
                                style.push('height: 16px');
                                style.push('display: inline-block');
                                style = style.join(';');

                                const span = `<span class="chartjs-tooltip-key" style="${style}"></span>`;
                                innerHtml += `
                                <tr>
                                    <td>${span}</td><td>總額</td><td style='text-align: right;white-space:nowrap;'>${total_value} <small>MW</small></td>
                                </tr>
                            `;
                            }

                            if (that.tooltipUsedPercent) {
                                total_value = 0;
                                if (cap > 0) {
                                    total_value = (used / cap) * 100;
                                    total_value = total_value.toFixed(2);
                                }

                                let style = [];
                                style.push('background: #EEE');
                                style.push('border-color: #EEE');
                                style.push('border-width: 2px');
                                style.push('width: 16px;');
                                style.push('height: 16px');
                                style.push('display: inline-block');
                                style = style.join(';');

                                const span = `<span class="chartjs-tooltip-key" style="${style}"></span>`;
                                innerHtml += `
                                <tr>
                                    <td>${span}</td><td style="white-space:nowrap;">發電比</td><td style='text-align: right;white-space:nowrap;'>${total_value} <small>%</small></td>
                                </tr>
                                `;
                            }


                            innerHtml += '</tbody>';

                            const tableRoot = tooltipEl.querySelector('table');
                            tableRoot.innerHTML = innerHtml;
                        }

                        const positionY = this._chart.canvas.offsetTop;
                        const positionX = this._chart.canvas.offsetLeft;

                        // Display, position, and set styles for font
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.left = `${positionX + tooltip.caretX - 100}px`;
                        tooltipEl.style.top = '50%';
                        tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
                        tooltipEl.style.fontSize = `${tooltip.bodyFontSize}px`;
                        tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
                        tooltipEl.style.background = '#fafafa';
                        tooltipEl.style.border = '1px solid #999';
                        tooltipEl.style.borderRadius = '4px';
                        tooltipEl.style.padding = `${tooltip.yPadding}px ${tooltip.xPadding}px`;
                        tooltipEl.style.transform = 'translateY(-50%)';
                        tooltipEl.style.pointerEvents = 'none';
                    };


                    const annotation = [];

                    if (that.newsTicker.length > 0) {
                        const newsTickerColor = '#f03434';
                        that.newsTicker.forEach((info, index) => {
                            annotation.push({
                                type: 'line',
                                id: `vline_${index}`,
                                mode: 'vertical',
                                scaleID: 'x-axis-0',
                                value: labels.indexOf(info.date),
                                borderColor: color(newsTickerColor).alpha(0.8).rgbString(),
                                borderWidth: 1,
                                label: {
                                    enabled: true,
                                    position: 'top',
                                    content: 'ⓘ',
                                    backgroundColor: color(newsTickerColor).alpha(0.8).rgbString(),
                                    rotation: 90,
                                    fontSize: 8,
                                    cornerRadius: 3,
                                    xPadding: 3,
                                    yPadding: 3,
                                },
                                onClick(){
                                    popup.info({
                                        html: info.data.join('<br>'),
                                        showConfirmButton: false,
                                    });
                                    console.log(info.data);
                                },
                            });
                        });
                    }

                    const config = {
                        type: 'bar',
                        plugins: [ChartAnnotation],
                        data: {
                            labels,
                            datasets,
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: false,
                            },
                            tooltips: {
                                enabled: false,
                                intersect: false,
                                mode: 'index',
                                // position: 'nearest',
                                custom: customTooltips,
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true,
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    stacked: (!!that.stacked),
                                    scaleLabel: {
                                        display: true,
                                        labelString: '時間',
                                    },
                                    barPercentage: 0.5,
                                }],
                                yAxes: [{
                                    display: true,
                                    stacked: (!!that.stacked),
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'MW',
                                    },
                                    ticks: {
                                        // Include a dollar sign in the ticks
                                        callback(value, index, values){
                                            const val = string.carryFormatter(value);
                                            return val;
                                        },
                                    },
                                }],
                            },
                            annotation: {
                                events: ['click'],
                                drawTime: 'afterDatasetsDraw',
                                annotations: annotation,
                            },
                        },
                    };


                    const ctx = that.ChartTarget.getContext('2d');
                    that.ChartJS = new Chart(ctx, config);
                    that.drawFlag = false;


                    // trackJS.gtag('event', 'ChartTrend_draw', {
                    //     title: this.title,
                    // });
                    // trackJS.mixpanel('ChartTrend_draw', {
                    //     title: this.title,
                    // });
                }, 500);
            }
        },
        calHeight(){
            const that = this;
            clearTimeout(that.initTimer);

            const { PageSetting_mode_type, records } = that;
            let height = 100;

            if (!!this.$el && !!this.$el.offsetWidth && records) {
                const { offsetWidth } = this.$el;
                if (offsetWidth > 1100) {
                    height = 70;
                } else if (offsetWidth > 1000) {
                    height = 80;
                } else if (offsetWidth > 700) {
                    height = 100;
                } else if (offsetWidth > 600) {
                    height = 150;
                } else if (offsetWidth > 500) {
                    height = 170;
                } else if (offsetWidth > 400) {
                    height = 200;
                } else if (offsetWidth > 300) {
                    height = 400;
                } else {
                    height = 500;
                }

                if (PageSetting_mode_type === 'mobile') {
                    const labelCount = Object.keys(Object.values(records)[0]).length;
                    height += parseInt(labelCount / 4) * 15;
                }

                if (that.fullscreenToggle) {
                    height += 40;
                }

                if (height >= window.innerHeight * (1 / 2)) {
                    height = window.innerHeight * (1 / 2);
                }
            }
            return height;
        },
        downloadFile(){
            const that = this;
            const csvName = `台灣電廠即時資訊_${that.title}_${new Date().getTime()}.csv`;
            const records = [];

            const dateLabels = Object.keys(that.records);
            if (dateLabels.length > 0) {
                const header = ['日期'];
                const columns = [];
                Object.keys(that.records[dateLabels[0]]).forEach((key) => {
                    header.push(key.replace(/\#/ig, '＃'));
                    columns.push(key);
                });
                records.push(header);

                dateLabels.forEach((dateLabel) => {
                    const record = [dateLabel];
                    columns.forEach((key) => {
                        record.push(that.records[dateLabel][key]);
                    });
                    records.push(record);
                });
            }

            const csvContent = `data:text/csv;charset=utf-8,${records.map(e => e.join(',')).join('\n')}`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', csvName);
            document.body.appendChild(link);
            link.click();
            trackJS.gtag('event', 'chart_trend_download', {
                title: that.title,
                type: 'csv',
            });
            trackJS.mixpanel('chart_trend_download', {
                title: that.title,
                type: 'csv',
            });
            setTimeout(() => {
                document.body.removeChild(link);
            }, 60000);
        },
    },
};
</script>
<style lang="scss" scoped>
</style>