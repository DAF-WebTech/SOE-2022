"use strict"

soefinding.regions = pinLocations // these should already be set in ssjs


document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2);
	const latestYear = yearKeys[yearKeys.length - 1]

	//1. mean temperature anomaly base, qld only
	const qldMeanAnomalyItem = soefinding.findingJson.data.find(d => d.Name == "Queensland" && d.Measure == "Mean anomaly (Base 1961-1990)")
	const qldMeanAnomalySeries = [{
		name: "Temperature anomaly",
		data: yearKeys.map(y => qldMeanAnomalyItem[y])
	}]

	soefinding.findingContent.Queensland = {
		html: "",
		app1: qldMeanAnomalySeries
	}

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.tooltip.x = { formatter: val => yearKeys[val - 1] }
	options1.tooltip.y = { formatter: val => val >= 0 ? val : `-${Math.abs(val)}` }
	options1.xaxis.categories = yearKeys
	const YEAR_GAP = 5
	options1.xaxis.labels.formatter = (val) => val % YEAR_GAP == 0 ? val : ""
	options1.xaxis.tickAmount = Math.floor(yearKeys.length / YEAR_GAP)
	options1.xaxis.tickPlacement = "on"
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Temperature anomaly (degrees celsius)";


	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent.Queensland.app1,
		chartactive: true,
	}


	// 2. line chart qld, actual mean and 10 year moving average
	const qldMeanItem = soefinding.findingJson.data.find(d => d.Name == "Queensland" && d.Measure == "Actual mean")
	const qldMeanSeries = [{
		name: "Actual Mean",
		data: yearKeys.map(y => qldMeanItem[y])
	},
	{
		name: "10-year moving average",
		data: yearKeys.map((y, i) => getTenYearMovingAverage(i))
	}]
	soefinding.findingContent.Queensland.app2 = qldMeanSeries

	function getTenYearMovingAverage(index) {
		if (index < 9)
			return null
		const values = yearKeys.slice(index - 9, index + 1)
		if (values.every(v => qldMeanItem[v] != null)) {
			const sum = values.reduce(function (acc, curr) {
				return (acc + qldMeanItem[curr])
			}, 0)
			return sum / 10.0
		}
		else
			return null
	}

	const options2 = soefinding.getDefaultLineChartOptions()
	options2.markers.size = 0
	options2.stroke = { width: 1.5 }
	options2.tooltip.x = { formatter: val => yearKeys[val - 1] }
	options2.tooltip.y = { formatter: val => (val == null ? "n/a" : val.toFixed(2)) }
	options2.xaxis.categories = yearKeys
	options2.xaxis.labels.formatter = (val) => val % YEAR_GAP == 0 ? val : ""
	options2.xaxis.tickAmount = Math.floor(yearKeys.length / YEAR_GAP)
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Temperature (degrees celsius)"
	options2.yaxis.labels.formatter = val => Math.round(val)


	soefinding.state.chart2 = {
		options: options2,
		series: soefinding.findingContent.Queensland.app2,
		chartactive: true,
	};

	// populate for each pin location, the data already has 10 year mean calculated
	Object.keys(pinLocations).forEach(function (loc) {
		const meanItem = soefinding.findingJson.data.find(d => d.Name == loc && d.Measure == "Actual mean")
		const tenYearMeanItem = soefinding.findingJson.data.find(d => d.Name == loc && d.Measure == "Moving average mean")
		const meanSeries = [{
			name: "Actual Mean",
			data: yearKeys.map(y => meanItem[y])
		},
		{
			name: "10-year moving average",
			data: yearKeys.map(y => tenYearMeanItem[y])
		}]
		soefinding.findingContent[loc] = {
			html: "",
			app2: meanSeries
		}

	})


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => `Annual mean temperature anomaly, base ${yearKeys[0]}–${latestYear}`,
			heading2: () => `Trend in annual mean temperature, ${soefinding.state.currentRegionName}`,
		},
		methods: {
			formatter1: val => val >= 0 ? val.toFixed(2) : `-${Math.abs(val).toFixed(2)}`,
			formatter2: val => val?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? ""

		}
	}).mount("#chartContainer")

})



soefinding.onRegionChange = function () {

	const regionInfos = document.querySelectorAll("div.region-info")

	if (this.state.currentRegionName == "Queensland") {
		// toggle visibility of first region-info, which is for Queensland
		regionInfos[0].style.display = "block"
	}
	else {
		// toggle visibility of second region-info, which is for the current region
		regionInfos[0].style.display = "none"

		// set the data series in each of the vue apps, for the current region
		this.state.chart2.series = this.findingContent[this.state.currentRegionName].app2;
	}

	soefinding.loadFindingHtml()
}

