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

	soefinding.state.chart1 = {
		options: options1,
		series: fourYearSeries,
		chartactive: true,
	}


	// 2. line chart for qld for all years
	const allYearSeries = [{
		name: "Queensland",
		data: yearKeys.map(y => qldItem[y])
	}]

	const options2 = soefinding.getDefaultLineChartOptions()
	options2.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Tonnes (million)"
	options2.yaxis.labels.formatter = val => {
		return `${(val / 1000000).toFixed(1)}M`
	}
	options2.tooltip.y = {
		formatter: val => val.toLocaleString()
	}

	soefinding.state.chart2 = {
		options: options2,
		series: allYearSeries,
		chartactive: true,
	}


	//3. pie chart for all regions, latest Year
	const regionItems = soefinding.findingJson.data.filter(d => d["Waste region"] != "Queensland")
	regionItems.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})
	const regionSeries = regionItems.map(d => d[latestYear])

	const options3 = soefinding.getDefaultPieChartOptions()
	options3.xaxis.categories = ["Waste Region", "Tonnes"] //ndash
	options3.labels = regionItems.map(d => d["Waste region"].replace("-", "–"))

	soefinding.state.chart3 = {
		options: options3,
		series: regionSeries,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Commercial and industrial waste landfilled",
			heading2: () => "Trend in total commercial and industrial waste landfilled (excluding green waste)",
			heading3: () => `roportion of commercial and industrial waste landfilled by region, ${latestYear.replace("-", "–")}`, //ndash
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? "",
		}
	})
})
