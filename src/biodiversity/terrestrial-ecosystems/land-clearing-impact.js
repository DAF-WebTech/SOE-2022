"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)

	const totalClearing = soefinding.findingJson.data.filter(d => d["Clearing type"] == "Total clearing")
	soefinding.findingContent.Queensland = {
		series1: totalClearing.map(d => {
			return {
				name: d.Bioregion,
				data: yearKeys.map(y => d[y])
			}
		}),
	}

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // en dash
	options1.xaxis.title = "Year range"
	options1.yaxis.labels.formatter = val => `${val / 1000}K`
	options1.yaxis.title = "Hectares per year"
	options1.tooltip = { y: { formatter: val => val.toLocaleString() } }

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent.Queensland.series1,
		chartactive: true,
	}



	const clearingTypes = ["Pasture", "Crop", "Settlement", "Mining", "Infrastructure", "Forestry"]
	const clearingItems = soefinding.findingJson.data.filter(d => clearingTypes.includes(d["Clearing type"]))
	soefinding.findingContent.Queensland.series2 = clearingTypes.map(d => {
		return {
			name: d,
			data: yearKeys.map(y => 0)
		}
	})
	clearingItems.forEach(d => {
		if (!soefinding.findingContent[d.Bioregion])
			soefinding.findingContent[d.Bioregion] = { series2: [] }
		soefinding.findingContent[d.Bioregion].series2.push({
			name: d["Clearing type"],
			data: yearKeys.map(y => d[y])
		})

		const qldItem = soefinding.findingContent.Queensland.series2.find(q => q.name == d["Clearing type"])
		yearKeys.forEach((y, i) => {
			qldItem.data[i] += d[y]
		})
	})

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.yaxis.labels.formatter = options1.yaxis.labels.formatter
	options2.tooltip.y.formatter = options1.tooltip.y.formatter

	soefinding.state.chart2 = {
		options: options2,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		chartactive: true,
	}


	const historicTypes = ["Non-remnant", "Remnant"]
	const historicItems = soefinding.findingJson.data.filter(d => historicTypes.includes(d["Clearing type"]))
	soefinding.findingContent.Queensland.series3 = historicTypes.map(d => {
		return {
			name: d,
			data: yearKeys.map(y => 0)
		}
	})
	historicItems.forEach(d => {
		if (!soefinding.findingContent[d.Bioregion].series3)
			soefinding.findingContent[d.Bioregion].series3 = []
		soefinding.findingContent[d.Bioregion].series3.push({
			name: d["Clearing type"],
			data: yearKeys.map(y => d[y])
		})

		const qldItem = soefinding.findingContent.Queensland.series3.find(q => q.name == d["Clearing type"])
		yearKeys.forEach((y, i) => {
			qldItem.data[i] += d[y]
		})
	})

	soefinding.state.chart3 = {
		options: options2,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series3,
		chartactive: true,
	}




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of total woody vegetation clearing, by bioregion`,
			heading2: () => `Proportion of replacement landcover (clearing type) in ${soefinding.state.currentRegionName}`,
			heading3: () => `Historic woody vegetation clearing in Queensland in ${soefinding.state.currentRegionName}`,
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})



	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region

		// chart 2
		ApexCharts.exec("chart2", "updateSeries", this.findingContent[this.state.currentRegionName].series2)
		soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2



		soefinding.loadFindingHtml()
	}
})