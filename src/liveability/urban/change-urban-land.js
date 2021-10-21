"use strict"

document.addEventListener("DOMContentLoaded", function () {

	// normalise queensland
	const regions = soefinding.findingJson.meta.fields.slice(1)
	regions[regions.length - 1] = "Queensland" // assuming "Queensland Wide" was the last one

	soefinding.data.forEach(d => {
		const temp = d["Queensland Wide"]
		delete d["Queensland Wide"]
		d.Queensland = temp
	})


	// chart 1, each region and qld
	regions.forEach(r => {
		soefinding.findingContent[r] = {
			series1: [{
				name: "Hectares",
				data: [soefinding.findingJson.data[1][r], soefinding.findingJson.data[2][r]]
			}]
		}
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Hectares"
	options1.yaxis.title.formatter = val => val >= 1000000 ? val/1000000 : (val >= 1000 ? val/1000 : val)
	options1.tooltip.y = { formatter: val => val.toLocaleString() }

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		options: options1,
		chartactive: true,
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function() {
				if (this.currentRegionName == "Queensland")
					return "Urban area growth between 1999 and 2017*" 
				else 
					return `Urban area growth between 1999 and ${soefinding.findingJson.data[3][this.currentRegionName]} in ${this.currentRegionName}`
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})

	window.soefinding.onRegionChange = function () {
		// soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].series2
		// soefinding.state.chart4.series = soefinding.findingContent[soefinding.state.currentRegionName].series4
		// soefinding.state.chart6.series = soefinding.findingContent[soefinding.state.currentRegionName].series6


		soefinding.loadFindingHtml()
	}



})
