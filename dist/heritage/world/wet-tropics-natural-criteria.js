"use strict";document.addEventListener("DOMContentLoaded",function(){let t=soefinding.findingJson.data.map(e=>e["Criteria summary"]),a={xaxis:{categories:["World Heritage natural criteria","Criteria summary"]},labels:soefinding.findingJson.data.map(e=>e["World Heritage natural criteria"])};soefinding.state.chart1={options:a,series:t,chartactive:!1},new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>"Wet Tropics of Queensland World Heritage natural criteria"},methods:{formatter1:e=>e}})});
//# sourceMappingURL=wet-tropics-natural-criteria.js.map