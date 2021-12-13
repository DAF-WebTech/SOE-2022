"use strict"
document.addEventListener("DOMContentLoaded", function () {

	const series = {
		tableHeadings: ["World Heritage natural criteria", "Condition summary", "Condition grade"],
		data: soefinding.findingJson.data,
		dial: {
			number: 5,
			val: "Good, Borderline Poor",
			measure: "Condition",
			rankings: ["Very Good", "Good", "Poor", "Very Poor"]
		}
	}


	new Vue({
		el: "#chartContainer",
		data: series,
		methods: {
			getdialurl1: function () {
				return soefinding.getDialUrl(this.dial.number)
			}
		}
	})

})