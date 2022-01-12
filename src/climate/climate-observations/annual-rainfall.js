"use strict"

soefinding.regions = pinLocations // these should already be set in ssjs


document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(2);
	const regionNames = Object.keys(soefinding.regions)
	regionNames.push("Queensland")


	for (let regionName of regionNames) {

		// create a data series for this region
		const item = soefinding.findingJson.data.filter(d => d.Name == regionName)
		const seriesNames = ["Actual", "Moving average"]
		const series = seriesNames.map(s => {
			const regionItem = item.find(d => d.Measure == s)
			return {
				name: s,
				data: soefinding.yearKeys.map(y => regionItem[y])
			}
		})

		// findingContent holds the html and data series for each region
		soefinding.findingContent[regionName] = {
			html: "",
			app1: series
		};

	}

	const options1 = soefinding.getDefaultLineChartOptions()
	options1.markers.size = 0
	options1.stroke = {width: 1.5}
	options1.xaxis.categories = soefinding.yearKeys
	options1.xaxis.tickAmount = 32
	delete options1.xaxis.tickPlacement
	options1.xaxis.title.text = "Year";
	options1.yaxis.labels.formatter = val => val.toLocaleString()
	options1.yaxis.title.text = "Rainfall (millimetres)";

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName].app1,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Annual average rainfall for ${soefinding.state.currentRegionName}` },

		},
		methods: {
			formatter1: function (val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "" }
		}
	})

})


soefinding.onRegionChange = function () {

	// set the data series in each of the vue apps, for the current region
	this.state.chart1.series = this.findingContent[this.state.currentRegionName].app1;

	soefinding.loadFindingHtml();
}

