"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(2)

	series1keys = ["Total Nitrogen (tonne)", "Total Phosphorus (tonne)"]
	series1items = soefinding.findingJson.data.filter(d => series1.includes(d.Variable))
	const series1 = series1keys.map(k => {
		return {
			name: k,
			data: years.map(y => series1items.reduce((acc, curr) => {
				return acc + curr[y]
			}, 0))
		}
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.xaxis.categories = years
	options1.xaxis.title.text= "Year"
	options1.yaxis.title.text = "Load (tonnes)"
	//options1.yaxis.labels.formatter = val => val.toLocaleString()


	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Treated sewage total nitrogen and phosphorous (for SEQ and GBR)",
			heading2: () => ""
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region

		// chart 1
		// ApexCharts.exec("chart1", "updateSeries", this.findingContent[this.state.currentRegionName].series1)
		// soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series1

		// // but we also need this for the chart to update
		// ApexCharts.exec("chart1", "updateOptions", {
		// 	xaxis: { categories: this.findingContent[this.state.currentRegionName].groups }
		// }, true)
		// // this works on the table
		// options1.xaxis.categories = this.findingContent[this.state.currentRegionName].groups

		// // chart 2, pie chart, labels stay the same
		// ApexCharts.exec("chart2", "updateSeries", this.findingContent[this.state.currentRegionName].series2)
		// soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2


		soefinding.loadFindingHtml()
	}
})