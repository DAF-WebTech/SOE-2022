"use strict"

soefinding.regions = pinLocations // these should already be set in ssjs


document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2);

	// 2. line chart, each location, actual and moving average
	Object.keys(pinLocations).forEach(function (loc) {
		const actualItem = soefinding.findingJson.data.find(d => d.Name == loc && d.Measure == "Actual")
		const movingAverageItem = soefinding.findingJson.data.find(d => d.Name == loc && d.Measure == "Moving average")

		const series = [{
			name: "Actual",
			data: yearKeys.map(y => actualItem[y])
		},
		{
			name: "Moving average",
			data: yearKeys.map(y => movingAverageItem[y])
		}]

		soefinding.findingContent[loc] = {
			html: "",
			app1: series
		}
	})
	// and one for queensland
	soefinding.findingContent.Queensland = { html: "" }

	const YEAR_GAP = 4
	const options1 = soefinding.getDefaultLineChartOptions();
	options1.markers.size = 3
	options1.stroke = { width: 1.5 }
	options1.tooltip.x = { formatter: val => yearKeys[val - 1] }
	options1.tooltip.y = { formatter: val => val == null ? "n/a" : val }
	options1.xaxis.categories = yearKeys
	options1.xaxis.labels.formatter = val => val % YEAR_GAP == 0 ? val : ""
	options1.xaxis.tickAmount = Math.floor(yearKeys.length / YEAR_GAP)
	delete options1.xaxis.tickPlacement
	options1.xaxis.title.text = "Year"
	options1.yaxis.labels.formatter = val => Math.round(val)
	options1.yaxis.title.text = "Number of days"


	soefinding.state.chart1 = {
		series: soefinding.findingContent.Palmerville.app1, // need a default
		options: options1,
		chartactive: true,
	}


	window.vueApp = Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1() { return `Trend in number of very heavy rainfall days at ${this.currentRegionName}` }
		},
		methods: {
			formatter1: val => val,
			updateRegion(newRegionName) {
				this.currentRegionName = newRegionName
			}
		},
		watch: {
			currentRegionName(newRegionName) {
				this.chart1.series = soefinding.findingContent[newRegionName].app1
			}
		}
	}).mount("#chartContainer")
})


