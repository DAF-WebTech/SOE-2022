"use strict";

document.addEventListener("DOMContentLoaded", function () {

	let yearKeys = soefinding.findingJson.meta.fields.slice(2)

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
	delete options1.xaxis.tickPlacement
	options1.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // en dash
	options1.xaxis.title.text = "Year range"
	options1.xaxis.labels.formatter = function (val) {
		if (typeof val != "undefined") {
			const year = Number(val.split("–")[1])
			return year % 2 ? "" : val
		}
	}
	options1.yaxis.labels.formatter = val => `${val / 1000}K`
	options1.yaxis.title.text = "Hectares per year"
	options1.tooltip.y = { formatter: val => val.toLocaleString() }

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
	options2.xaxis.labels.formatter = options1.xaxis.labels.formatter
	options2.yaxis.labels.formatter = options1.yaxis.labels.formatter
	options2.tooltip.y.formatter = options1.tooltip.y.formatter

	soefinding.state.chart2 = {
		options: options2,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		chartactive: true,
	}


	yearKeys = yearKeys.slice(10) // there's no data for the first 10 years,
	// but the algo here makes it hard to find them
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

	const options3 = JSON.parse(JSON.stringify(options2))
	options3.tooltip.y.formatter = options1.tooltip.y.formatter
	options3.xaxis.categories = yearKeys
	options3.yaxis.labels.formatter = options1.yaxis.labels.formatter

	soefinding.state.chart3 = {
		options: options3,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series3,
		chartactive: true,
	}


	window.vueApp = Vue.createApp({
		data() {
			return soefinding.state
		},
		components: myComponents,
		computed: {
			heading1: () => `Extent of total woody vegetation clearing, by bioregion`,
			heading2: () => `Proportion of replacement landcover (clearing type) in ${soefinding.state.currentRegionName}`,
			heading3: () => `Historic woody vegetation clearing in ${soefinding.state.currentRegionName}`,
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? "",
			updateRegion(newRegionName) {
				this.currentRegionName = newRegionName
			}
		},
		watch: {
			currentRegionName(newRegionName) {
				this.chart2.series = soefinding.findingContent[newRegionName].series2
				this.chart3.series = soefinding.findingContent[newRegionName].series3
			}
		}
	}).mount("#chartContainer")

})