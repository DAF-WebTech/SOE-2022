"use strict";document.addEventListener("DOMContentLoaded",function(){let s=soefinding.findingJson.meta.fields.slice(2),o=s[s.length-1],a=soefinding.findingJson.data.filter(e=>e.Measure.startsWith("Number")).map(e=>({name:e.Extent,data:s.map(n=>e[n])})),t=soefinding.getDefaultLineChartOptions();t.xaxis.axisTicks={show:!1},t.xaxis.categories=s.map(e=>[e.slice(0,4)+"\u2013",e.slice(5)]),t.xaxis.tickPlacement="between",t.xaxis.labels.rotateAlways=!1,t.xaxis.title.text="Year",t.yaxis.title.text="Number of items per 100m\xB2",soefinding.state.chart1={options:t,series:a,chartactive:!0};let r=soefinding.findingJson.data.filter(e=>e.Measure.startsWith("Volume")).map(e=>({name:e.Extent,data:s.map(n=>e[n])})),i=JSON.parse(JSON.stringify(t));i.yaxis.title.text="Volume of items per 100m\xB2",i.yaxis.labels.formatter=e=>`${e}`,soefinding.state.chart2={options:i,series:r,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Trends in number of litter items per 1000m\xB2 by Queensland and Australia",heading2:()=>"Trends in volume of litter items per 1000m\xB2 by Queensland and Australia"},methods:{formatter1:e=>e,formatter2:e=>e.toLocaleString(void 0,{minimumFractionDigits:2})}})});
//# sourceMappingURL=litter-items-queensland.js.map