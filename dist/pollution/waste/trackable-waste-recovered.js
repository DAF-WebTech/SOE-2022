"use strict";document.addEventListener("DOMContentLoaded",function(){const yearKeys=soefinding.findingJson.meta.fields.slice(1);const latestYear=yearKeys[yearKeys.length-1];const totals=soefinding.findingJson.data.find(d=>d["Waste description"]=="Total");const totalSeries=[{name:`Total`,data:yearKeys.map(y=>totals[y])}];const options1=soefinding.getDefaultBarChartOptions();options1.xaxis.categories=yearKeys.map(y=>y.replace("-","\u2013"));options1.xaxis.tickPlacement="between";options1.xaxis.title.text="Year";options1.yaxis.title.text="Tonnes";options1.yaxis.labels.formatter=val=>{return val<1e6?`${val/1e3}K`:`${val/1e6}M`};options1.tooltip.y={formatter:val=>val.toLocaleString()};soefinding.state.chart1={options:options1,series:totalSeries,chartactive:true};const wasteItems=soefinding.findingJson.data.filter(d=>d["Waste description"]!="Total");wasteItems.sort(function(a,b){return b[latestYear]-a[latestYear]});const wasteSeries=wasteItems.map(d=>d[latestYear]);const options2=soefinding.getDefaultPieChartOptions();options2.colors=options2.colors.concat(["#33b2df","#546E7A","#d4526e","#13d8aa","#A5978B"]);options2.xaxis.categories=["Waste description",latestYear];options2.labels=wasteItems.map(d=>d["Waste description"]);options2.tooltip={y:{formatter:(val,options)=>{const percent=options.globals.seriesPercent[options.seriesIndex][0];return`${val.toLocaleString()} (${percent.toFixed(1)}%)`}}};soefinding.state.chart2={options:options2,series:wasteSeries,chartactive:true};new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Trackable waste recovered",heading2:()=>`Proportion of trackable waste recovered by waste type, ${latestYear.replace("-","\u2013")}`},methods:{formatter1:val=>val.toLocaleString()}})});
//# sourceMappingURL=trackable-waste-recovered.js.map