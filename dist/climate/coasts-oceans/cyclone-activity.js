"use strict";document.addEventListener("DOMContentLoaded",function(){let n=[{name:"Count",data:soefinding.findingJson.data.map(t=>t.Count)}],e=soefinding.getDefaultBarChartOptions();e.xaxis.categories=soefinding.findingJson.data.map(t=>t.Year),e.xaxis.title.text="Year",e.yaxis.title.text="Number of cyclones",soefinding.state.chart1={options:e,series:n,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Count of cyclones that cross the Queensland coast per calendar year"},methods:{formatter1:t=>t}})});
//# sourceMappingURL=cyclone-activity.js.map