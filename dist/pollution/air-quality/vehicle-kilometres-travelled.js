"use strict";document.addEventListener("DOMContentLoaded",function(){soefinding.yearKeys=soefinding.findingJson.meta.fields;let n=soefinding.findingJson.data.map(e=>({name:"Kilometres",data:soefinding.yearKeys.map(i=>e[i])})),t=soefinding.getDefaultLineChartOptions();t.xaxis.categories=soefinding.yearKeys,t.xaxis.title.text="Year",t.yaxis.title.text="Kilometres travelled (billions)",t.tooltip.y={formatter:e=>(e*1e9).toLocaleString()},t.yaxis.labels.formatter=function(e){return e},soefinding.state.chart1={options:t,series:n,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:function(){return"Trend in vehicle kilometres travelled (VKT)"}},methods:{formatter1:function(e){var i;return(i=e==null?void 0:e.toLocaleString(void 0,{minimumFractionDigits:3}))!=null?i:""}}})});
//# sourceMappingURL=vehicle-kilometres-travelled.js.map