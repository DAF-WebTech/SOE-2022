"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(1)

	soefinding.findingContent.Queensland = { series: [] }
	soefinding.findingJson.data.forEach(d => {
		soefinding.findingContent[d.Region] = {
			series: [{
				name: "Plans",
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
	options1.yaxis.title.text = "Number of plans"

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series,
		options: options1,
		chartactive: true,
	}


	window.vueApp = Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1() {
				if (this.currentRegionName == "Queensland")
					return "Number of management plans registered, by cultural heritage region"
				else
					return `Number of management plans registered in ${this.currentRegionName} cultural heritage region`
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
			},
			updateRegion(newRegionName) {
				this.currentRegionName = newRegionName
			}
		},
		watch: {
			currentRegionName(newRegionName) {
				this.chart1.series = soefinding.findingContent[newRegionName].series
				// ApexCharts.exec("chart1", "updateOptions", {
				// 	series: this.chart1.series
				// })
			}
		}
	}).mount("#chartContainer")


})