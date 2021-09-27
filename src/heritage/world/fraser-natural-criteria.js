"use strict"
document.addEventListener("DOMContentLoaded", function () {

	const series = soefinding.findingJson.data.map(d => d["Criteria summary"])

	const options = {
		xaxis: { categories: ["World Heritage natural criteria", "Criteria summary"] },
		labels: soefinding.findingJson.data.map(d => d["World heritage natural criteria"])
	}

	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: false,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Fraser Island (K'gari) World Heritage natural criteria`
		},
		methods: {
			formatter1: val => val,
		}
	})

})