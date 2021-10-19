"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const keys = soefinding.findingJson.meta.fields.slice(2, 5)
	soefinding.state.year = "2016"


	const series1Items = soefinding.findingJson.data.filter(d=> d.Measure == "2016 Census Number of Dwellings")
	series1Items.forEach(d => 
		soefinding.findingContent[d["Regional Planning Area"]] = { series1: keys.map(k => d[k]) }
	)

	const options1 = soefinding.getDefaultPieChartOptions()
	options1.labels = keys.map(k => k.replace("-", ""))
	options1.xaxis.categories = ["Type", "Amount"]

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		options: options1,
		chartactive: true,
	}




	soefinding.vueApp = new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function() { 
				if (this.currentRegionName == "Queensland")
					return `Number of dwellings in ${this.year} Queensland census`
				else
					return `Number of dwellings in ${this.currentRegionName} in ${this.year} Queensland census`
			},
			heading2: () => "",
			heading3: () => "",
			heading4: () => "",
		},
		methods: {
			formatter1: val => val.toLocaleString(),
		}
	})


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region
		// chart 1
		soefinding.vueApp.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series1

		// chart 2
		// if (this.state.currentRegionName != "Queensland") {
		// 	ApexCharts.exec("chart2", "updateSeries", this.findingContent[this.state.currentRegionName].series2)
		// 	soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2
		// }

		// // chart 3
		// ApexCharts.exec("chart3", "updateSeries", this.findingContent[this.state.currentRegionName].series3)
		// soefinding.state.chart3.series = this.findingContent[this.state.currentRegionName].series3



		// but we also need this for the chart to update
		//		ApexCharts.exec("chart1", "updateOptions", {
		//			xaxis: { categories: this.findingContent[this.state.currentRegionName].groups }
		//		}, true)
		// this works on the table
		//		options1.xaxis.categories = this.findingContent[this.state.currentRegionName].groups

		soefinding.loadFindingHtml()
	}

})