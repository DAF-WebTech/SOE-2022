"use strict"

soefinding.regions = pinLocations // these should already be set in ssjs


document.addEventListener("DOMContentLoaded", function () {

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

	const options2 = soefinding.getDefaultLineChartOptions();
	options2.xaxis.categories = yearKeys
	options2.xaxis.title.text = "Year";
	options2.yaxis.title.text = "Temperature (degrees celsius)";
	// options2.yaxis.labels.formatter = val => Math.round(val)
	// options2.tooltip.y = {
	// 	formatter: val => (val == null ? "n/a" : val.toFixed(2))
	// }

	soefinding.state.chart2 = {
		options: options2,
		//series: soefinding.findingContent.Queensland.app2,
		chartactive: true,
	}
	if (soefinding.state.currentRegionName == "Queensland")
		soefinding.state.chart2.series = []
	else
		soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName]


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Trend in number of extreme hot days at ${soefinding.state.currentRegionName}`,
		},
		methods: {
			formatter1: val => val
		}
	})
})



soefinding.onRegionChange = function () {

	const regionInfos = document.querySelectorAll("div.region-info")

	// toggle visibility of region-info, not shown for Queensland
	if (this.state.currentRegionName == "Queensland") {
		regionInfos[0].style.display = "none"
	}
	else {
		regionInfos[0].style.display = "block"

		// set the data series in the vue apps, for the current region
		this.state.chart2.series = this.findingContent[this.state.currentRegionName].app1;
	}

	soefinding.loadFindingHtml()
}

