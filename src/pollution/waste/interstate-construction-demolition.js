"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1, 6)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. stacked columns, waste by type
	const wasteTypes = soefinding.findingJson.data.filter(d => d["Waste type"] != "All")
	const wasteTypeSeries = wasteTypes.map(d => {
		return {
			name: d["Waste type"],
			data: yearKeys.map(y > d[y])
		}
	})

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.chart.stacked = true
	options1.xaxis.categories = yearKeys

	soefinding.state.chart1 = {
		options: options1,
		series: wasteTypeSeries,
		chartactive: true,
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Interstate construction and demolition waste received, by waste type",
			heading2: () => "Trend in total interstate household waste received",
			heading3: () => "Proportion of interstate household waste received, 2018–19 Other",
			heading4: () => "Interstate household waste received by landfill and other, 2018–2019"
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? ""
		}
	})
})
