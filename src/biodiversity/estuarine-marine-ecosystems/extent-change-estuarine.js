"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const keys = soefinding.findingJson.meta.fields.slice(-3)

	const series1Items = soefinding.findingJson.data.filter(d => d.Indicator == "Area (ha)" && d["Drainage division"] != Queensland)

	soefinding.findingContent.Queensland = { series1: [] }

	series1Items.forEach(d => {
		soefinding.findingContent[d["Drainage division"]].series1 = [{
			name: d["Drainage division"],
			data: keys.map(k => d[k])
		}]

		soefinding.findingContent.Queensland.push({
			name: d["Drainage division"],
			data: keys.map(k => d[k])
		})

	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.tooltip.y = { 
		formatter: val => val.toLocaleString()
	}
	options1.xaxis.categories = keys
	options1.xaxis.title.text = "Estuarine wetland"
	options1.yaxis.title.text = "Hectares"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val/1000000}M` : val >= 1000 ? `${val/1000}K` : val

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series,
		options: options1
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () {
				let retVal = "`Estuarine wetlands extent"
				if (this.currentRegionName == "Queensland")
					retVal += " by region"
				else
					retVal += ` in ${this.currentRegionName}`
				retVal += ", TODO YEAR "
				return retVal
			}
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})


	soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series
		retVal.chart.stacked = soefinding.currentRegionName == "Queensland"

		soefinding.loadFindingHtml()
	}
})