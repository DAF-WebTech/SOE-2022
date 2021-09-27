"use strict"
document.addEventListener("DOMContentLoaded", function () {

	const series = [ {
		name: null,
		data: soefinding.findingJson.data.map(d => d["Criteria summary"])
	}
]

	const options = {
		xaxis: { categories: ["World Heritage natural criteria", "Condition summary", "Condition grade"] }
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
			heading1: () => `Great Barrier Reef World Heritage natural criteria condition`
		},
		methods: {
			formatter1: val => val,
		}
	})

})