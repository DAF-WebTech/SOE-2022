"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.jsonData.meta.fields.slice(1)
	const latestYear = yearKeys[yearKeys.length - 1]

	//1. totals for latest year
	const totals = soefinding.jsonData.meta.find(d => d["Waste description"] == "Total"])

	const totalSeries = {
		name: `Total for ${latestYear}`,
		data: yearKeys.map(y => totals[y])
	}

	const options1 = soefinding.getDefaultBarChartOptions()

	// create vue instance for first chart
	soefinding.state.chart1 = {
		options: options1,
		series: totalSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Trackable waste landfilled",
			heading2: () => `Proportion of trackable waste landfilled by waste type, ${latestYear.replace("-", "–")}`,
		},
		methods: {
			formatter1: val => val,
		}
	})
})
