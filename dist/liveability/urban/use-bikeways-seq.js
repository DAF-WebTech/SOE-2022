"use strict";document.addEventListener("DOMContentLoaded",function(){let i=soefinding.findingJson.meta.fields.slice(1),s=i.map(t=>({name:t,data:soefinding.findingJson.data.map(n=>n[t])})),e=soefinding.getDefaultColumnChartOptions();e.xaxis.categories=soefinding.findingJson.data.map(t=>t.Site),e.xaxis.title.text="Location",e.xaxis.labels.trim=!0,e.yaxis.title.text="Average daily count",soefinding.state.chart1={options:e,series:s,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>`Daily use of bikeways ${i[0]} to ${i[i.length-1]}`},methods:{formatter1:t=>{var n;return(n=t==null?void 0:t.toLocaleString())!=null?n:""}}})});
//# sourceMappingURL=use-bikeways-seq.js.map