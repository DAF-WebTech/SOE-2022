"use strict"
document.addEventListener("DOMContentLoaded", function () {

	const series =  {
		tableHeadings: ["World Heritage natural criteria", "Condition summary", "Condition grade"],
		data: soefinding.findingJson.data
	}


	new Vue({
		el: "#chartContainer",
		data: series
	})

})