"use strict"

document.addEventListener("DOMContentLoaded", function () {

	// normalise queensland
	const regions = soefinding.findingJson.meta.fields.slice(1)

	// fix "Queensland Wide" to Queensland, and assuming it was in last position
	regions[regions.length - 1] = "Queensland" 
	soefinding.findingJson.data.forEach(d => {
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
			}],
			categories1: ["1999", String(soefinding.findingJson.data[3][r]).replace("-", "–")]
		}
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].categories1
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Hectares"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val/1000000}M` : (val >= 1000 ? `${val/1000}K` : val)
	options1.yaxis.labels.minWidth = 30
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
			}
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})

	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.options.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].categories1
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series1


		soefinding.loadFindingHtml()
	}

})
