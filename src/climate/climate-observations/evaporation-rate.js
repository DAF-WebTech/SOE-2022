"use strict"

soefinding.regions = {
	"Cairns Airport": { map: { lat: -16.87, long: 145.75 } },
	"Townsville Airport": { map: { lat: -19.25, long: 146.77 } },
	"Mount Isa": { map: { lat: -20.68, long: 139.49 } },
	"Rockhampton Airport": { map: { lat: -23.38, long: 150.48 } },
	"Longreach Airport": { map: { lat: -23.44, long: 144.28 } },
	"Brian Pastures": { map: { lat: -25.66, long: 151.75 } },
	"Charleville Airport": { map: { lat: -26.42, long: 146.25 } }
}


document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(2);
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
					++count;
					return acc + d[curr]
				} else return acc
			}, 0)
			return sum / count
		})
	}]
	soefinding.findingContent.Queensland = {
		html: "",
		app1: qldSeries
	};


	const options1 = soefinding.getDefaultBarChartOptions();
	options1.xaxis.categories = locationItems.map(d => d.Name)
	options1.xaxis.title.text = "Station";
	options1.yaxis.title.text = "Mean annual pan evaporation (millimetres)";
	options1.yaxis.labels.formatter = function (val) {
		return `${(val / 1000).toFixed(1)}k`;
	}

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent.Queensland.app1,
		chartactive: true,
	};


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
			app1: series
		};
	}


	const options2 = soefinding.getDefaultLineChartOptions();
	options2.xaxis.categories = soefinding.yearKeys
	options2.xaxis.title.text = "Year";
	options2.yaxis.title.text = "Annual pan evaporation (millimetres)";
	options2.yaxis.labels.formatter = function (val) {
		return `${(val / 1000).toFixed(1)}k`;
	}


	soefinding.state.chart2 = {
		options: options2,
		series: soefinding.findingContent[soefinding.state.currentRegionName].app1, // or do we make an app2
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Mean annual pan evaporation, ${soefinding.yearKeys[0]}–${latestYear}`,
			heading2: () => `Trend in evaporation rate at ${soefinding.state.currentRegionName}`,
		},
		methods: {
			formatter1: function (val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1, }) ?? "" }
		}
	})

	if (soefinding.state.currentRegionName == "Queensland")
		soefinding.onRegionChange()


})



soefinding.onRegionChange = function () {

	const regionInfos = document.querySelectorAll("div.region-info")

	if (this.state.currentRegionName == "Queensland") {
		// toggle visibility of first region-info, which is for Queensland
		regionInfos[0].style.display = "block"
		regionInfos[1].style.display = "none"
	}
	else {
		// toggle visibility of first region-info, which is for Queensland
		regionInfos[0].style.display = "none"
		regionInfos[1].style.display = "block"

		// set the data series in each of the vue apps, for the current region
		this.state.chart2.series = this.findingContent[this.state.currentRegionName].app1;
	}

	soefinding.loadFindingHtml();
}

