"use strict";document.addEventListener("DOMContentLoaded",function(){let i=soefinding.findingJson.meta.fields.slice(1);soefinding.findingContent.Queensland={series:[]},soefinding.findingJson.data.forEach(n=>{soefinding.findingContent[n.Region]={series:[{name:"Places",data:i.map(t=>n[t])}]},soefinding.findingContent.Queensland.series.push({name:n.Region,data:i.map(t=>n[t])})});let e=soefinding.getDefaultStackedColumnChartOptions();e.xaxis.title.text="Year",e.xaxis.categories=i,e.yaxis.title.text="Number of places",e.yaxis.forceNiceScale=!1,e.yaxis.max=10,e.yaxis.min=0,e.yaxis.tickAmount=10,soefinding.state.chart1={series:soefinding.findingContent[soefinding.state.currentRegionName].series,options:e,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:function(){return this.currentRegionName=="Queensland"?"Number of places, by cultural heritage region":`Number of places in ${this.currentRegionName} cultural heritage region`}},methods:{formatter1:n=>n.toLocaleString()}}),window.soefinding.onRegionChange=function(){soefinding.state.chart1.series=soefinding.findingContent[soefinding.state.currentRegionName].series,soefinding.loadFindingHtml()}});
//# sourceMappingURL=places.js.map