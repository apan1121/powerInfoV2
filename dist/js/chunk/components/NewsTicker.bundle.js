(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{111:function(t,e,s){"use strict";(function(t){var i=s(0),n=s.n(i),o=s(3),a=s(2);e.a={components:{},filters:{},props:{},data:()=>({NewsIndex:0,waitTime:5e3,noticeRecordListReadTime:0,NoticeRecordFormat:[],NewsLimit:5,diffTypeMapping:{used:"發電",status:"機組狀態",note:"備註"},powerStatusMapping:{online:"商轉中",break:"故障機組",limit:"限轉機組",fix:"待修機組"}}),computed:{...Object(o.c)({lang:"lang",NoticeRecord:"NoticeRecord"}),showNewsList(){const t=this,e=[];if(t.NoticeRecordFormat[t.NewsIndex]){e.push(t.NoticeRecordFormat[t.NewsIndex]);let s=(t.NewsIndex+1)%t.NoticeRecordFormat.length;t.NoticeRecordFormat[t.NewsIndex]||(s=0),e.push(t.NoticeRecordFormat[s])}return e}},watch:{NoticeRecord(){const e=this;if(e.NoticeRecord.length>0){const s=[];for(let t=0;t<e.NoticeRecord.length;t++){const i=e.NoticeRecord[t];let o="";const a=n()(i.recordTime).format("X")>e.noticeRecordListReadTime,c=n()(i.recordTime).format("MM-DD HH:mm"),r=""+i.name,l=""+i.diff_type,d=""+i.unitKey;let{oldVal:p,newVal:_}=i;switch(p=p||"--",_=_||"--",i.diff_type){case"used":p=i.oldVal+" <small>MW</small>",_=i.newVal+" <small>MW</small>";break;case"status":p=e.powerStatusMapping[p],_=e.powerStatusMapping[_]}if(o=`${p} -> ${_}`,i.note&&(o=`${o}；${i.note}`),s.push({key:t,diff_type:l,name:r,unitKey:d,text:o,is_new:a,record_time:c}),s.length>e.NewsLimit)break}e.NoticeRecordFormat=s,e.$nextTick(()=>{t(e.$refs.NewsTickerModal).on("shown.bs.modal",()=>{a.f.gtag("event","UnitFilterBox_open",{}),a.f.mixpanel("UnitFilterBox_open",{})}),t(e.$refs.NewsTickerModal).on("hidden.bs.modal",()=>{e.$emit("open-filter-box",!1),a.f.gtag("event","UnitFilterBox_close",{}),a.f.mixpanel("UnitFilterBox_close",{})})})}},showNewsList(){const t=this;t.$nextTick(()=>{t.$refs.firstItem.addEventListener("animationend",()=>{clearTimeout(t.animationendTimer),t.animationendTimer=setTimeout(()=>{t.goToNext()},10)},!0)}),t.runNewsTicker()}},beforeCreate(){},created(){},mounted(){this.noticeRecordListReadTime=a.c.get("noticeRecordListReadTime",0),this.loadNoticeRecord()},updated(){},destroyed(){},methods:{...Object(o.b)({}),...Object(o.d)({chooseUnitByKey:"chooseUnitByKey"}),loadNoticeRecord(){this.$store.dispatch("loadNoticeRecord").then(()=>{},()=>{})},runNewsTicker(){const e=this;e.runNewsTickerTimer=setTimeout(()=>{t(e.$refs.newsTickerContent).addClass("run")},e.waitTime)},goToNext(){this.NewsIndex=(this.NewsIndex+1)%this.NoticeRecordFormat.length,t(this.$refs.newsTickerContent).removeClass("run"),this.runNewsTicker()},openUnitInfo(t){this.chooseUnitByKey(t)},openNewsTicker(e){t(this.$refs.NewsTickerModal).modal("show")}}}}).call(this,s(16))},172:function(t,e,s){var i=s(534);i.__esModule&&(i=i.default),"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);(0,s(118).default)("c06101a2",i,!1,{})},533:function(t,e,s){"use strict";s(172)},534:function(t,e,s){(t.exports=s(109)(!1)).push([t.i,"\n.table[data-v-0ea35b41]{\n    font-size: 12px;\n}\n",""])},549:function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"news-ticker"},[e("div",{staticClass:"news-ticker-wrapper",on:{click:function(e){return e.stopPropagation(),t.openNewsTicker.apply(null,arguments)}}},[e("div",{staticClass:"news-ticker-title"},[t._v("\n            快訊\n        ")]),t._v(" "),e("div",{ref:"newsTickerContent",staticClass:"news-ticker-content"},[t.showNewsList[0]?[e("div",{key:t.showNewsList[0].key,ref:"firstItem",staticClass:"news-ticker-content-item"},[t.showNewsList[0].is_new?e("span",{staticClass:"is-new"},[t._v("New")]):t._e(),t._v(" "),e("span",{staticClass:"record-time"},[t._v(t._s(t.showNewsList[0].record_time))]),t._v(" "),e("span",{staticClass:"unit-key",on:{click:function(e){return e.stopPropagation(),t.openUnitInfo(t.showNewsList[0].unitKey)}}},[t._v(t._s(t.showNewsList[0].name))]),t._v(" "),e("span",{staticClass:"diff-type"},[t._v(t._s(t.diffTypeMapping[t.showNewsList[0].diff_type]))]),t._v(" "),e("span",{domProps:{innerHTML:t._s(t.showNewsList[0].text)}})])]:t._e(),t._v(" "),t.showNewsList[1]?[e("div",{key:t.showNewsList[1].key,staticClass:"news-ticker-content-item"},[t.showNewsList[1].is_new?e("span",{staticClass:"is-new"},[t._v("New")]):t._e(),t._v(" "),e("span",{staticClass:"record-time"},[t._v(t._s(t.showNewsList[1].record_time))]),t._v(" "),e("span",{staticClass:"unit-key",on:{click:function(e){return e.stopPropagation(),t.openUnitInfo(t.showNewsList[0].unitKey)}}},[t._v(t._s(t.showNewsList[1].name))]),t._v(" "),e("span",{staticClass:"diff-type"},[t._v(t._s(t.diffTypeMapping[t.showNewsList[1].diff_type]))]),t._v(" "),e("span",{domProps:{innerHTML:t._s(t.showNewsList[1].text)}})])]:t._e()],2)]),t._v(" "),t.NoticeRecord.length>0?e("div",{ref:"NewsTickerModal",staticClass:"modal",attrs:{tabindex:"-1",role:"dialog"}},[e("div",{staticClass:"modal-dialog modal-lg",attrs:{role:"document"}},[e("div",{staticClass:"modal-content"},[t._m(0),t._v(" "),e("div",{staticClass:"modal-body"},[e("table",{staticClass:"table table-striped"},[e("tbody",[t._l(t.NoticeRecord,(function(s,i){return[i%10==0?[e("tr",{key:"header_"+i},[e("th",{staticClass:"text-center",attrs:{scope:"col"}},[t._v("\n                                            時間\n                                        ")]),t._v(" "),e("th",{staticClass:"text-center",attrs:{scope:"col"}},[t._v("\n                                            機組名稱\n                                        ")]),t._v(" "),e("th",{staticClass:"text-center",attrs:{scope:"col"}},[t._v("\n                                            發電類型\n                                        ")]),t._v(" "),e("th",{staticClass:"text-center",attrs:{scope:"col"}},[t._v("\n                                            變動項目\n                                        ")]),t._v(" "),e("th",{staticClass:"text-center",attrs:{scope:"col"}},[t._v("\n                                            舊值\n                                        ")]),t._v(" "),e("th",{staticClass:"text-center",attrs:{scope:"col"}},[t._v("\n                                            新值\n                                        ")]),t._v(" "),e("th",{staticClass:"text-center",attrs:{scope:"col"}},[t._v("\n                                            備註\n                                        ")])])]:t._e(),t._v(" "),e("tr",{key:i},[e("th",{staticClass:"text-center",attrs:{scope:"row"},domProps:{innerHTML:t._s(s.recordTime.replace(" ","<br>"))}}),t._v(" "),e("td",{staticClass:"text-center cursor-pointer",on:{click:function(e){return e.stopPropagation(),t.openUnitInfo(s.unitKey)}}},[t._v("\n                                        "+t._s(s.name)+"\n                                    ")]),t._v(" "),e("td",{staticClass:"text-center"},[t._v("\n                                        "+t._s(t.lang.type[s.type])+"\n                                    ")]),t._v(" "),e("td",{staticClass:"text-center"},[t._v("\n                                        "+t._s(t.diffTypeMapping[s.diff_type])+"\n                                    ")]),t._v(" "),e("td",{staticClass:"text-center"},["used"===s.diff_type?[t._v("\n                                            "+t._s(s.oldVal)+" "),e("small",[t._v("MW")])]:[t._v("\n                                            "+t._s(t.powerStatusMapping[s.oldVal]||s.oldVal||"--")+"\n                                        ")]],2),t._v(" "),e("td",{staticClass:"text-center"},["used"===s.diff_type?[t._v("\n                                            "+t._s(s.newVal)+" "),e("small",[t._v("MW")])]:[t._v("\n                                            "+t._s(t.powerStatusMapping[s.newVal]||s.newVal||"--")+"\n                                        ")]],2),t._v(" "),e("td",[t._v(t._s(s.note))])])]}))],2)])])])])]):t._e()])};i._withStripped=!0;var n=s(111).a,o=(s(533),s(4)),a=Object(o.a)(n,i,[function(){var t=this._self._c;return t("div",{staticClass:"modal-header"},[t("h5",{staticClass:"modal-title"},[this._v("\n                        異動快訊\n                    ")]),this._v(" "),t("button",{staticClass:"close",attrs:{type:"button","data-dismiss":"modal","aria-label":"Close"}},[t("span",{attrs:{"aria-hidden":"true"}},[this._v("×")])])])}],!1,null,"0ea35b41",null);e.default=a.exports}}]);