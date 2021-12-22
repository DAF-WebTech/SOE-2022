"use strict";document.addEventListener("DOMContentLoaded",function(){let a=soefinding.findingJson.meta.fields.slice(2),s=a[a.length-1],r=soefinding.findingJson.data.filter(e=>e["Waste region"]=="Queensland"&&e["Waste source"]!="All").map(e=>({name:e["Waste source"],data:a.map(t=>e[t])}));r.sort(function(e,t){return t.data[t.data.length-1]-e.data[e.data.length-1]});let n=soefinding.getDefaultBarChartOptions();n.chart.stacked=!0,n.legend.inverseOrder=!0,n.xaxis.categories=a.map(e=>e.replace("-","\u2013")),n.xaxis.title.text="Year",n.yaxis.title.text="Tonnes (million)",n.yaxis.labels.formatter=e=>`${(e/1e6).toFixed(1)}M`,n.tooltip.y={formatter:e=>e.toLocaleString()},soefinding.state.chart1={options:n,series:r,chartactive:!0};let c=soefinding.findingJson.data.find(e=>e["Waste region"]=="Queensland"&&e["Waste source"]=="All"),g=[{name:"Total",data:a.map(e=>c[e])}],i=soefinding.getDefaultLineChartOptions();i.xaxis.categories=a.map(e=>e.replace("-","\u2013")),i.xaxis.title.text="Year",i.yaxis.title.text="Tonnes (million)",i.yaxis.labels.formatter=e=>`${(e/1e6).toFixed(1)}M`,i.tooltip.y={formatter:e=>e.toLocaleString()},soefinding.state.chart2={options:i,series:g,chartactive:!0};let l=soefinding.findingJson.data.filter(e=>e["Waste region"]!="Queensland"),d=l.map(e=>e[s]);d.sort(function(e,t){return t-e});let o=soefinding.getDefaultPieChartOptions();o.xaxis.categories=["Region","Tonnes"],o.labels=l.map(e=>e["Waste region"].replace("-","\u2013")),o.tooltip={y:{formatter:(e,t)=>{let f=t.globals.seriesPercent[t.seriesIndex][0];return`${e.toLocaleString()} (${f.toFixed(1)}%)`}}},soefinding.state.chart3={options:o,series:d,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Household waste landfilled, by collection type",heading2:()=>"Trend in total household waste landfilled",heading3:()=>`Proportion of household waste landfilled by region, ${s.replace("-","\u2013")}`},methods:{formatter1:e=>e?.toLocaleString()??""}})});
//# sourceMappingURL=household-waste-landfilled.js.map