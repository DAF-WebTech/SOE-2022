"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series = soefinding.findingJson.data.map(d => {
		return {
			name: d["Ecological proceses"],
			data: [data["Ecological processes condition statement"], data["Condition grade"]]
		}
	})

	const options = { xaxis: { categories: soefinding.findingJson.meta.fields } }

	soefinding.state.chart1 = {
		options: options,
		series: series1,
		chartactive: true,
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Condition of ecological processes in the Great Barrier Reef, 2024 TODO fix year",

		},
		methods: {
			formatter1: val => val,
		}
	})
})