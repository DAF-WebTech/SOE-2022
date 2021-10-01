"use strict";

document.addEventListener("DOMContentLoaded", function () {

	//get the json parsed data  
	var jsonDataElement = document.getElementById("jsonData");
	const parsed = JSON.parse(document.getElementById("jsonData").textContent)
	console.log(parsed);

	new Vue({
		el: "#chartContainer",
		data: parsed,
	})

})
