"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1)
	const latestYear = yearKeys[yearKeys.length - 1]
	const lastFourYears = yearKeys.slice(yearKeys.length - 4)

	//1. column chart for qld for the last four years
	const qldItem = soefinding.findingJson.data.find(d => d["Waste region"] == "Queensland")
	const fourYearSeries = [{
		name: "Queensland",
		data: lastFourYears.map(y => qldItem[y])
	}]

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = lastFourYears.map(y => y.replace("-", "–")) // ndash
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Tonnes (million)"
	options1.yaxis.labels.formatter = val => {
		return `${(val / 1000000).toFixed(1)}M`
	}
	options1.tooltip.y = {
		formatter: val => val.toLocaleString()
	}
	options1.yaxis.forceNiceScale = false
	options1.yaxis.min = 1000000
	options1.yaxis.max = 2000000
	options1.yaxis.tickAmount = 5

	soefinding.state.chart1 = {
		options: options1,
		series: fourYearSeries,
		chartactive: true,
	}


	// 2. line chart for excluding green waste for all years
	const excludingGreenItem = soefinding.findingJson.data.find(d => d["Waste region"] == "Excluding green waste")
	const excludingGreenSeries = [{
		name: "Excluding green waste",
		data: yearKeys.map(y => excludingGreenItem[y])
	}]

	const options2 = soefinding.getDefaultLineChartOptions()
	options2.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
	options2.xaxis.title.text = "Year"
	options2.xaxis.labels.rotateAlways = true
	options2.yaxis.title.text = "Tonnes (million)"
	options2.yaxis.labels.formatter = val => {
		return `${(val / 1000000).toFixed(1)}M`
	}
	options2.tooltip.y = {
		formatter: val => val.toLocaleString()
	}

	soefinding.state.chart2 = {
		options: options2,
		series: excludingGreenSeries,
		chartactive: true,
	}


	//3. pie chart for all regions, latest Year
	const regionItems = soefinding.findingJson.data.filter(d => d["Waste region"] != "Queensland" && d["Waste region"] != "Excluding green waste")
	regionItems.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})
	const regionSeries = regionItems.map(d => d[latestYear])

	const options3 = soefinding.getDefaultPieChartOptions()
	options3.labels = regionItems.map(d => d["Waste region"].replace("-", "–"))
	options3.tooltip.y = {
		formatter: (val, options) => {
			const percent = options.globals.seriesPercent[options.seriesIndex][0]
			return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
		}
	}
	options3.xaxis.categories = ["Waste Region", "Tonnes"]

	soefinding.state.chart3 = {
		options: options3,
		series: regionSeries,
		chartactive: true,
	}


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => "Commercial and industrial waste landfilled",
			heading2: () => "Trend in total commercial and industrial waste landfilled (excluding green waste)",
			heading3: () => `Proportion of commercial and industrial waste landfilled by region, ${latestYear.replace("-", "–")}`, //ndash
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? "",
			formatPercent: function (s, i, series) {
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(1)
			}

		}
	}).mount("#chartContainer")
})
