"use strict";document.addEventListener("DOMContentLoaded",function(){let e=soefinding.findingJson.data.map(a=>a["Criteria summary"]),t={xaxis:{categories:["World Heritage natural criteria","Criteria summary"]},labels:soefinding.findingJson.data.map(a=>a["World heritage natural criteria"])};soefinding.state.chart1={options:t,series:e,chartactive:!1},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Gondwana Rainforests of Australia World Heritage natural criteria"},methods:{formatter1:a=>a}})});
//# sourceMappingURL=gondwana-natural-criteria.js.map