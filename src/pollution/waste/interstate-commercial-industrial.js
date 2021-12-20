"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2, 6)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. stacked columns, waste by type
	let wasteTypes = soefinding.findingJson.data.filter(d => d["Waste type"] != "All")
	wasteTypes.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})
	const wasteTypeSeries = wasteTypes.map(d => {
		return {
			name: d["Waste type"],
			data: yearKeys.map(y => d[y])
		}
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	//options1.legend.inverseOrder = true
	options1.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
	options1.xaxis.title.text = "Year"
	delete options1.xaxis.tickPlacement
	options1.yaxis.title.text = "Tonnes"
	options1.yaxis.labels.formatter = val => `${val / 1000000}M`
	options1.tooltip.y = {
		formatter: val => `${val.toLocaleString()}`
	}


	soefinding.state.chart1 = {
		options: options1,
		series: wasteTypeSeries,
		chartactive: true,
	};


	//2. line chart,yearly trend
	const wasteConstructionDemolition = soefinding.findingJson.data.find(d => d["Waste type"] == "Commercial and industrial")
	const wasteConstructionDemolitionSeries = [{ name: "Tonnes", data: yearKeys.map(y => wasteConstructionDemolition[y]) }]

	const options2 = soefinding.getDefaultLineChartOptions()
	options2.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
	options2.xaxis.title.text = "Year"
	options2.xaxis.tickPlacement = "between"
	options2.xaxis.axisTicks = { show: false }
	options2.yaxis.title.text = "Tonnes"
	options2.yaxis.labels.formatter = val => val < 1000000 ? `${val / 1000}K` : `${val / 1000000}M`
	options2.tooltip.y = {
		formatter: val => `${val.toLocaleString()}`
	}

	soefinding.state.chart2 = {
		options: options2,
		series: wasteConstructionDemolitionSeries,
		chartactive: true,
	};


	// 3. pie, latest, not sent to landfill 
	//2018-19 Not sent to landfill
	const LATEST_NOT_SENT = "2018-19 Not sent to landfill"
	wasteTypes.sort(function (a, b) {
		return b[LATEST_NOT_SENT] - a[LATEST_NOT_SENT]
	})
	wasteTypes = wasteTypes.filter(d => d[LATEST_NOT_SENT] != null)
	const notSentLandfillSeries = wasteTypes.map(d => d[LATEST_NOT_SENT])

	const options3 = soefinding.getDefaultPieChartOptions()
	options3.labels = wasteTypes.map(d => d["Waste type"])
	options3.xaxis.categories = ["Waste type", "Tonnes"] // not needed for chart, but vue uses them for table headings
	options3.tooltip.y = {
		formatter: (val, options) => {
			const percent = options.globals.seriesPercent[options.seriesIndex][0]
			return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
		}
	}

	soefinding.state.chart3 = {
		options: options3,
		series: notSentLandfillSeries,
		chartactive: true,
	};


	// 4 stacked columns, latest year, other and landfill
	const keys = ["2018-19 Received by Landfill", LATEST_NOT_SENT]
	const latestOtherLandfillSeries = keys.map(k => {
		return {
			name: k.replace("-", "–"), // ndash
			data: wasteTypes.map(d => d[k])
		}
	})


	const options4 = soefinding.getDefaultColumnChartOptions()
	options4.chart.stacked = true
	options4.legend.inverseOrder = true
	options4.xaxis.categories = wasteTypes.map(d => d["Waste type"].split(" ")) //keys
	options4.xaxis.title.text = "Type of interstate construction and demolition waste received"
	options4.xaxis.tickPlacement = "between"
	options4.yaxis.title.text = "Tonnes (million)"
	options4.yaxis.labels.formatter = val => {
		if (val == 0) return 0
		if (val >= 1000000) return "1M"
		return `${val / 1000}K`
	}
	options4.yaxis.labels.minWidth = 20
	options4.tooltip.y = {
		formatter: val => `${(val)?.toLocaleString() ?? "n/a"}`
	}

	soefinding.state.chart4 = {
		options: options4,
		series: latestOtherLandfillSeries,
		chartactive: true,
	};

	const YEAR = soefinding.meta.fields.slice(-1).replace("-", "–") // endash

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Interstate commercial and industrial waste received, by waste type",
			heading2: () => "Trend in total interstate commercial and industrial waste received",
			heading3: () => `Proportion of interstate commercial and industrial waste received, ${YEAR} Not sent to landfill`,
			heading4: () => `Interstate commercial and industrial waste received by landfill and other, ${YEAR}`
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? ""
		}

	})
})
