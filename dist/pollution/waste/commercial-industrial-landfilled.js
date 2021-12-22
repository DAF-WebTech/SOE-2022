"use strict";document.addEventListener("DOMContentLoaded",function(){let a=soefinding.findingJson.meta.fields.slice(1),s=a[a.length-1],l=a.slice(a.length-4),d=soefinding.findingJson.data.find(e=>e["Waste region"]=="Queensland"),c=[{name:"Queensland",data:l.map(e=>d[e])}],t=soefinding.getDefaultBarChartOptions();t.xaxis.categories=l.map(e=>e.replace("-","\u2013")),t.xaxis.title.text="Year",t.yaxis.title.text="Tonnes (million)",t.yaxis.labels.formatter=e=>`${(e/1e6).toFixed(1)}M`,t.tooltip.y={formatter:e=>e.toLocaleString()},t.yaxis.forceNiceScale=!1,t.yaxis.min=1e6,t.yaxis.max=2e6,t.yaxis.tickAmount=5,soefinding.state.chart1={options:t,series:c,chartactive:!0};let g=soefinding.findingJson.data.find(e=>e["Waste region"]=="Excluding green waste"),f=[{name:"Excluding green waste",data:a.map(e=>g[e])}],n=soefinding.getDefaultLineChartOptions();n.xaxis.categories=a.map(e=>e.replace("-","\u2013")),n.xaxis.title.text="Year",n.xaxis.labels.rotateAlways=!0,n.yaxis.title.text="Tonnes (million)",n.yaxis.labels.formatter=e=>`${(e/1e6).toFixed(1)}M`,n.tooltip.y={formatter:e=>e.toLocaleString()},soefinding.state.chart2={options:n,series:f,chartactive:!0};let r=soefinding.findingJson.data.filter(e=>e["Waste region"]!="Queensland"&&e["Waste region"]!="Excluding green waste");r.sort(function(e,i){return i[s]-e[s]});let x=r.map(e=>e[s]),o=soefinding.getDefaultPieChartOptions();o.labels=r.map(e=>e["Waste region"].replace("-","\u2013")),o.tooltip.y={formatter:(e,i)=>{let m=i.globals.seriesPercent[i.seriesIndex][0];return`${e.toLocaleString()} (${m.toFixed(1)}%)`}},o.xaxis.categories=["Waste Region","Tonnes"],soefinding.state.chart3={options:o,series:x,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Commercial and industrial waste landfilled",heading2:()=>"Trend in total commercial and industrial waste landfilled (excluding green waste)",heading3:()=>`Proportion of commercial and industrial waste landfilled by region, ${s.replace("-","\u2013")}`},methods:{formatter1:e=>{var i;return(i=e==null?void 0:e.toLocaleString())!=null?i:""}}})});
//# sourceMappingURL=commercial-industrial-landfilled.js.map