"use strict";document.addEventListener("DOMContentLoaded",function(){var i=soefinding.findingJson.meta.fields.slice(2);soefinding.yearKeys=[];for(var s=0;s<i.length;s+=3)soefinding.yearKeys.push(i[s].split(" ")[0]);soefinding.state.chart1={series:[],chartactive:!0},soefinding.state.chart2={series:[],chartactive:!0},soefinding.findingJson.data.forEach(function(t){if(t["Protected areas"]=="All"){var e=[];i.forEach(function(a,n){n%3==1&&e.push(t[a])}),soefinding.state.chart2.series.push({name:t.Type,data:e})}else{var e=[];i.forEach(function(n,o){o%3==0&&e.push(t[n])}),soefinding.state.chart1.series.push({name:t["Protected areas"],data:e})}}),soefinding.state.chart1.options=soefinding.getDefaultBarChartOptions(),soefinding.state.chart1.options.chart.stacked=!0,soefinding.state.chart1.options.legend.inverseOrder=!0,delete soefinding.state.chart1.options.xaxis.tickPlacement,soefinding.state.chart1.options.xaxis.categories=soefinding.yearKeys,soefinding.state.chart1.options.xaxis.title.text="Year",soefinding.state.chart1.options.yaxis.title.text="Hectares",soefinding.state.chart1.options.tooltip.y={formatter:function(t){return t==null?"n/a":`${t.toLocaleString()} ha`}},soefinding.state.chart2.options=JSON.parse(JSON.stringify(soefinding.state.chart1.options)),soefinding.state.chart2.options.tooltip.y=soefinding.state.chart1.options.tooltip.y,soefinding.state.chart2.options.yaxis.labels.formatter=t=>t/1e6+"M",soefinding.state.chart3={series:soefinding.state.chart1.series,chartactive:!0},soefinding.state.chart3.options=JSON.parse(JSON.stringify(soefinding.state.chart1.options)),soefinding.state.chart3.options.chart.type="line",soefinding.state.chart3.options.chart.stacked=!1,soefinding.state.chart3.options.tooltip.y=soefinding.state.chart1.options.tooltip.y,soefinding.state.chart3.options.xaxis.tickPlacement="on",soefinding.state.chart3.options.yaxis.labels.formatter=soefinding.state.chart1.options.yaxis.labels.formatter,soefinding.state.chart3.options.tooltip.shared=!1,new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Cumulated number of each protected area",heading2:()=>"Cumulated extent of all protected areas",heading3:()=>"Number of each protected area"},methods:{formatter1:t=>{var e;return(e=t==null?void 0:t.toLocaleString())!=null?e:""}}})});
//# sourceMappingURL=extent-change-protected.js.map