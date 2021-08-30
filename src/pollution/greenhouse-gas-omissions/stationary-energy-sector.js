"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. pie, proportion by state, latest year

	const allStates = soefinding.findingJson.data.filter(d => d.Category.includes("All"))
	const allStatesSeries = allStates.map(d => d[latestYear])

	const options1 = soefinding.getDefaultPieChartOptions()
	// the pie charts uses labels, but the table vue is looking for categories
	options1.labels = allStates.map(d => d.Category)
	options1.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
			}
		}
	}
	options1.xaxis.categories = ["Sector", "Emissions (million tonnes)"] // not needed for chart, but vue uses them for table headings

	soefinding.state.chart1 = {
		options: options1,
		series: proportionSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of stationary energy emissions by state, ${latestYear}`,
			//			heading2: () => `Comparison of state and territory emissions by sector, ${latestYear}`,
			//			heading3: () => `Trends in Queensland emissions, by sector`,
			//			heading4: () => "Total Queensland emissions"
		},
		methods: {
			formatter1: val => val.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) //reüse for 2, 3
		}
	})
})
