(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{105:function(t,e,a){"use strict";(function(t,i){var n=a(3),o=a(166);e.a={components:{},filters:{},props:{},data:()=>({}),computed:{...Object(n.c)(["AlarmRecord"]),route(){return this.$route},navList(){const e=this,a=[];if(a.push({route_name:"UnitPage",icon:"icon icon-electricity-pole",title:"機組資訊"}),a.push({route_name:"SummaryPage",icon:"icon icon-chart",title:"分析摘要"}),e.AlarmRecord.length>0){const i=t(e.AlarmRecord[0].time).format("X");let n="icon icon-alarm";t().format("X")-i<86400&&(n="icon icon-alarm-notice"),a.push({route_name:"AlarmPage",icon:n,title:"電力警報"})}return a.push({route_name:"AboutPage",icon:"icon icon-about",title:"關於"}),a}},watch:{},created(){},mounted(){this.init()},updated(){},destroyed(){},methods:{...Object(n.b)({}),...Object(n.d)({SetPageSetting:"SetPageSetting",CheckAdBlock:"CheckAdBlock"}),init(){const t=this;t.getAlarmRecord(),i(window).bind("resize",()=>{clearTimeout(t.windowResizeTimer),t.windowResizeTimer=setTimeout(()=>{let e="pc";const a=i("body").width();a<567&&(e="mobile"),t.SetPageSetting({mode_type:e,width:a})},100)}).trigger("resize"),Object(o.detectAnyAdblocker)().then(e=>{t.CheckAdBlock(e)})},getAlarmRecord(){this.$store.dispatch("loadAlarmRecord").then(()=>{},()=>{})}}}}).call(this,a(0),a(16))},548:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"tw-power-info-page"},[e("header",[e("nav",{staticClass:"navbar navbar-expand-md navbar-dark fixed-top bg-dark"},[e("div",{staticClass:"container"},[e("router-link",{staticClass:"navbar-brand",attrs:{to:{name:"UnitPage"}}},[t._v("\n                    台灣電廠即時資訊\n                ")]),t._v(" "),e("ul",{staticClass:"navbar-nav"},[t._l(t.navList,(function(a){return[e("li",{key:a.route_name,staticClass:"nav-item",class:{active:t.route.name==a.route_name}},[e("router-link",{staticClass:"nav-link",attrs:{to:{name:a.route_name}}},[e("i",{class:a.icon}),t._v(" "),e("span",[t._v(t._s(a.title))])])],1)]}))],2)],1)])]),t._v(" "),e("div",{staticClass:"container"},[e("router-view")],1)])};i._withStripped=!0;var n=a(105).a,o=a(4),r=Object(o.a)(n,i,[],!1,null,"381d9a60",null);e.default=r.exports}}]);