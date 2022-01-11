"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const areas = soefinding.findingJson.meta.fields.slice(2)

	const regions = new Map()
	const years = new Set()
	soefinding.findingJson.data.forEach(d => {
		if (!regions.has(d.Region))
			regions.set(d.Region, [])

		regions.get(d.Region).push(d)

		years.add(d.Year)
	})

	for (let [region, data] of regions) {
		soefinding.findingContent[region] = {
			series: areas.map(a => {
				let displayA = a.split("(")
				displayA[1] = "(" + displayA[1]

				return {
					name: displayA,
					data: data.map(d => d[a])
				}
			})
		}
	}

	const options = soefinding.getDefaultStackedColumnChartOptions()
	options.xaxis.categories = [...years]
	options.xaxis.title.text = "Year"
	options.yaxis.title.text = "Hectares (millions)"
	options.yaxis.labels.formatter = val => `${Number.isInteger(val) ? val : val.toFixed(3)}M`
	options.legend.showForNullSeries = false
	options.tooltip.y = { formatter: val => `${(val * 1000000).toLocaleString()}ha` }

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series,
		options,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () {
				return `Cropped area (million ha) by season in ${this.currentRegionName}`
			}

		},
		methods: {
			formatter1: val => val?.toFixed(2) ?? "n/a",
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


	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series

		soefinding.loadFindingHtml()
	}

})