"use strict";document.addEventListener("DOMContentLoaded",function(){let a=soefinding.findingJson.data,i=[{name:"Six month mean",data:a.map(t=>({x:`${t.Year}-${t.Month.toString().padStart(2,"0")}-01`,y:t["Six month mean"]}))}],e=soefinding.getDefaultLineChartOptions();e.chart.animations={initialAnimation:{enabled:!1}},e.tooltip.y={formatter:t=>t<0?`\u2212${Math.abs(t).toFixed(1)}`:t.toFixed(1)},delete e.xaxis.categories,e.xaxis.title.text="Year",e.xaxis.type="datetime",e.yaxis.title.text="Index",e.yaxis.labels.formatter=t=>t<0?`\u2212${Math.abs(t).toFixed(0)}`:t.toFixed(0),e.stroke={width:1},e.markers.size=0,e.tooltip.x={format:"MMMM yyyy"},i[0].data=i[0].data.slice(-600),soefinding.state.chart1={options:e,series:i,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:function(){return"Southern Oscillation Index 1876\u20132020"}},methods:{formatter1:t=>t?.toFixed(2)??""}})});
//# sourceMappingURL=southern-oscillation-index.js.map