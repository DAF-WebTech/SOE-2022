"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const keys = soefinding.findingJson.meta.fields.slice(-3)

	const series1Items = soefinding.findingJson.data.filter(d => d.Indicator == "Area (ha)" && d["Drainage division"] != "Queensland")

	soefinding.findingContent.Queensland = { series1: [] }

	series1Items.forEach(d => {
		if (d["Drainage division"] != "Other") {
			soefinding.findingContent[d["Drainage division"]] = {
				series2: [{
					name: "Area (ha)",
					data: keys.map(k => d[k])
				}]
			}
		}

		soefinding.findingContent.Queensland.series1.push({
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
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val / 1000000}M` : val >= 1000 ? `${val / 1000}K` : val


	soefinding.state.chart1 = {
		series: soefinding.findingContent.Queensland.series1,
		options: options1,
		chartactive: true
	}

	const options2 = JSON.parse(JSON.stringify(options1))
	delete options2.chart.stacked
	options2.yaxis.labels.formatter = options1.yaxis.labels.formatter
	options2.tooltip.y = options1.tooltip.y
	soefinding.state.chart2 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		options: options2,
		chartactive: true
	}


	const YEAR = "TODO YEAR"

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Estuarine wetlands extent by region, ${YEAR}`,
			heading2: function () {
				return `Estuarine wetlands extent in ${this.currentRegionName}, ${YEAR}`
			}
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})


	soefinding.onRegionChange = function () {
		console.log("onRegionChange", soefinding.state.currentRegionName)

		//options1.chart.stacked = soefinding.state.currentRegionName == "Queensland"
		if (soefinding.state.currentRegionName != "Queensland")
			soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].series2


		soefinding.loadFindingHtml()
	}
})