"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const series = [{
		name: "Count",
		data: soefinding.findingJson.data.map(d => d.Count)
	}]

	const options = soefinding.getDefaultBarChartOptions()
	options.xaxis.categories = soefinding.findingJson.data.map(d => d.Year)

	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Count of cyclones that cross the Queensland coast per calendar year`
		},
		methods: {
			formatter1: val => val

		}
	});
})
