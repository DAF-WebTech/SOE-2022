"use strict";

document.addEventListener("DOMContentLoaded", function () {




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "",
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

		// chart 2
		if (this.state.currentRegionName != "Queensland") {
			ApexCharts.exec("chart2", "updateSeries", this.findingContent[this.state.currentRegionName].series2)
			soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2
		}

		// chart 3
		ApexCharts.exec("chart3", "updateSeries", this.findingContent[this.state.currentRegionName].series3)
		soefinding.state.chart3.series = this.findingContent[this.state.currentRegionName].series3



		// but we also need this for the chart to update
		//		ApexCharts.exec("chart1", "updateOptions", {
		//			xaxis: { categories: this.findingContent[this.state.currentRegionName].groups }
		//		}, true)
		// this works on the table
		//		options1.xaxis.categories = this.findingContent[this.state.currentRegionName].groups

		soefinding.loadFindingHtml()
	}

})