"use strict";document.addEventListener("DOMContentLoaded",function(){let a=soefinding.findingJson.meta.fields.slice(1),o=a[a.length-1],c=a.slice(a.length-4),l=soefinding.findingJson.data.find(t=>t.Material=="Total"),d=[{name:"Tonnes",data:c.map(t=>l[t])}],e=soefinding.getDefaultBarChartOptions();e.markers={size:4},e.tooltip.y={formatter:t=>t.toLocaleString()},e.xaxis.categories=c.map(t=>t.replace("-","\u2013")),e.xaxis.title.text="Year",e.yaxis.labels.formatter=t=>`${(t/1e6).toFixed(1)}M`,e.yaxis.max=3e6,e.yaxis.min=0,e.yaxis.tickAmount=6,e.yaxis.title.text="Tonnes (million)",e.yaxis.forceNiceScale=!1,soefinding.state.chart1={options:e,series:d,chartactive:!0};let f=[{name:"Total",data:a.map(t=>l[t])}],i=soefinding.getDefaultLineChartOptions();i.xaxis.categories=a.map(t=>t.replace("-","\u2013")),i.xaxis.title.text="Year",i.xaxis.labels.rotateAlways=!0,i.yaxis.title.text="Tonnes (million)",i.yaxis.labels.formatter=t=>`${(t/1e6).toFixed(1)}M`,i.tooltip.y={formatter:t=>t.toLocaleString()},soefinding.state.chart2={options:i,series:f,chartactive:!0};let r=soefinding.findingJson.data.filter(t=>t.Material!="Total");r.sort(function(t,s){return s[o]-t[o]});let h=r.map(t=>t[o]),n=soefinding.getDefaultPieChartOptions();n.labels=r.map(t=>t.Material),n.tooltip.y={formatter:(t,s)=>{let p=s.globals.seriesPercent[s.seriesIndex][0];return`${t.toLocaleString()} (${p.toFixed(1)}%)`}},n.xaxis.categories=["Material","Tonnes"],soefinding.state.chart3={options:n,series:h,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Construction and demolition waste recovered",heading2:()=>"Trend in total construction and demolition waste recovered",heading3:()=>`Proportion of construction and demolition waste recovered by material, ${o.replace("-","\u2013")}`},methods:{formatter1:t=>t?.toLocaleString()??"",onStackedRadioClick:function(){this.chart1.options.chart.type="bar",this.chart1.options.chart.stacked=!0},onLineRadioClick:function(){this.chart1.options.chart.type="line",this.chart1.options.chart.stacked=!1,this.chart1.options.markers={size:4},this.chart1.options.tooltip.shared=!1}}})});
//# sourceMappingURL=construction-demolition-recovered.js.map