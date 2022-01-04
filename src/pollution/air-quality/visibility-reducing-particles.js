"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(1);

	// chart 1. particles
	const particleSeries = soefinding.findingJson.data.map(d => {
		return {
			name: d.Airshed,
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = soefinding.yearKeys
	options1.xaxis.title.text = "Year"
	options1.xaxis.axisTicks = { show: false }
	options1.xaxis.labels.rotateAlways = true
	options1.yaxis.title.text = "Number of days"
	options1.yaxis.forceNiceScale = false
	options1.yaxis.min = 0
	options1.yaxis.max = 40
	options1.yaxis.tickAmount = 4


	soefinding.state.chart1 = {
		options: options1,
		series: particleSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Number of days when the 1-hour visibility-reducing particle concentrations exceed the Air EPP goal` },

		},
		methods: {
			formatter: function (val) { return (val ?? '').toLocaleString() },
			onStackedRadioClick: function () {
				this.chart1.options.chart.type = "bar"
				this.chart1.options.chart.stacked = true
			},
			onLineRadioClick: function () {
				this.chart1.options.chart.type = "line"
				this.chart1.options.chart.stacked = false
				this.chart1.options.markers = { size: 4 } // ignored by column chart
				this.chart1.options.tooltip.shared = false
			}
		}
	})
})
