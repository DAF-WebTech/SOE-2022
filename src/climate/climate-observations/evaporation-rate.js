"use strict"

soefinding.regions = pinLocations // these should already be set in ssjs


document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = soefinding.yearKeys[soefinding.yearKeys.length - 1]
	const regionNames = Object.keys(soefinding.regions)

	//1. bar chart for queensland
	// now the queensland figures, which fit into column chart
	// we get the average of the "Actual" item
	const locationItems = soefinding.findingJson.data.filter(d => d.Measure == "Actual")
	const qldSeries = [{
		name: "Average",
		data: locationItems.map(d => {
			let count = 0
			const sum = soefinding.yearKeys.reduce(function (acc, curr, i, a) {
				if (d[curr]) {
					++count
					return acc + d[curr]
				} else return acc
			}, 0)
			return sum / count
		})
	}]
	soefinding.findingContent.Queensland = {
		html: "",
		app1: qldSeries
	}


	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = locationItems.map(d => d.Name.split(" "))
	options1.xaxis.title.text = "Station"
	options1.yaxis.title.text = "Mean annual pan evaporation (millimetres)"
	options1.yaxis.labels.formatter = val => Math.round(val).toLocaleString()
	options1.tooltip.y = { formatter: val => val.toLocaleString() }

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent.Queensland.app1,
		chartactive: true,
	}


	// 2. line chart for each region

	for (let region in soefinding.regions) {

		// create a data series for this region
		const item = soefinding.findingJson.data.filter(d => d.Name == region)
		const seriesNames = ["Actual", "Moving average"]
		const series = seriesNames.map(s => {
			const regionItem = item.find(d => d.Measure == s)
			return {
				name: s,
				data: soefinding.yearKeys.map(y => regionItem[y])
			}
		})

		// findingContent holds the html and data series for each region
		soefinding.findingContent[region] = {
			html: "",
			app2: series
		}
	}


	const options2 = soefinding.getDefaultLineChartOptions()
	options2.tooltip.x = { formatter: val => soefinding.yearKeys[val - 1] }
	options2.tooltip.y = { formatter: val => val?.toLocaleString() ?? "n/a" }
	options2.xaxis.categories = soefinding.yearKeys
	options2.xaxis.labels.formatter = (val) => val % 2 == 0 ? val : ""
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Annual pan evaporation (millimetres)"
	options2.yaxis.labels.formatter = val => Math.round(val).toLocaleString()


	soefinding.state.chart2 = {
		options: options2,
		series: null,
		chartactive: true,
	}
	if (soefinding.state.currentRegionName == "Queensland")
		soefinding.state.chart2.series = soefinding.findingContent["Cairns Airport"].app2 // need a default
	else
		soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].app2


	window.vueApp = Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => `Mean annual pan evaporation, ${soefinding.yearKeys[0]}–${latestYear}`,
			heading2() { return `Trend in evaporation rate at ${this.currentRegionName}` },
		},
		methods: {
			formatter1: function (val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1, }) ?? "" },
			updateRegion(newRegionName) {
				this.currentRegionName = newRegionName
			}
		},
		watch: {
			currentRegionName(newRegionName) {
				this.chart2.series = soefinding.findingContent[newRegionName].app2
			}
		}
	}).mount("#chartContainer")

})



