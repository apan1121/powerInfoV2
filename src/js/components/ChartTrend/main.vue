<template>
    <div v-if="records">
        <canvas ref="canvas"></canvas>
    </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { string } from 'lib/common/util';
import Chart from 'chart.js';
// import ChartAnnotation from 'chartjs-plugin-annotation';

import { module_name, module_store } from './lib/store/index';
// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {},
    filters: {},
    props: {
        records: {
            type: [Object, Boolean],
            default: false,
        },
        formatX: {
            type: Function,
            default: (val) => {

            },
        },
    },
    data(){
        return {
            ChartJS: null,
        };
    },
    computed: {
        ...mapGetters({
            ChartColor: `${module_name}/ChartColor`,
        }),
    },
    watch: {
        records: {
            immediate: true,
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
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({}),
        formatMoney(val){
            return val.toLocaleString();
        },
        draw(){
            const that = this;
            clearTimeout(that.drawTimer);

            that.drawTimer = setTimeout(() => {
                const { records } = that;
                const { color } = Chart.helpers;

                if (that.ChartJS !== null) {
                    that.ChartJS.destroy();
                }

                const labels = [];
                let datasets = {};

                for (const label in records) {
                    labels.push(label);
                    const record = records[label];
                    // eslint-disable-next-line no-loop-func
                    Object.keys(record).forEach((key, index) => {
                        if (!datasets[key]) {
                            datasets[key] = {
                                type: 'line',
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
                            let [ labelName, value] = body[0].split(': ');
                            total_value += parseInt(value);
                            value = that.formatMoney(value);
                            innerHtml += `  <tr>
                                                <td>${span}</td><td>${labelName}</td><td style='text-align: right'>${value} <small>MW</small></td>
                                            </tr>`;
                        });
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
                                <td>${span}</td><td>總額</td><td style='text-align: right'>${total_value} <small>MW</small></td>
                            </tr>
                        `;

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


                const config = {
                    type: 'bar',
                    plugins: [],
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
                                scaleLabel: {
                                    display: true,
                                    labelString: '時間',
                                },
                                barPercentage: 0.5,
                            }],
                            yAxes: [{
                                display: true,
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
                    },
                };


                const ctx = that.ChartTarget.getContext('2d');
                that.ChartJS = new Chart(ctx, config);
            }, 200);
        },
    },
};
</script>
<style lang="scss" scoped>
</style>