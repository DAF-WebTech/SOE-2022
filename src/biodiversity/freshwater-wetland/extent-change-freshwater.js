"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series1items = soefinding.findingJson.data.filter(d=> d["Drainage division"] != "Queensland" && d.Indicator == "Area (ha)")
	const series1names = soefinding.findingJson.meta.fields.slice(2,5)
	const series1 = series1items.map(d => {
		return {
			name: d["Drainage division"],
			data: series1names.map(n => d[n])
		}
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.tooltip = { y: { formatter: val => val.toLocaleString() } } 
	options1.xaxis.categories = series1names
	options1.xaxis.title.text = "Wetland System"
	options1.yaxis.labels.fomatter = val >= 1000000 ? val/1000000 + "M" : val/1000 + "K" 
	options1.yaxis.title.text = "Hectares"
	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Freshwater wetland systems extent by region, 2024  TODO fix year`,
			heading2: () => `Proportion of freshwater wetland systems extent in ${soefinding.state.currentRegionName}, 2024 TODO fix year`
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region

		// chart 1
//		ApexCharts.exec("chart1", "updateSeries", this.findingContent[this.state.currentRegionName].series1)
//		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series1

		// but we also need this for the chart to update
//		ApexCharts.exec("chart1", "updateOptions", {
//			xaxis: { categories: this.findingContent[this.state.currentRegionName].groups }
//		}, true)
		// this works on the table
//		options1.xaxis.categories = this.findingContent[this.state.currentRegionName].groups

		soefinding.loadFindingHtml()
	}
})