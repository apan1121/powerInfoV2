(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{544:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e._self._c;return t("div",{staticClass:"alarm-page"},[t("div",{staticClass:"alert alert-success",attrs:{role:"alert"}},[t("span",{staticClass:"label-beta"},[e._v("BETA")]),e._v("\n        本功能目前為 Beta 版，當系統十分鐘的電力減少超過 "+e._s(Math.abs(e.DIFF_TOTAL_USED_LIMIT))+" MW，會即時紀錄當時狀況並嘗試列出可能的問題。\n        在 Beta 版期間的警報資訊為低門檻觸發事件，請勿恐慌。\n    ")]),e._v(" "),t("div",{staticClass:"row"},[e._l(e.AlarmRecord,(function(a,o){return[t("div",{key:a.time,staticClass:"col-12 mb-3"},[t("alarm-record-box",e._b({attrs:{"default-open":0===o}},"alarm-record-box",a,!1))],1),e._v(" "),o%5==4?[t("div",{key:`${a.time}_${o}`,staticClass:"col-12 mb-3"},[t("box-ads-box")],1)]:e._e()]}))],2),e._v(" "),e.chooseUnitKey?[t("unit-info-box",{attrs:{"unit-key":e.chooseUnitKey},on:{close:e.closeUnitInfo}})]:e._e()],2)};o._withStripped=!0;var s=a(3),l=a(2),r=a(15),n=function(){var e=this._self._c;return e("card-box",{attrs:{title:"廣告"}},[e("div",{ref:"ads",staticClass:"power-info-promote",class:{"ad-blocked":this.adBlocked}},[e("ins",{staticClass:"adsbygoogle",staticStyle:{display:"block"},attrs:{"data-ad-format":"fluid","data-ad-layout-key":"-fb+5w+4e-db+86","data-ad-client":"ca-pub-3068501078221920","data-ad-slot":"1897408904"}})])])};n._withStripped=!0;var d={components:{CardBox:()=>a.e(2).then(a.bind(null,173))},filters:{},props:{},data:()=>({}),computed:{...Object(s.c)(["adBlocked"])},watch:{},beforeCreate(){},created(){},mounted(){setTimeout(()=>{(window.adsbygoogle=window.adsbygoogle||[]).push({})},500)},updated(){},destroyed(){},methods:{...Object(s.b)({}),...Object(s.d)({})}},i=a(4),c=Object(i.a)(d,n,[],!1,null,"b25c0ec0",null).exports;l.b.register([{rel:"stylesheet",type:"text/css",href:"/dist/css/page/alarm-page.css"}]);var f={components:{AlarmRecordBox:()=>Promise.all([a.e(13),a.e(0)]).then(a.bind(null,552)),UnitInfoBox:()=>a.e(1).then(a.bind(null,391)),BoxAdsBox:c},filters:{},mixins:[r.a],props:{},data:()=>({}),computed:{...Object(s.c)(["lang","AlarmRecord","chooseUnitKey"]),DIFF_TOTAL_USED_LIMIT(){const e=this;let t=0;return e.AlarmRecord.length>0&&(t=e.AlarmRecord[0].DIFF_TOTAL_USED_LIMIT),t}},watch:{AlarmRecord:{deep:!0,handler(){this.setSEO()}}},created(){},mounted(){l.f.gtag("event","page_view",{page_id:"AlarmPage"}),l.f.mixpanel("page_view",{page_id:"AlarmPage"}),this.setSEO(),this.loadPlantInfo()},updated(){},destroyed(){},methods:{...Object(s.b)({}),...Object(s.d)({chooseUnitByKey:"chooseUnitByKey"}),formatMoney:e=>e.toLocaleString(),setSEO(){const e=this;clearTimeout(e.setSEOTimer),e.setSEOTimer=setTimeout(()=>{let t=!1,a="";if(e.AlarmRecord.length>0){t=JSON.parse(JSON.stringify(e.AlarmRecord))[0];let{time:o,diff_used:s,reduce_records:l}=t;s=e.formatMoney(Math.abs(s)),a=`${o} 發生電力異常，電網10分鐘內減少 ${s} MW`;const[r,n]=Object.values(JSON.parse(JSON.stringify(t.diff_records)));let d=[];Object.keys(e.lang.type).forEach(e=>{const t=parseFloat(r[e].used),a=parseFloat(n[e].used),o=a-t;let s=0;0!==t&&(s=parseInt(o/t*1e4)/100),o<0&&d.push({type:e,last:t,now:a,diff:o,percent:s})}),d=d.sort((e,t)=>e.diff>t.diff?1:e.diff===t.diff?0:-1),d=d.map(t=>{let{diff:a,percent:o}=t;return a=e.formatMoney(Math.abs(a)),o=e.formatMoney(Math.abs(o)),`${e.lang.type[t.type]}減少了 ${a} MW (${o}%)`}),d.length>0&&(d=d.join("、"),a=`${a}；${d}`);let i=[];l.length>0&&(l.forEach(t=>{const a=t.newVal-t.oldVal;let o=0;0!==t.oldVal&&(o=parseInt(a/t.oldVal*1e4)/100),i.push({...t,diff:a,percent:e.formatMoney(Math.abs(o))})}),i=i.sort((e,t)=>e.diff>t.diff?1:e.diff===t.diff?0:-1),i=i.map(t=>{let{diff:a,percent:o}=t;return a=e.formatMoney(Math.abs(a)),o=e.formatMoney(Math.abs(o)),`${t.name}(${e.lang.type[t.type]}) 減少了 ${a} MW(${o}%)`}),i=i.join("、"),a=`${a}；異常機組如下：${i}`)}a+="。",e.setPageSEO({title:"電力警報",description:a})},200)},loadPlantInfo(){const e=this;l.d.loading({title:"讀取中"}),e.$store.dispatch("getPlantInfo").then(t=>{e.loadPowerInfo()},()=>{l.d.close()})},loadPowerInfo(){l.d.loading({title:"讀取中"}),this.$store.dispatch("getRealTimePowerInfo").then(e=>{l.d.close()},()=>{l.d.close()})},closeUnitInfo(){this.chooseUnitByKey("")}}},p=Object(i.a)(f,o,[],!1,null,"5d5e1127",null);t.default=p.exports}}]);