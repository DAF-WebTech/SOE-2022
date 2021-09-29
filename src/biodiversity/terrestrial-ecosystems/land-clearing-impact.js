"use strict";

document.addEventListener("DOMContentLoaded", function () {

const yearKeys = soefinding.meta.fields.slice(2)

const totalClearing = soefinding.findingJson.data.filter(d => d["Clearing type"] == "Total clearing")
soefinding.findingContent.Queensland.series1 = totalClearing.map(d => {
	return {
		name: d.Bioregion,
		data: yearKeys.map(y => d[y])
	}
})

const options1 = soefinding.getDefaultColumnChartOptions()
options1.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // en dash
options1.xaxis.title = "Year range"
options1.yaxis.title = "Hectares per year"

soefinding.state.chart1 = {
	options: options1,
	series: soefinding.findingContent.Queensland.series1,
	chartactive: true,
}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of total woody vegetation clearing, by bioregion`,
			heading2: () => `Proportion area of biodiversity status, ${latestYear}`,
			heading3: () => `Trends in extent of remnant vegetation, by biodiversity status in ${soefinding.state.currentRegionName}`,
			heading4: () => `Proportion of regional ecosystems by biodiversity status in ${soefinding.state.currentRegionName}, ${latestYear}`,
			heading5: () => `Proportion area of biodiversity status in ${soefinding.state.currentRegionName}, ${latestYear}`
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})



	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region
		// chart 3
		// ApexCharts.exec("chart3", "updateSeries", this.findingContent[this.state.currentRegionName].series3)
		// soefinding.state.chart3.series = this.findingContent[this.state.currentRegionName].series3
		//ApexCharts.exec("chart4", "updateOptions", { labels: fields }, true)

	
	soefinding.loadFindingHtml()
}
})