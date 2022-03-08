"use strict"

document.addEventListener("DOMContentLoaded", function () {

	// sort data
	const data = soefinding.findingJson.data.sort(function (a, b) {
		return b["Tonnes per annum"] - a["Tonnes per annum"]
	})

	// chart 1. pie, emissions
	const series = data.map(d => d["Tonnes per annum"])

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultPieChartOptions()
	// the pie charts uses labels, but the table vue is looking for categories
	options1.labels = data.map(d => d["Emission type"])
	options1.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
			}
		}
	}
	options1.xaxis.categories = ["Emission type", "Tonnes per annum"] // not needed for chart, but vue uses them for table headings

	soefinding.state.chart1 = {
		options: options1,
		series: series,
		chartactive: true,
	};


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => `Proportion of annual average vehicle emissions by type in 2010`,
		},
		methods: {
			formatter1: val => val.toLocaleString(),
			formatPercent: function (s, i, series) {
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(4)
			}

		}
	}).mount("#chartContainer")
})
