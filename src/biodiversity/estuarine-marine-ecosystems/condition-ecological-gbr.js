"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series = soefinding.findingJson.data.map(d => {
		return {
			name: d["Ecological proceses"],
			data: [d["Ecological processes condition statement"], d["Condition grade"]]
		}
	})

	const options = { xaxis: { categories: soefinding.findingJson.meta.fields.slice(1) } }

	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: false,
	}

	soefinding.state.dial = {
		number: 6,
		val: "Good",
		measure: "Condition",
		rankings: ["Very High", "Good", "Poor", "Very Poor"]
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Condition of ecological processes in the Great Barrier Reef, 2024 TODO fix year",
		},
		methods: {
			formatter1: val => val,
			getdialurl1: function () {
				return soefinding.getDialUrl(this.dial.number)
			}

		}
	})

})