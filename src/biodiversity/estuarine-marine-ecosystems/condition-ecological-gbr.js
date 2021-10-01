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