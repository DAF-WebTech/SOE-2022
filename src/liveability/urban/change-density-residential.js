"use strict";

document.addEventListener("DOMContentLoaded", function () {
	const densityKeys = soefinding.findingJson.meta.fields.slice(2, 4)

	// line chart for qld only, dwelling density
	const series1Items = soefinding.findingJson.data.filter(d => d.Measure == "Dwelling density" && d["Regional Planning Area"] != "Queensland")
	const series1 = densityKeys.map(k => {
		return {
			name: k,
			data: series1Items.map(d => d[k])
		}
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.xaxis.categories = series1Items.map(d => d["Regional Planning Area"].split(/\s|–/))
	options1.xaxis.labels.hideOverlappingLabels = false
	options1.xaxis.labels.rotate = 0
	options1.xaxis.labels.rotateAlways = false
	options1.xaxis.tickPlacement = "between"
	options1.xaxis.title.text = "Region planning area"
	options1.yaxis.title.text = "Dwellings/hectare"
	options1.yaxis.tickAmount = 4
	options1.yaxis.labels.formatter = val => Math.round(val)
	options1.tooltip.y = { formatter: val => val }

	soefinding.state.chart1 = {
		series: series1,
		options: options1,
		chartactive: true,
	}
	soefinding.findingContent.Queensland = { html: "" }


	// line chart for each region, dwelling density
	series1Items.forEach(d => {
		soefinding.findingContent[d["Regional Planning Area"]] = {
			series2: [{
				name: "Density",
				data: densityKeys.map(k => d[k])
			}]
		}
	})

	const options2 = soefinding.getDefaultColumnChartOptions()
	options2.xaxis.categories = densityKeys
	options2.xaxis.tickPlacement = "between"
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Dwellings/hectare"

	soefinding.state.chart2 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		options: options2,
		chartactive: true,
	}




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Mean population-weighted dwelling density for Queensland",
			heading2: function() {
				return `Mean population-weighted dwelling density for ${this.currentRegionName}`
			},
			heading3: () => "",
			heading4: () => "",
		},
		methods: {
			formatter1: val => val.toFixed(1),
		}
	})

	
	window.soefinding.onRegionChange = function () {
		soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].series2


		soefinding.loadFindingHtml()
	}


})