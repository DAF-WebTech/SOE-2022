"use strict"

soefinding.regions = pinLocations // these should already be set in ssjs


document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2);

	//  line chart, each location, actual and moving average
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
	soefinding.findingContent.Queensland = { html: "" }


	const options1 = soefinding.getDefaultLineChartOptions()
	options1.markers.size = 3
	options1.stroke = { width: 1.5 }
	options1.tooltip.x = { formatter: val => yearKeys[val - 1] }
	options1.tooltip.y = { formatter: val => val == null ? "n/a" : val }
	options1.xaxis.categories = yearKeys

	const YEAR_GAP = 5
	options1.xaxis.labels.formatter = val => val % YEAR_GAP == 0 ? val : ""
	options1.xaxis.labels.rotateAlways = true
	options1.xaxis.tickAmount = Math.floor(yearKeys.length / YEAR_GAP)
	delete options1.xaxis.tickPlacement

	options1.xaxis.title.text = "Year"
	options1.yaxis.labels.formatter = val => Math.round(val)
	options1.yaxis.title.text = "Temperature (degrees celsius)"

	soefinding.state.chart1 = {
		series: soefinding.findingContent["Brisbane Airport"].app1, // needs a default
		options: options1,
		chartactive: true,
	}


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: function () { return `Trend in number of extreme hot days at ${this.currentRegionName}` },
		},
		methods: {
			formatter1: val => val
		}
	}).mount("#chartContainer")
})



soefinding.onRegionChange = function () {

	const regionInfos = document.querySelectorAll("div.region-info")

	// set the data series in the vue apps, for the current region
	if (this.state.currentRegionName != "Queensland")
		this.state.chart1.series = this.findingContent[this.state.currentRegionName].app1;

	soefinding.loadFindingHtml()
}

