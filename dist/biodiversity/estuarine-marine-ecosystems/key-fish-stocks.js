"use strict";document.addEventListener("DOMContentLoaded",function(){var jsonDataElement=document.getElementById("jsonData");const parsed=JSON.parse(document.getElementById("jsonData").textContent);console.log(parsed);new Vue({el:"#chartContainer",data:parsed})});
//# sourceMappingURL=key-fish-stocks.js.map