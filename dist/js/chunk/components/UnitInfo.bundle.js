(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{103:function(t,e,o){"use strict";o.d(e,"a",(function(){return l})),o.d(e,"b",(function(){return d}));var i=o(2),s=o(34);const a=i.a.get("API_CONFIG.API_HOST"),n={...s.a,getUnitRecord(t){const e=t.unitKey.replace("#","%23"),o=`${a}log/record/${e}.log?t=${(new Date).getTime()}`;return n.run(o,"GET")}};var c=n;const r={setRecord(t,e){t.record=e}};const l="UnitInfoBox",d={state:()=>({record:{}}),mutations:r,actions:{getUnitRecord:({commit:t},e)=>new Promise((o,i)=>{c.getUnitRecord(e).success(e=>{t("setRecord",e)}).error(t=>{i(t)})})},getters:{record:t=>t.record},namespaced:!0}},107:function(t,e,o){"use strict";(function(t){var i=o(2),s=o(3),a=o(0),n=o.n(a),c=o(15),r=o(103);e.a={components:{UnitInfo:()=>o.e(1).then(o.bind(null,535))},filters:{},mixins:[c.a],props:{unitKey:{type:String,default:""}},data:()=>({formatRecord:!1}),computed:{...Object(s.c)({lang:"lang",record:r.a+"/record",RecordTime:"RecordTime",FormatUnits:"FormatUnits",NoticeRecord:"NoticeRecord",adBlocked:"adBlocked"}),UnitInfo(){const t=this,e=JSON.parse(JSON.stringify(t.FormatUnits));let o=!1;return e[t.unitKey]&&(o=e[t.unitKey]),o},filterNoticeRecord(){const{status:t}=this.lang;let e={};return this.NoticeRecord.forEach(o=>{if(o.unitKey===this.unitKey&&o.oldVal!==o.newVal){if(!e[o.recordTime]){const t=n()(o.recordTime).format("MM-DD HH:mm");e[o.recordTime]={date:t,data:[]}}let i="";const{oldVal:s,newVal:a,note:c}=o;switch(o.diff_type){case"note":i=`備註：<b>${s||"--"}</b> > <b>${a||"--"}</b>`;break;case"status":i=`狀態：<b>${t[s]||"--"}</b> > <b>${t[a]||"--"}</b>`;break;case"used":i=`使用量：<b>${c}</b>`;break;default:console.log(o.diff_type)}e[o.recordTime].data.push(i)}}),e=Object.values(e),e}},watch:{unitKey:{immediate:!0,handler(){}}},beforeCreate(){this.$store.state[r.a]||this.$store.registerModule([r.a],r.b)},created(){},mounted(){const e=this;t(this.$el).on("shown.bs.modal",()=>{i.f.gtag("event","UnitInfoBox_open",{unitKey:this.unitKey}),i.f.mixpanel("UnitInfoBox_open",{unitKey:this.unitKey})}),t(this.$el).on("hidden.bs.modal",()=>{e.$emit("close"),e.formatRecord=!1,this.$route.query&&this.$route.query.unit_key&&this.$router.push({name:"UnitPage"}),i.f.gtag("event","UnitInfoBox_close",{unitKey:this.unitKey}),i.f.mixpanel("UnitInfoBox_close",{unitKey:this.unitKey})}),t(".modal").modal("hide"),t(this.$el).modal("show")},updated(){},destroyed(){},methods:{...Object(s.b)({}),...Object(s.d)({})}}}).call(this,o(16))},391:function(t,e,o){"use strict";o.r(e);var i=function(){var t=this._self._c;return t("div",{staticClass:"modal",attrs:{id:"unit-info-box",tabindex:"-1",role:"dialog","aria-labelledby":"unitInfoBox","aria-hidden":"true"}},[t("div",{staticClass:"modal-dialog modal-lg",attrs:{role:"document"}},[t("div",{staticClass:"modal-content"},[this._m(0),this._v(" "),t("div",{staticClass:"modal-body"},[t("unit-info",{attrs:{"unit-key":this.unitKey}})],1)])])])};i._withStripped=!0;var s=o(107).a,a=o(4),n=Object(a.a)(s,i,[function(){var t=this._self._c;return t("div",{staticClass:"modal-header"},[t("h5",{staticClass:"modal-title"},[this._v("\n                    機組資訊\n                ")]),this._v(" "),t("button",{staticClass:"close",attrs:{type:"button","data-dismiss":"modal","aria-label":"Close"}},[t("span",{attrs:{"aria-hidden":"true"}},[this._v("×")])])])}],!1,null,"2866b114",null);e.default=n.exports},535:function(t,e,o){"use strict";o.r(e);var i=function(){var t=this,e=t._self._c;return e("div",[e("div",{staticClass:"row no-gutters"},[e("div",{staticClass:"col-12 col-md-4"},[t.UnitInfo?e("unit-box",{attrs:{"unit-key":t.UnitInfo.key,name:t.UnitInfo.name,"org-type":t.UnitInfo.orgType,"org-status":t.UnitInfo.orgStatus,"plant-name":t.UnitInfo.plantName,"plant-full-name":t.UnitInfo.plantFullName,used:t.UnitInfo.used,capacity:t.UnitInfo.capacity}}):t._e()],1),t._v(" "),t.UnitInfo?e("div",{staticClass:"col-12 col-md-8"},[e("div",{staticClass:"row table-base-info"},[e("div",{staticClass:"col-12 col-md-6 item"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-4 key"},[t._v("\n                            機組名稱\n                        ")]),t._v(" "),e("div",{staticClass:"col-8 value"},[t._v("\n                            "+t._s(t.UnitInfo.name)+"\n                        ")])])]),t._v(" "),e("div",{staticClass:"col-12 col-md-6 item"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-4 key"},[t._v("\n                            電廠名稱\n                        ")]),t._v(" "),e("div",{staticClass:"col-8 value"},[t._v("\n                            "+t._s(t.UnitInfo.plantFullName)+"\n                        ")])])]),t._v(" "),e("div",{staticClass:"col-12 col-md-6 item"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-4 key"},[t._v("\n                            發電類型\n                        ")]),t._v(" "),e("div",{staticClass:"col-8 value"},[t._v("\n                            "+t._s(t.UnitInfo.type)+"\n                        ")])])]),t._v(" "),e("div",{staticClass:"col-12 col-md-6 item"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-4 key"},[t._v("\n                            能源類型\n                        ")]),t._v(" "),e("div",{staticClass:"col-8 value"},[t._v("\n                            "+t._s(t.UnitInfo.typeGroup)+"\n                        ")])])]),t._v(" "),e("div",{staticClass:"col-12 col-md-6 item"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-4 key"},[t._v("\n                            電廠狀態\n                        ")]),t._v(" "),e("div",{staticClass:"col-8 value"},[t._v("\n                            "+t._s(t.UnitInfo.status)+"\n                        ")])])]),t._v(" "),e("div",{staticClass:"col-12 col-md-6 item"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-4 key"},[t._v("\n                            已發電\n                        ")]),t._v(" "),e("div",{staticClass:"col-8 value"},[t._v("\n                            "+t._s(t.formatMoney(t.UnitInfo.used))+" "),e("small",[t._v("MW")])])])]),t._v(" "),e("div",{staticClass:"col-12 col-md-6 item"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-4 key"},[t._v("\n                            裝置容量\n                        ")]),t._v(" "),e("div",{staticClass:"col-8 value"},[t._v("\n                            "+t._s(t.formatMoney(t.UnitInfo.capacity))+" "),e("small",[t._v("MW")])])])]),t._v(" "),e("div",{staticClass:"col-12 col-md-6 item"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-4 key"},[t._v("\n                            所在縣市\n                        ")]),t._v(" "),e("div",{staticClass:"col-8 value"},[t._v("\n                            "+t._s(t.UnitInfo.location)+"\n                        ")])])]),t._v(" "),e("div",{staticClass:"col-12 col-md-6 item"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-4 key"},[t._v("\n                            所屬\n                        ")]),t._v(" "),e("div",{staticClass:"col-8 value"},[t._v("\n                            "+t._s(t.UnitInfo.gov)+"\n                        ")])])]),t._v(" "),e("div",{staticClass:"col-12 col-md-6 item"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-4 key"},[t._v("\n                            備註\n                        ")]),t._v(" "),e("div",{staticClass:"col-8 value"},[t._v("\n                            "+t._s(t.UnitInfo.note)+"\n                        ")])])])])]):t._e()]),t._v(" "),t.formatRecord?[e("chart-trend",{key:t.unitKey+"_records",attrs:{title:t.unitKey,records:t.formatRecord,"news-ticker":t.filterNoticeRecord,download:!0}})]:t._e(),t._v(" "),e("div",{ref:"ads",staticClass:"power-info-promote",class:{"ad-blocked":t.adBlocked}},[e("ins",{staticClass:"adsbygoogle",staticStyle:{display:"block"},attrs:{"data-ad-format":"fluid","data-ad-layout-key":"-fb+5w+4e-db+86","data-ad-client":"ca-pub-3068501078221920","data-ad-slot":"1897408904"}})])],2)};i._withStripped=!0;var s=o(2),a=o(3),n=o(0),c=o.n(n),r=o(15),l=o(34);const d=s.a.get("API_CONFIG.API_HOST"),m={...l.a,getUnitRecord(t){const e=t.unitKey.replace("#","%23"),o=`${d}log/record/${e}.log?t=${(new Date).getTime()}`;return m.run(o,"GET")}};var u=m;const v={setRecord(t,e){t.record=e}};const f={state:()=>({record:{}}),mutations:v,actions:{getUnitRecord:({commit:t},e)=>new Promise((o,i)=>{u.getUnitRecord(e).success(e=>{t("setRecord",e)}).error(t=>{i(t)})})},getters:{record:t=>t.record},namespaced:!0};var h={components:{UnitBox:()=>Promise.all([o.e(5),o.e(0),o.e(8)]).then(o.bind(null,536)),ChartTrend:()=>Promise.all([o.e(4),o.e(0),o.e(9)]).then(o.bind(null,538))},filters:{},mixins:[r.a],props:{unitKey:{type:String,default:""}},data:()=>({formatRecord:!1}),computed:{...Object(a.c)({lang:"lang",record:"UnitInfoBox/record",RecordTime:"RecordTime",FormatUnits:"FormatUnits",NoticeRecord:"NoticeRecord",adBlocked:"adBlocked"}),UnitInfo(){const t=this,e=JSON.parse(JSON.stringify(t.FormatUnits));let o=!1;return e[t.unitKey]&&(o=e[t.unitKey]),o},filterNoticeRecord(){const{status:t}=this.lang;let e={};return this.NoticeRecord.forEach(o=>{if(o.unitKey===this.unitKey&&o.oldVal!==o.newVal){if(!e[o.recordTime]){const t=c()(o.recordTime).format("MM-DD HH:mm");e[o.recordTime]={date:t,data:[]}}let i="";const{oldVal:s,newVal:a,note:n}=o;switch(o.diff_type){case"note":i=`備註：<b>${s||"--"}</b> > <b>${a||"--"}</b>`;break;case"status":i=`狀態：<b>${t[s]||"--"}</b> > <b>${t[a]||"--"}</b>`;break;case"used":i=`使用量：<b>${n}</b>`;break;default:console.log(o.diff_type)}e[o.recordTime].data.push(i)}}),e=Object.values(e),e}},watch:{unitKey:{immediate:!0,handler(){this.getRecord()}},record:{handler(t,e){this.$nextTick(()=>{this.calcformatRecord()})}},UnitInfo:{immediate:!0,deep:!0,handler(t,e){(!e&&t||t.name!==e.name)&&this.setSEO()}}},beforeCreate(){this.$store.state.UnitInfoBox||this.$store.registerModule(["UnitInfoBox"],f)},created(){},mounted(){setTimeout(()=>{(window.adsbygoogle=window.adsbygoogle||[]).push({})},1e3)},updated(){},destroyed(){this.undoPageTitle()},methods:{...Object(a.b)({}),...Object(a.d)({}),setSEO(){const t=this;clearTimeout(t.setSEOTimer),t.setSEOTimer=setTimeout(()=>{const{name:e,gov:o,plantFullName:i,type:s,location:a,status:n,percent:c}=t.UnitInfo;let{capacity:r,used:l}=t.UnitInfo;r=r.toLocaleString(),l=l.toLocaleString(),t.setPageSEO({title:t.UnitInfo.name+" 機組",description:`${e}機組是一組${o}擁有${n}${s}發電機組，位於${a}${i}，裝置容量為${r}MW，目前發電量為${l}MW運轉率為${c}%。`})},200)},formatMoney:t=>t.toLocaleString(),getRecord(){const t=this;clearTimeout(t.getRecordTimer),t.getRecordTimer=setTimeout(()=>{const e={unitKey:t.unitKey};t.$store.dispatch("UnitInfoBox/getUnitRecord",e).then(t=>{},t=>{})},200)},calcformatRecord(){const t=this;clearTimeout(t.calcformatRecordTimer),t.calcformatRecordTimer=setTimeout(()=>{const e=JSON.parse(JSON.stringify(t.record));let o=c()(t.RecordTime+":00").add(-2,"day");const i=o.format("YYYY-MM-DD HH");let s=o.format("mm");s=10*parseInt(s/10),o=`${i}:${s}:00`;const a=parseInt(c()(`${i}:${s}:00`).format("X")),n=parseInt(c()(t.RecordTime+":00").format("X")),r={};for(let o=a;o<=n;o+=600){const i=c()(1e3*o).format("YYYY-MM-DD HH:mm"),s=c()(1e3*o).format("MM-DD HH:mm"),a={};a[t.UnitInfo.name]=e[i]||0,r[s]=a}t.formatRecord=r},500)}}},_=o(4),y=Object(_.a)(h,i,[],!1,null,"6c7b1b54",null);e.default=y.exports},545:function(t,e,o){"use strict";o.r(e);var i=function(){var t=this._self._c;return this.FormatUnits&&this.FormatUnits[this.unit_key]?t("div",{staticStyle:{margin:"0 auto","max-width":"700px"}},[t("unit-info",{attrs:{"unit-key":this.unit_key}})],1):this._e()};i._withStripped=!0;var s=o(3),a=o(2),n={components:{UnitInfo:()=>Promise.all([o.e(1),o.e(26)]).then(o.bind(null,535))},filters:{},props:{},data:()=>({}),computed:{...Object(s.c)({FormatUnits:"FormatUnits"}),unit_key(){let t="";return this.$route.params&&this.$route.params.unit_key&&(t=this.$route.params.unit_key),t}},watch:{unit_key:{immediate:!0,deep:!0,handler(t){console.log(t)}}},created(){this.init()},mounted(){},updated(){},destroyed(){},methods:{...Object(s.b)({}),...Object(s.d)({}),init(){this.loadPlantInfo()},loadPlantInfo(){const t=this;a.d.loading({title:"讀取中"}),t.$store.dispatch("getPlantInfo").then(e=>{t.loadPowerInfo()},()=>{a.d.close()})},loadPowerInfo(){a.d.loading({title:"讀取中"}),this.$store.dispatch("getRealTimePowerInfo").then(t=>{a.d.close()},()=>{a.d.close()})}}},c=o(4),r=Object(c.a)(n,i,[],!1,null,"0c235287",null);e.default=r.exports}}]);