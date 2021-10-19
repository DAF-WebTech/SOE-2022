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


	const options1 = soefinding.getDefaultLineChartOptions();
	options1.stroke = { width: 1.5 }
	options1.markers.size = 3
	options1.xaxis.categories = yearKeys
	options1.xaxis.title.text = "Year";
	options1.yaxis.title.text = "Temperature (degrees celsius)";
	options1.yaxis.labels.formatter = val => Math.round(val)
	options1.tooltip.y = {
		formatter: val => (val == null ? "n/a" : val.toFixed(1))
	}

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName],
		options: options1,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function() { 
				return`Trend in number of very heavy rainfall days at ${this.currentRegionName}`
			}
		},
		methods: {
			formatter1: val => val
		}
	})
})



soefinding.onRegionChange = function () {

	const regionInfos = document.querySelectorAll("div.region-info")

	// toggle visibility of region-info, not shown for Queensland
	if (this.state.currentRegionName != "Queensland") {
		// set the data series in the vue apps, for the current region
		this.state.chart1.series = this.findingContent[this.state.currentRegionName].app1;
	}

	soefinding.loadFindingHtml()
}

