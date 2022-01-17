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

	//todo, we will need to rewrite this page to accommodate the expected regions
	//this is just to make sure the page works without error
	soefinding.regionNames.forEach(r => soefinding.findingContent[r] = {})


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Number of cultural heritage search requests, by category",
			heading2: () => `Proportion of cultural heritage search requests by category, ${latestYear}`
		},
		methods: {
			formatter1: val => val.toLocaleString(),
			onStackedRadioClick: function () {
				this.chart1.options.chart.type = "bar"
				this.chart1.options.chart.stacked = true
			},
			onLineRadioClick: function () {
				this.chart1.options.chart.type = "line"
				this.chart1.options.chart.stacked = false
				this.chart1.options.markers = { size: 4 } // ignored by column chart
				this.chart1.options.tooltip.shared = false
			},
			formatPercent: function(s, i, series) {
                const sum = series.reduce((acc, curr) => acc + curr )
                return (s / sum * 100 ).toFixed(1)
            }


		}
	})

	window.soefinding.onRegionChange = function () {

		soefinding.state.chart1.series = soefindingContent[this.currentRegionName].series1
		soefinding.state.chart2.series = soefindingContent[this.currentRegionName].series2


		soefinding.loadFindingHtml()
	}


})
