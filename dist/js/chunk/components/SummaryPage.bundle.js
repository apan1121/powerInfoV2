(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{110:function(e,t,o){"use strict";(function(e){var s=o(3),a=o(0),n=o.n(a),r=o(167),i=o(33);t.a={components:{VueRangeSlider:r.a},filters:{},props:{minDateTime:{type:Number,default:0},maxDateTime:{type:Number,default:0},chooseRange:{type:Array,default:()=>[0,0]},chooseListType:{type:String,default:""}},data:()=>({chooseRangeVal:[0,0],chooseListTypeVal:"box",moving:!1,listTypeOption:{list:"fas fa-list",box:"fas fa-th-large"}}),computed:{...Object(s.c)([])},watch:{chooseRange:{immediate:!0,handler(){JSON.stringify(this.chooseRangeVal)!==JSON.stringify(this.chooseRange)&&(this.chooseRangeVal=JSON.parse(JSON.stringify(this.chooseRange)))}},chooseRangeVal:{deep:!0,handler(){this.triggerChooseRangeVal()}},moving:{handler(){this.triggerChooseRangeVal()}},chooseListType:{immediate:!0,handler(){this.chooseListType!==this.chooseListTypeVal&&(this.chooseListTypeVal=this.chooseListType)}},chooseListTypeVal:{immediate:!0,handler(){this.chooseListType!==this.chooseListTypeVal&&this.$emit("update:choose-list-type",this.chooseListTypeVal)}}},created(){},mounted(){const t=this;e(t.$refs.range).on("mousedown touchstart",()=>{t.moving=!0}),e(t.$refs.range).on("mouseup touchend",()=>{t.moving=!1})},updated(){},destroyed(){},methods:{...Object(s.b)({}),...Object(s.d)({openFilterBox:i.a+"/openFilterBox"}),formatter:e=>n()(parseInt(e)).format("YYYY-MM-DD HH:mm:ss"),openFilter(){this.openFilterBox(!0)},changeListType(){const e=Object.keys(this.listTypeOption);let t=e.indexOf(this.chooseListTypeVal);t=(t+1)%e.length,this.chooseListTypeVal=e[t]},triggerChooseRangeVal(){const e=this;!1===e.moving&&JSON.stringify(e.chooseRangeVal)!==JSON.stringify(e.chooseRange)&&(clearTimeout(e.chooseRangeValTimer),e.chooseRangeValTimer=setTimeout(()=>{const t=JSON.parse(JSON.stringify(e.chooseRangeVal));e.$emit("update:choose-range",t)},300))}}}}).call(this,o(16))},33:function(e,t,o){"use strict";o.d(t,"a",(function(){return c})),o.d(t,"b",(function(){return l}));var s=o(2),a=o(34);const n=s.a.get("API_CONFIG.API_HOST"),r={...a.a,getSummaryInfo(e){const t=`${n}log/summary.log?t=${(new Date).getTime()}`;return r.run(t,"GET",e)},getMaxUsedInfo(e){const t=`${n}log/maxUsed.log?t=${(new Date).getTime()}`;return r.run(t,"GET",e)}};var i=r;const c="Page/SummaryPage",l={state:()=>({openFilterFlag:!1,summaryInfo:{},maxUsedInfo:{}}),mutations:{openFilterBox(e,t){e.openFilterFlag=!!t},setSummaryInfo(e,t){t=s.e.sortObject(t),e.summaryInfo=t},setMaxUsedInfo(e,t){t=s.e.sortObject(t),e.maxUsedInfo=t}},actions:{getSummaryInfo:({commit:e},t)=>new Promise((o,s)=>{i.getSummaryInfo(t).success(t=>{e("setSummaryInfo",t),o(t)}).error(e=>{s(e)})}),getMaxUsedInfo:({commit:e},t)=>new Promise((o,s)=>{i.getMaxUsedInfo(t).success(t=>{e("setMaxUsedInfo",t),o(t)}).error(e=>{s(e)})})},getters:{openFilterFlag:e=>e.openFilterFlag,summaryInfo:e=>e.summaryInfo,maxUsedInfo:e=>e.maxUsedInfo},namespaced:!0}},543:function(e,t,o){"use strict";o.r(t);var s=function(){var e=this,t=e._self._c;return t("div",{staticClass:"summary-page"},[t("div",{staticClass:"row"},[t("div",{staticClass:"col-12 mb-3"},[e.diffTrend?t("chart-trend-box",{attrs:{title:"日用量比較","tooltip-total":!1,"tooltip-used-percent":!1,records:e.diffTrend,icon:"icon-calendar"}}):e._e()],1)]),e._v(" "),t("div",{staticClass:"row"},[t("div",{staticClass:"col-12 mb-3"},[e.maxUsedTrend?t("chart-trend-box",{attrs:{title:"最大用量趨勢","tooltip-total":!0,"tooltip-used-percent":!1,records:e.maxUsedTrend,icon:"icon-amount","chart-type":"bar",stacked:!0}}):e._e()],1)]),e._v(" "),t("summary-filter",{attrs:{"choose-range":e.chooseRange,"choose-list-type":e.chooseListType,"min-date-time":e.minDateTime,"max-date-time":e.maxDateTime},on:{"update:chooseRange":function(t){e.chooseRange=t},"update:choose-range":function(t){e.chooseRange=t},"update:chooseListType":function(t){e.chooseListType=t},"update:choose-list-type":function(t){e.chooseListType=t}}}),e._v(" "),t("div",{staticClass:"row"},[e.chooseTypeTotalTrend?t("div",{key:"range_total",staticClass:"mb-3",class:e.listColClass},[e.chooseTypeTotalTrend?t("chart-trend-box",{attrs:{title:"區間總運轉",records:e.chooseTypeTotalTrend,icon:"icon icon-power","row-col":"pc"===e.PageSetting_mode_type&&"box"===e.chooseListType?2:1,"tooltip-total":!1,"tooltip-used-percent":!0}}):e._e()],1):e._e(),e._v(" "),e.chooseTypeGroupTotalTrend?t("div",{key:"range_type_group_total",staticClass:"mb-3",class:e.listColClass},[e.chooseTypeGroupTotalTrend?t("chart-trend-box",{attrs:{title:"能源類型","tooltip-total":!0,"tooltip-used-percent":!1,records:e.chooseTypeGroupTotalTrend,icon:"icon icon-power","chart-type":"bar",stacked:!0}}):e._e()],1):e._e(),e._v(" "),e._l(e.chooseTypeTrend,(function(o,s){return[t("div",{key:o.typeKey,staticClass:"mb-3",class:e.listColClass},[e.diffTrend?t("chart-trend-box",{attrs:{title:e.lang.type[o.typeKey],records:o.record,icon:"icon icon-"+o.typeKey.replace(/\s/gi,"_"),"row-col":"pc"===e.PageSetting_mode_type&&"box"===e.chooseListType?2:1,"tooltip-total":!1,"tooltip-used-percent":!0},scopedSlots:e._u([{key:"footer",fn:function(){return[t("div",{staticClass:"text-right"},[t("strong",[e._v("平均"+e._s(e.lang.summaryBox.CapacityFactor))]),e._v("\n                            : "+e._s(o.avgCapacityFactor)+"\n                            "),t("small",[e._v("%")])])]},proxy:!0}],null,!0)}):e._e()],1),e._v(" "),s%6==3?[t("div",{key:"Summary_Ads_"+s,staticClass:"col-12 mb-3",attrs:{id:"Summary_Ads_"+s}},[t("summary-ads-box")],1)]:e._e()]}))],2),e._v(" "),e.openFilterFlag?[t("unit-filter-box",{attrs:{type:!0,sort:!1},on:{"open-filter-box":e.openFilterBoxAct}})]:e._e()],2)};s._withStripped=!0;var a=o(3),n=(o(395),o(0)),r=o.n(n),i=o(15),c=o(2),l=o(33),d=function(){var e=this,t=e._self._c;return t("div",{staticClass:"summary-filter"},[t("div",{ref:"range",staticClass:"summary-item",attrs:{rel:"range"}},[t("vue-range-slider",{attrs:{min:e.minDateTime,max:e.maxDateTime,formatter:e.formatter,"tooltip-merge":!0,"enable-cross":!1,step:6e5},model:{value:e.chooseRangeVal,callback:function(t){e.chooseRangeVal=t},expression:"chooseRangeVal"}})],1),e._v(" "),t("div",{staticClass:"summary-item",attrs:{rel:"filter"}},[t("button",{staticClass:"btn btn-secondary btn-sm",attrs:{type:"button"},on:{click:e.openFilter}},[t("i",{staticClass:"fas fa-filter"})]),e._v(" "),t("button",{staticClass:"btn btn-secondary btn-sm",attrs:{type:"button"},on:{click:e.changeListType}},[t("i",{class:e.listTypeOption[e.chooseListTypeVal]})])])])};d._withStripped=!0;var m=o(110).a,p=o(4),h=Object(p.a)(m,d,[],!1,null,"b4a55740",null).exports,f=function(){var e=this._self._c;return e("card-box",{attrs:{title:"廣告"}},[e("div",{ref:"ads",staticClass:"power-info-promote",class:{"ad-blocked":this.adBlocked}},[e("ins",{staticClass:"adsbygoogle",staticStyle:{display:"block"},attrs:{"data-ad-format":"fluid","data-ad-layout-key":"-fb+5w+4e-db+86","data-ad-client":"ca-pub-3068501078221920","data-ad-slot":"1897408904"}})])])};f._withStripped=!0;var y={components:{CardBox:()=>o.e(2).then(o.bind(null,173))},filters:{},props:{},data:()=>({}),computed:{...Object(a.c)(["adBlocked"])},watch:{},beforeCreate(){},created(){},mounted(){setTimeout(()=>{(window.adsbygoogle=window.adsbygoogle||[]).push({})},500)},updated(){},destroyed(){},methods:{...Object(a.b)({}),...Object(a.d)({})}},g=Object(p.a)(y,f,[],!1,null,"3078e7ba",null).exports;r.a.locale("zh-tw"),c.b.register([{rel:"stylesheet",type:"text/css",href:"/dist/css/page/summary-page.css"}]);var u={components:{ChartTrendBox:()=>o.e(4).then(o.bind(null,551)),UnitFilterBox:()=>Promise.all([o.e(6),o.e(0)]).then(o.bind(null,550)),SummaryFilter:h,SummaryAdsBox:g},filters:{},mixins:[i.a],props:{},data:()=>({diffTrend:!1,powerTypeTrend:!1,maxUsedTrend:!1,chooseTypeGroupTotalTrend:!1,chooseTypeTrend:!1,chooseTypeTotalTrend:!1,maxUsedTrendMonth:6,minDateTime:0,maxDateTime:0,chooseRange:[0,0],chooseListType:"list",maxHeight:100,initFlag:!0}),computed:{...Object(a.c)({summaryInfo:l.a+"/summaryInfo",maxUsedInfo:l.a+"/maxUsedInfo",openFilterFlag:l.a+"/openFilterFlag",chooseTypes:"chooseTypes",lang:"lang",PageSetting_mode_type:"PageSetting_mode_type",typeGroupList:"typeGroupList"}),normalHeight(){let e=100;if("mobile"===this.PageSetting_mode_type)e=130;else switch(this.chooseListType){case"box":e=100;break;case"list":e=60}return e},listColClass(){let e="col-12 col-md-6";switch(this.chooseListType){case"box":e="col-12 col-md-6";break;case"list":e="col-12"}return e}},watch:{summaryInfo:{handler(e,t){JSON.stringify(e)!==JSON.stringify(t)&&this.$nextTick(()=>{this.init(),this.calcDiffTrend(),this.calPowerTypeTrend()})}},maxUsedInfo:{handler(e,t){JSON.stringify(e)!==JSON.stringify(t)&&this.$nextTick(()=>{this.calcMaxUsedTrend()})}},chooseTypes:{immediate:!0,handler(){this.$nextTick(()=>{console.log("chooseTypes calPowerTypeTrend"),this.calPowerTypeTrend()})}},chooseRange:{handler(){this.$nextTick(()=>{this.initFlag||(console.log("chooseRange calcDiffTrend"),this.calPowerTypeTrend(),c.f.gtag("event","chooseSummaryRange",{range:this.chooseRange}),c.f.mixpanel("chooseSummaryRange",{range:this.chooseRange})),this.initFlag=!1})}},chooseListType:{handler(){this.$nextTick(()=>{this.calPowerTypeTrend(),c.f.gtag("event","chooseListType",{listType:this.chooseListType}),c.f.mixpanel("chooseListType",{listType:this.chooseListType})})}},maxUsedTrend:{handler(){this.maxUsedTrend&&this.setSEO()}}},beforeCreate(){const e=this;e.$store.state[l.a]||e.$store.registerModule([l.a],l.b)},created(){c.d.loading({title:"讀取中"})},mounted(){this.setSEO(),c.f.gtag("event","page_view",{page_id:"SummaryPage"}),c.f.mixpanel("page_view",{page_id:"SummaryPage"}),this.getSummaryInfo(),this.getMaxUsedInfo()},updated(){},destroyed(){this.setSummaryInfo({}),this.setMaxUsedInfo({}),this.initFlag=!0,this.chooseRange=[0,0]},methods:{...Object(a.b)({}),...Object(a.d)({openFilterBox:l.a+"/openFilterBox",setSummaryInfo:l.a+"/setSummaryInfo",setMaxUsedInfo:l.a+"/setMaxUsedInfo"}),setSEO(){const e=this;clearTimeout(e.setSEOTimer),e.setSEOTimer=setTimeout(()=>{const t=Object.keys(e.maxUsedInfo).pop();let{maxUsed:o,time:s,record:a}=JSON.parse(JSON.stringify(e.maxUsedInfo[t]));s=r()(s).format("HH:mm");let n=[];for(const t in a)n.push({name:e.lang.type[t],used:a[t]});n=n.sort((e,t)=>e.used<t.used?1:e.used===t.used?0:-1);const i=n.splice(0,5).map((e,t)=>{const o=e.used.toLocaleString();return`第${t+1}名為${e.name}產生 ${o} MW`}).join("，");o=o.toLocaleString(),e.setPageSEO({title:"分析摘要",description:`本日 ${t} 在 ${s} 台灣電廠產生了本日最大電量 ${o} MW，此時段產生的電力前五名分別是${i}。`})},200)},getSummaryInfo(){this.$store.dispatch(l.a+"/getSummaryInfo").then(()=>{c.d.close()},()=>{c.d.close()})},getMaxUsedInfo(){this.$store.dispatch(l.a+"/getMaxUsedInfo").then(()=>{c.d.close()},()=>{c.d.close()})},formatter:e=>r()(parseInt(e)).format("YYYY-MM-DD HH:mm:ss"),init(){const e=Object.keys(this.summaryInfo),t=parseInt(r()(e[0]).format("x")),o=parseInt(r()(e[e.length-1]).format("x")),s=[o-2592e5,o];this.minDateTime=t,this.maxDateTime=o,this.chooseRange=s},calcMaxUsedTrend(){const e=this;e.calcMaxUsedTrendTimer=setTimeout(()=>{const t=JSON.parse(JSON.stringify(e.maxUsedInfo)),o=Object.keys(t).pop(),s=r()(o).add(-1*e.maxUsedTrendMonth,"month").format("YYYY-MM-DD"),a=parseInt(r()(s).format("X")),n=parseInt(r()(o).format("X")),i=Object.keys(e.lang.type),c={};for(let o=a;o<=n;o+=86400){const s=r()(1e3*o).format("YYYY-MM-DD");if(t[s]){const{time:o,record:a}=t[s],n=r()(o).format("MM-DD HH:mm"),l={};i.forEach(t=>{l[e.lang.type[t]]=a[t]||0}),c[n]=l}}e.maxUsedTrend=c},500)},calcDiffTrend(){const e=this;console.log("calcDiffTrend");Object.keys(e.summaryInfo).length>0&&(clearTimeout(e.calcDiffTrendTimer),e.calcDiffTrendTimer=setTimeout(()=>{const t=parseInt(r()(r()().format("YYYY-MM-DD")).format("x")),o=parseInt(r()(t).add(1,"days").format("x")),s=r()(t).add(-13,"days").format("YYYY-MM-DD"),a=parseInt(r()(s).format("x")),n={},i=r()().format("ww");for(let e=0;e<14;e+=1){const t=a+864e5*e,o=r()(t),s=o.format("YYYY-MM-DD");let c=o.format("ddd");const l=o.format("ww");for(let e=0;e<i-l;e+=1)c="上"+c;n[s]=c}const c={},l=r()(r()().format("YYYY-MM-DD HH:mm:00")).format("x")-6e5;for(let s=t;s<o;s+=6e5){const t=r()(s).format("HH:mm");c[t]={};for(let o=0;o<14;o+=1){const s=r()(a+864e5*o).format("YYYY-MM-DD");let i=!1;const d=`${s} ${t}`;if(r()(d+":00").format("x")<l&&(i=0,e.summaryInfo[d])){const o=JSON.parse(JSON.stringify(e.summaryInfo[`${s} ${t}`]));for(const e in o)o[e]&&(i+=parseFloat(o[e].used))}if(!1!==i){const e=n[s];c[t][e]=Math.round(100*i)/100}}}e.diffTrend=c},500))},calPowerTypeTrend(){const e=this;console.log("calPowerTypeTrend"),c.d.loading({title:"計算中"}),e.chooseTypeTrend=!1,e.chooseTypeTotalTrend=!1,e.chooseTypeGroupTotalTrend=!1;Object.keys(e.summaryInfo).length>0&&(clearTimeout(e.calPowerTypeTrendTimer),e.calPowerTypeTrendTimer=setTimeout(()=>{const t=JSON.parse(JSON.stringify(e.summaryInfo)),o=JSON.parse(JSON.stringify(e.chooseTypes)),s=JSON.parse(JSON.stringify(e.lang.usedType)),a=Object.keys(s),n=JSON.parse(JSON.stringify(e.lang.typeGroup)),i=Object.values(n),l=JSON.parse(JSON.stringify(e.typeGroupList)),d={};for(const e in l)l[e].forEach(t=>{d[t]=n[e]||e});const m={},p={},[h,f]=e.chooseRange,y=[];if(o.forEach(e=>{const o={},n=d[e];for(let c=h;c<=f;c+=6e5){const l=r()(c).format("YYYY-MM-DD HH:mm"),d=r()(c).format("MM-DD HH:mm");if(!m[d]){m[d]={};for(const e of a){const t=s[e];m[d][t]=0}}if(!p[d]){p[d]={};for(const e of i)p[d][e]=0}const h={};for(const e of a){const t=s[e];h[t]=0}t[l]&&t[l][e]&&(a.forEach(o=>{const a=s[o];h[a]=parseFloat(t[l][e][o]),m[d][a]+=h[a]}),p[d][n]+=parseFloat(t[l][e].used)),o[d]=h}let c=Object.values(o);const{cap:l,used:g}=s;c=c.filter(e=>e[l]>0).map(e=>e[g]/e[l]);let u=0;c.length>0&&(u=c.reduce((e,t)=>e+t,0)/c.length,u=parseFloat((100*u).toFixed(2))),y.push({typeKey:e,record:o,avgCapacityFactor:u})}),m)for(const e in m)for(const t of a){const o=s[t];m[e][o]=parseFloat((m[e][o]+0).toFixed(2))}if(p)for(const e in p)for(const t of i)p[e][t]=parseFloat((p[e][t]+0).toFixed(2));e.chooseTypeGroupTotalTrend=p,e.chooseTypeTotalTrend=m,e.chooseTypeTrend=y,c.d.close()},1e3))},openFilterBoxAct(e){this.openFilterBox(e)}}},T=Object(p.a)(u,s,[],!1,null,"18afab40",null);t.default=T.exports}}]);