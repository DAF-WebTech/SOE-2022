"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1)
	const latestYear = yearKeys[yearKeys.length - 1]

	soefinding.findingJson.data.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})


	const series1 = soefinding.findingJson.data.map(d => {
		return {
			name: d.Category,
			data: yearKeys.map(y => d[y])
		}
	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.legend.inverseOrder = true
	options1.xaxis.categories = yearKeys
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number of requests"
	options1.yaxis.labels.formatter = val => `${val / 1000}k`
	options1.tooltip.y = { formatter: val => val.toLocaleString() } 

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	};


	const series2 = soefinding.findingJson.data.map(d => d[latestYear])

	const options2 = soefinding.getDefaultPieChartOptions()
	options2.labels = soefinding.findingJson.data.map(d => d.Category) // the pie charts uses labels, but the table vue is looking for categories
	options2.xaxis.categories = ["Category", "Searches"] // not needed for chart, but vue uses them for table headings
	options2.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
			}
		}
	}

	soefinding.state.chart2 = {
		options: options2,
		series: series2,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Number of cultural heritage search requests, by category",
			heading2: () => `Proportion of cultural heritage search requests by category, ${latestYear}`
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})
	
		window.soefinding.onRegionChange = function () {
			soefinding.loadFindingHtml()
		}


})
