"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. bar chart each state total
	const stateTotals = soefinding.findingJson.data.filter(d => d.Category == "All")
	const stateComparisonSeries = stateTotals.map(d => d[latestYear])


	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = stateTotals.map(d => d.Category)

	soefinding.state.chart1 = {
		options: options1,
		series: stateComparisonSeries,
		chartactive: true,
	};




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Comparison of state and territory land use, land use change and forestry (LULUCF) emissions, ${latestYear}`,
			heading2: () => "Trends in Queensland's net land use, land use change and forestry (LULUCF) emissions, by category",
			heading3: () => "Queensland’s total land use, land use change and forestry (LULUCF) emissions",
		},
		methods: {
			formatter1: val => val.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
		}
	})
})
