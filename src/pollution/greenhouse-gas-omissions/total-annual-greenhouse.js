"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const latestYear = soefinding.findingJson.meta.fields[soefinding.findingJson.meta.fields.length - 1]

	// chart 1. pie, Queensland proportion
	const qldSectors = data.filter(d => d.State == "Queensland" && d.Sector != "All (incl. LULUCF)")
	const proportionSeries = qldSectors.map(d => d[latestYear])

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultPieChartOptions()
	// the pie charts uses labels, but the table vue is looking for categories
	options1.labels = qldSectors.map(d => d.Sector)
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
			heading1: () => `Proportion of Queensland’s emissions by sector, ${latestYear}`,
		},
		methods: {
			formatter1: val => val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
		}
	})
})
