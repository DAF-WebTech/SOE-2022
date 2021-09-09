"use strict"

soefinding.regions = pinLocations // these should already be set in ssjs


document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2);
	const latestYear = soefinding.yearKeys[soefinding.yearKeys.length - 1]

	//1. mean temperature anomaly base, qld only
	const qldMeanAnomalyItem = soefinding.findingJson.data.find(d=> d.Name == "Queensland" && d.Measure == "Mean anomaly (Base 1961-1990")
	const qldMeanAnomalySeries = [{
		name: "Temperature anomaly",
		data: yearKeys.map(y => qldMeanAnomalyItem[y])
	}]

	soefinding.findingContent.Queensland = {
		html: "",
		app1: qldMeanAnomalySeries
	};

	const options1 = soefinding.getDefaultBarChartOptions();
	options1.xaxis.categories = yearKeys
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Temperature anomaly (degrees celsius)";
	// options1.yaxis.labels.formatter = function (val) {
	// 	return `${(val / 1000).toFixed(1)}k`;
	// }
	// options1.tooltip = {
	// 	y: {
	// 		formatter: val => val.toLocaleString()
	// 	}
	// }

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent.Queensland.app1,
		chartactive: true,
	};


	// 2. line chart for each region
	// for (let region in soefinding.regions) {

	// 	// create a data series for this region
	// 	const item = soefinding.findingJson.data.filter(d => d.Name == region)
	// 	const seriesNames = ["Actual", "Moving average"]
	// 	const series = seriesNames.map(s => {
	// 		const regionItem = item.find(d => d.Measure == s)
	// 		return {
	// 			name: s,
	// 			data: soefinding.yearKeys.map(y => regionItem[y])
	// 		}
	// 	})

	// 	// findingContent holds the html and data series for each region
	// 	soefinding.findingContent[region] = {
	// 		html: "",
	// 		app2: series
	// 	};
	// }


	// const options2 = soefinding.getDefaultLineChartOptions();
	// options2.xaxis.categories = soefinding.yearKeys
	// options2.xaxis.title.text = "Year";
	// options2.yaxis.title.text = "Annual pan evaporation (millimetres)";
	// options2.yaxis.labels.formatter = function (val) {
	// 	return `${(val / 1000).toFixed(1)}k`;
	// }
	// options2.tooltip = {
	// 	y: {
	// 		formatter: val => val?.toLocaleString() ?? "n/a"
	// 	}
	// }


	// soefinding.state.chart2 = {
	// 	options: options2,
	// 	series: null,
	// 	chartactive: true,
	// };
	// if (soefinding.state.currentRegionName == "Queensland")
	//   soefinding.state.chart2.series = soefinding.findingContent["Cairns Airport"].app2 // need a default
	// else
  //     soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].app2

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Annual mean temperature anomaly, base ${yearKeys[0]}–${latestYear}`,
			heading2: () => `Trend in evaporation rate at ${soefinding.state.currentRegionName}`,
		},
		methods: {
			formatter1: val => val?toLocaleString(undefined, { minimumFractionDigits: 2 })
		}
	})

})



soefinding.onRegionChange = function () {

	const regionInfos = document.querySelectorAll("div.region-info")

	if (this.state.currentRegionName == "Queensland") {
		// toggle visibility of first region-info, which is for Queensland
		regionInfos[0].style.display = "block"
		regionInfos[1].style.display = "none"
	}
	else {
		// toggle visibility of second region-info, which is for the current region
		regionInfos[0].style.display = "none"
		regionInfos[1].style.display = "block"

		// set the data series in each of the vue apps, for the current region
		this.state.chart2.series = this.findingContent[this.state.currentRegionName].app2;
	}

	soefinding.loadFindingHtml();
}

