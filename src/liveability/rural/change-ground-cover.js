"use strict";

document.addEventListener("DOMContentLoaded", function () {

	//const years = 
	const latestYear = soefinding.findingJson.meta.fields.at(-2)

	const series1Items = soefinding.findingJson.data.filter(d => d.Region != "QLD")

	const series1 = [
		{
			name: "Groundcover (%)",
			data: series1Items.map(d => d[latestYear]),
			type: "column"
		}, 
		{
			name: "All year mean",
			data: series1Items.map(d => d.AllYearMean),
			type: "line"
		}
	]
	
	const  options1 = soefinding.getDefaultLineChartOptions()
	options1.xaxis.categories = series1Items.map(d => d.Region)
	options1.xaxis.title.text = "Region"
	options1.yaxis.title.text = "Groundcover (%)"
	options1.yaxis.labels.formatter = val => Math.round(val)
	options1.tooltip.y = { formatter: val => val }
	options1.yaxis.min = 0

	soefinding.state.chart1 = {
		series: series1,
		options: options1,
		chartactive: true,
	}








	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Mean late dry season ground cover (%), ${latestYear}`,
			heading2: function() {
				return `Mean population-weighted dwelling density for ${this.currentRegionName}`
			},
			heading3: () => "Change in median lot size in regions for Queensland",
			heading4: function() {
				return `Change in median lot size in regions for ${this.currentRegionName}`
			},
			heading5: () => "Change in number of urban lot registrations for Queensland",
			heading6: function() {
				return `Change in number of urban lot registrations for ${this.currentRegionName}`
			},

		},
		methods: {
			formatter1: val => val.toFixed(1),
			formatter4: val => val
		}
	})




	window.soefinding.onRegionChange = function () {
		soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].series2
		soefinding.state.chart4.series = soefinding.findingContent[soefinding.state.currentRegionName].series4
		soefinding.state.chart6.series = soefinding.findingContent[soefinding.state.currentRegionName].series6


		soefinding.loadFindingHtml()
	}


})