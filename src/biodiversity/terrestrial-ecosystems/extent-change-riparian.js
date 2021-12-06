"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const catchments = soefinding.findingJson.data.filter(d => d.Catchment == d.Subcatchment)
	const series1Keys = soefinding.findingJson.meta.fields.filter(f => f.includes("Woody Vegetation Loss per cent"))
	soefinding.findingContent.Queensland = { series1: null, subcatchments: null}

	catchments.forEach(d => {
		soefinding.findingContent[d.Catchment] = { 
			series1: [{
				name: d.Catchment,
				data: series1Keys.map(k => d[k])
			}]
		}

		// set up the subcatchments checkboxes
		const subcatchments = soefinding.findingJson.data.filter(c => c.Catchment == d.Catchment && c.Subcatchment != d.Subcatchment)
		subcatchments.forEach((sc, i) => {
			sc.checked = i == 0
			sc.chartactive = true
			sc.series = [{
				name: sc.Subcatchment,
				data: series1Keys.map(k => sc[k])
			}]
		})
		soefinding.findingContent[d.Catchment].subcatchments = subcatchments
	})

	const options1 = soefinding.getDefaultLineChartOptions()
	options1.xaxis.title = "Year"
	options1.xaxis.categories = series1Keys.map(k => k.replace("_", "–").split(" ")[0]) // ndash for year range
	options1.xaxis.tickPlacement = "between"
	options1.yaxis.title = "Percent (%)"
	options1.yaxis.labels.formatter = val => val.toFixed(1)
	options1.tooltip.y = { formatter: val => `${val}%` } 
	options1.yaxis.forceNicScale = false
	options1.yaxis.min = 0


	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		options: options1,
		chartactive: true,
	}

	// set subcatchments for current region
	soefinding.state.subcatchments = soefinding.findingContent[soefinding.state.currentRegionName].subcatchments


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
		if (this.state.currentRegionName != "Queensland") {
			soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series1
			soefinding.state.subcatchments = this.findingContent[this.state.currentRegionName].subcatchments
		}
	}

})

