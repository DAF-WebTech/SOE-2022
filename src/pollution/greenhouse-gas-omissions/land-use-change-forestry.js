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
			heading1: () => `Proportion of agriculture emissions by state, ${latestYear}`,
			heading2: () => `Proportion of Queensland’s agriculture emissions by category, ${latestYear}`,
			heading3: () => "Trends in Queensland’s agriculture emissions, by category",
			heading4: () => "Queensland’s total agriculture emissions"
		},
		methods: {
			formatter1: val => val.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) //reüse for 2, 3
		}
	})
})
