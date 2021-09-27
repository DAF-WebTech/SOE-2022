"use strict"
document.addEventListener("DOMContentLoaded", function () {

	const series = soefinding.findingJson.data.map(d => d["Criteria summary"])

	const options = {
		xaxis: { categories: ["World Heritage natural criteria", "Criteria summary"] },
		labels: soefinding.findingJson.data.map(d => d["World Heritage natural criteria"])
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
			heading1: () => `Great Barrier Reef World Heritage natural criteria`
		},
		methods: {
			formatter1: val => val,
		}
	})

})