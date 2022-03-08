"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(1)

	soefinding.findingContent.Queensland = { series: [] }
	soefinding.findingJson.data.forEach(d => {
		soefinding.findingContent[d.Region] = {
			series: [{
				name: "Places",
				data: years.map(y => d[y])
			}]
		}

		soefinding.findingContent.Queensland.series.push({
			name: d.Region,
			data: years.map(y => d[y])
		})
	})


	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.chart.id = "chart1"
	options1.markers = { size: 4 } // ignored by column chart
	options1.tooltip.shared = false
	options1.xaxis.categories = years
	options1.xaxis.title.text = "Year"
	options1.yaxis.forceNiceScale = false
	options1.yaxis.max = 10
	options1.yaxis.min = 0
	options1.yaxis.title.text = "Number of places"
	

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series,
		options: options1,
		chartactive: true,
	}


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: function () {
				if (this.currentRegionName == "Queensland")
					return "Number of places, by cultural heritage region"
				else
					return `Number of places in ${this.currentRegionName} cultural heritage region`
			}
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
			}
		}
	}).mount("#chartContainer")


	window.soefinding.onRegionChange = function () {

		ApexCharts.exec("chart1", "updateOptions", {
			series: soefinding.findingContent[soefinding.state.currentRegionName].series
		})

		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series

		soefinding.loadFindingHtml()
	}

})