"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const keys = soefinding.findingJson.meta.fields.slice(1)

	const series = keys.map(k => {
		return {
			name: k,
			data: soefinding.findingJson.data.map(d => d[k])
		}
	})


	const options = soefinding.getDefaultColumnChartOptions()
	options.xaxis.tickPlacement = "between"
	options.xaxis.categories = soefinding.findingJson.data.map(d => d.Year)
	options.xaxis.title.text = "Year"
	options.yaxis.title.text = "Number of vehicles"
	options.yaxis.labels.minWidth = 30
	options.yaxis.labels.formatter = val => {
		if (val >= 1000000)
			return `${Math.round(val / 1000000)}m`
		else
			return `${Math.round(val / 1000)}k`
	}
	options.tooltip.y = { formatter: val => val?.toLocaleString() ?? "" }


	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Number of light and heavy vehicles registered in Queensland`
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
			}
		}
	})
})
