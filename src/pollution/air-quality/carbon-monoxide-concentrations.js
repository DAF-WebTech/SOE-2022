"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(1);

	// chart 1. carbon monoxide
	const coSeries = soefinding.findingJson.data.map(d => {
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
	options1.tooltip.y = { formatter: val => `${val} days` }
	options1.yaxis.title.text = "Number of days"
	options1.yaxis.labels.formatter = val => val


	soefinding.state.chart1 = {
		options: options1,
		series: coSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Annual maximum 8-hour average carbon monoxide concentrations` },

		},
		methods: {
			formatter1: function (val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "" },
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
	});
})
