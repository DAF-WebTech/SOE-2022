"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const catchments = soefinding.findingJson.data.filter(d => d.Catchment == d.Subcatchment)
	const series1Keys = soefinding.findingJson.meta.fields.filter(f => f.includes("Woody Vegetation Loss per cent"))
	soefinding.findingContent.Queensland = { series1: null}

	catchments.forEach(d => {
		soefinding.findingContent[d.Catchment] = { 
			series1: [{
				name: d.Catchment,
				data: series1Keys.map(k => d[k])
			}]
		}
	})

	const options1 = soefinding.getDefaultLineChartOptions()
	options1.xaxis.title = "Year"
	options1.xaxis.categories = series1Keys.map(k => k.replace("_", "–").split(" ")[0]) // ndash for year range
	options1.xaxis.tickPlacement = "between"
	options1.yaxis.title = "Percent (%)"
	options1.yaxis.labels.formatter = val => val.toFixed(0)
	options1.tooltip.y = { formatter: val => `${val}%` } 


	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		options: options1,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function()  { return `Loss of riparian woody vegetation in ${this.currentRegionName}` },
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})




	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series1
	}

})

