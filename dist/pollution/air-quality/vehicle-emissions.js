"use strict";document.addEventListener("DOMContentLoaded",function(){let o=soefinding.findingJson.data.sort(function(e,t){return t["Tonnes per annum"]-e["Tonnes per annum"]}),s=o.map(e=>e["Tonnes per annum"]),n=soefinding.getDefaultPieChartOptions();n.labels=o.map(e=>e["Emission type"]),n.tooltip={y:{formatter:(e,t)=>{let i=t.globals.seriesPercent[t.seriesIndex][0];return`${e.toLocaleString()} (${i.toFixed(1)}%)`}}},n.xaxis.categories=["Emission type","Tonnes per annum"],soefinding.state.chart1={options:n,series:s,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Proportion of annual average vehicle emissions by type in 2010"},methods:{formatter1:e=>e.toLocaleString()}})});
//# sourceMappingURL=vehicle-emissions.js.map