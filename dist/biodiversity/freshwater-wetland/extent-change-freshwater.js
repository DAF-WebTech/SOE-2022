"use strict";document.addEventListener("DOMContentLoaded",function(){let s=soefinding.findingJson.data.filter(e=>e["Drainage division"]!="Queensland"&&e.Indicator=="Area (ha)"),o=soefinding.findingJson.meta.fields.slice(2,5),u=o.map(e=>({name:e,data:s.map(i=>i[e])})),n=soefinding.getDefaultStackedColumnChartOptions();n.tooltip.y={formatter:e=>e.toLocaleString()},n.xaxis.categories=s.map(e=>e["Drainage division"].startsWith("North East")?[e["Drainage division"].substring(0,e["Drainage division"].lastIndexOf(" ")),e["Drainage division"].substring(e["Drainage division"].lastIndexOf(" ")+1)]:e["Drainage division"]),n.xaxis.title.text="Wetland System",n.yaxis.labels.formatter=e=>e>=1e6?`${e/1e6}M`:`${e/1e3}K`,n.yaxis.forceNiceScale=!1,n.yaxis.min=0,n.yaxis.max=3e6,n.yaxis.tickAmount=6,n.yaxis.title.text="Hectares",n.yaxis.labels.minWidth=25,n.chart.id="chart1",soefinding.state.chart1={options:n,series:u,chartactive:!0},s.filter(e=>e["Drainage division"]!="Other").forEach(e=>{soefinding.findingContent[e["Drainage division"]]={series2:o.map(i=>e[i])}});let a=soefinding.getDefaultPieChartOptions();a.chart.type="donut",a.chart.id="chart2",a.labels=o,a.xaxis={categories:["Drainage division","Hectares"]},a.tooltip={y:{formatter:(e,i)=>{let h=i.globals.seriesPercent[i.seriesIndex][0];return`${e.toLocaleString()} (${h.toFixed(1)}%)`}}},soefinding.findingContent.Queensland={series2:[1,2,3]},soefinding.state.chart2={series:soefinding.findingContent[soefinding.state.currentRegionName].series2,options:a,chartactive:!0};let c=[...o,"Total"];soefinding.findingJson.data.filter(e=>e["Drainage division"]!="Other"&&e["Drainage division"]!="Queensland"&&e.Indicator=="Percent of pre-clear").forEach(e=>{soefinding.findingContent[e["Drainage division"]].series3=[{name:"Percent",data:c.map(i=>e[i])}]}),soefinding.findingContent.Queensland.series3=soefinding.findingJson.data.filter(e=>e.Indicator=="Percent of pre-clear").map(e=>({name:e["Drainage division"],data:c.map(i=>e[i])}));let t=soefinding.getDefaultColumnChartOptions();t.tooltip.y={formatter:e=>e},t.xaxis.categories=c,t.xaxis.title.text="Wetland system",delete t.xaxis.tickPlacement,t.yaxis.title.text="Percent",t.yaxis.forceNiceScale=!1,t.yaxis.min=0,t.yaxis.max=100,t.yaxis.tickAmount=5,t.yaxis.labels.formatter=e=>Math.round(e),soefinding.state.chart3={options:t,series:soefinding.findingContent.Queensland.series3,chartactive:!0},soefinding.state.chart4={options:t,series:soefinding.findingContent[soefinding.state.currentRegionName].series3,chartactive:!0};let f="",l=JSON.parse(document.getElementById("jsonData2").textContent),g=l.meta.fields.slice(2);soefinding.findingContent.Other={},l.data.forEach(e=>{f!=e["Drainage division"]?(soefinding.findingContent[e["Drainage division"]].series5=[{name:e["Wetland system"],data:g.map(i=>e[i])}],f=e["Drainage division"]):soefinding.findingContent[e["Drainage division"]].series5.push({name:e["Wetland system"],data:g.map(i=>e[i])})});let r=soefinding.getDefaultLineChartOptions();r.xaxis.categories=g.map(e=>e.replace("-","\u2013")),r.xaxis.title="Year",r.yaxis.title="Change in hectares",delete r.yaxis.forceNiceScale,r.yaxis.labels.formatter=e=>soefinding.convertToUnicodeMinus(e),soefinding.state.chart5={options:r,series:soefinding.findingContent[soefinding.state.currentRegionName].series5,chartactive:!0};let d="TODO YEAR";soefinding.vueApp=new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>`Freshwater wetland systems extent by region, 2024  ${d}`,heading2:()=>`Proportion of freshwater wetland systems extent in ${soefinding.state.currentRegionName}, ${d}`,heading3:()=>`"Freshwater wetland systems percentage of pre-clear extent remaining, ${d}`,heading4:()=>`Freshwater wetland system percentage of pre-clear extent remaining in ${soefinding.state.currentRegionName}, ${d}`,heading5:function(){return`Trends in change (loss or gain) in freshwater wetland systems in ${this.currentRegionName}`}},methods:{formatter1:e=>e.toLocaleString(),formatter3:e=>e.toFixed(1),formatter5:e=>soefinding.convertToUnicodeMinus(e)}}),window.soefinding.onRegionChange=function(){m(),this.vueApp.currentRegionName!="Queensland"&&(this.vueApp.chart2.series=this.findingContent[this.state.currentRegionName].series2,this.vueApp.chart4.series=this.findingContent[this.state.currentRegionName].series3),this.vueApp.chart5.series=this.findingContent[this.state.currentRegionName].series5,soefinding.loadFindingHtml()}});function m(){Array.from(document.querySelectorAll("div.displayQld")).forEach(function(s){s.style.display=soefinding.state.currentRegionName=="Queensland"?"block":"none"}),Array.from(document.querySelectorAll("div.displayRegional")).forEach(function(s){s.style.display=soefinding.state.currentRegionName!="Queensland"?"block":"none"})}window.addEventListener("load",function(){window.setTimeout(m,1)});
//# sourceMappingURL=extent-change-freshwater.js.map