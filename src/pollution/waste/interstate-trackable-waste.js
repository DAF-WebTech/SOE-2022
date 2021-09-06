"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	//1. totals for each year
	const totals = soefinding.findingJson.data.find(d => d["Waste description"] == "Total")

	const totalSeries = [{
		name: `Total`,
		data: yearKeys.map(y => totals[y])
	}]

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Tonnes"
	// options1.yaxis.labels.formatter = val => {
	// 	return val < 1000000 ? `${val / 1000}K` : `${val / 1000000}M`
	// }
	options1.tooltip.y = {
		formatter: val => val.toLocaleString()
	}

	// create vue instance for first chart
	soefinding.state.chart1 = {
		options: options1,
		series: totalSeries,
		chartactive: true,
	};


	// 2. latest year each waste type
	const wasteTypes = {}
	soefinding.findingJson.data.forEach(d => {
		if (d["Waste description"] == "Total")
			return
		if (!wasteTypes[d["Waste description"]])
			wasteTypes[d["Waste description"]] = []
		wasteTypes[d["Waste description"]].push(d)
	})

	const wasteTotalItems = Object.keys(wasteTypes).map(k => {
		return {
			name: k,
			value: wasteTypes(k).forEach.reduce(function (acc, val) {
				return acc + val[latestYear]
			}, 0)
		}
	}
	wasteTotalItems.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})
	const wasteSeries = wasteTotalItems.map(d => d.value)

	const options2 = soefinding.getDefaultPieChartOptions()
	options2.xaxis.categories = ["Waste description", latestYear]
	options2.labels = wasteTotalItems.map(d => d.name)
	options2.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
			}
		}
	}

	soefinding.state.chart2 = {
		options: options2,
		series: wasteSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Trackable waste received from interstate",
			heading2: () => `Proportion of trackable waste received from interstate by waste type, ${latestYear.replace("-", "–")}`,
		},
		methods: {
			formatter1: val => val.toLocaleString(),
		}
	})
})
