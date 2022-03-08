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


	Vue.createApp({
		components: myComponents,
		data() {
			return series
		},
		methods: {
			getdialurl1: function () {
				return soefinding.getDialUrl(this.dial.number)
			}
		}
	}).mount("#chartContainer")


})