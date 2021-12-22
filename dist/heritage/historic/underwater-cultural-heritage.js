"use strict";document.addEventListener("DOMContentLoaded",function(){let i=[...new Set(soefinding.findingJson.data.map(e=>e.Year))],a=[...new Set(soefinding.findingJson.data.map(e=>e.Entry))],s=a.map(e=>({name:e,data:soefinding.findingJson.data.filter(t=>t.Entry==e).map(t=>t["Updates to existing entries"])})),n=soefinding.getDefaultStackedColumnChartOptions();n.xaxis.categories=i,n.xaxis.title.text="Year",n.yaxis.title.text="Number of entries",soefinding.state.chart1={options:n,series:s,chartactive:!0};let r=a.map(e=>({name:e,data:soefinding.findingJson.data.filter(t=>t.Entry==e).map(t=>t["New entries"])}));soefinding.state.chart2={options:n,series:r,chartactive:!0},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Queensland underwater cultural heritage entries updated in the AUCHD",heading2:()=>"Queensland underwater cultural heritage entries added to the AUCHD"},methods:{formatter1:e=>e.toLocaleString()}})});
//# sourceMappingURL=underwater-cultural-heritage.js.map