(window.webpackJsonp=window.webpackJsonp||[]).push([[21,22,23,24,25,26],{15:function(t,e,o){"use strict";var n=o(2);e.a={props:{},data:()=>({prevRoute:null,lastTitle:""}),computed:{},methods:{setPageSEO(t){const e=n.a.get("ASSETS_HOST");this.lastTitle=window.document.title;const o={title:"WebTitle",description:"讓你一目了然全台灣電廠即時發電量資訊",image:"https://apan1121.github.io/powerInfoV2/dist/img/logo.jpg",...t};o.title&&(o.title=o.title+" - 台灣電廠即時資訊");let i=window.location.href;(i.includes("#/unit/")||i.includes("#/plant/"))&&(i=`${e}?path=${encodeURIComponent(window.location.hash.substr(2))}`),window.document.title=o.title,document.querySelector("meta[property='og:title']").content=o.title,document.querySelector("meta[name='description']").content=o.description,document.querySelector("meta[property='og:description']").content=o.description,document.querySelector("meta[property='og:url']").content=i,document.querySelector("link[rel='canonical']").href=i},setPageTitle(t){this.lastTitle=window.document.title;t?t+=" - 台灣電廠即時資訊":t="台灣電廠即時資訊",window.document.title=t},undoPageTitle(){window.document.title=this.lastTitle}},beforeDestroyed(){},destroyed(){},mounted(){}}}}]);