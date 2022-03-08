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

	const options = soefinding.getDefaultColumnChartOptions()
	options.legend.showForNullSeries = false
	options.tooltip.y = { formatter: val => `${val} million ha` }
	options.xaxis.categories = [...years]
	delete options.xaxis.tickPlacement
	options.xaxis.title.text = "Year"
	delete options.yaxis.forceNiceScale
	options.yaxis.labels.formatter = val => `${val.toFixed(2)}M`
	options.yaxis.title.text = "Hectares (millions)"

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series,
		options,
		chartactive: true,
	}


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: function () {
				return `Cropped area (million ha) by season in ${this.currentRegionName}`
			}

		},
		methods: {
			formatter1: val => val?.toFixed(2) ?? "n/a",
			onColumnRadioClick: function () {
				this.chart1.options.chart.type = "bar"
			},
			onLineRadioClick: function () {
				this.chart1.options.chart.type = "line"
				this.chart1.options.markers = { size: 4 } // ignored by column chart
				this.chart1.options.tooltip.shared = false
			}
		}
	}).mount("#chartContainer")


	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series

		soefinding.loadFindingHtml()
	}

})