"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1)
	const latestYear = yearKeys[yearKeys.length - 1]

	//1. column, all waste types each year
	const qldItem = soefinding.findingJson.data.find(d => d["Waste region"] == "Queensland")
	const wasteYearSeries = [{
		name: "Kilograms per capita",
		data: yearKeys.slice(8).map(y => qldItem[y])
	}]

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = yearKeys.slice(8).map(y => y.replace("-", "–")) // ndash
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Kilograms per capita"

	soefinding.state.chart1 = {
		options: options1,
		series: wasteYearSeries,
		chartactive: true,
	}


	// 2. line, same data as (1), all years
	const trendSeries = [{
		name: "Kilograms per capita",
		data: yearKeys.map(y => qldItem[y])
	}]

	const options2 = soefinding.getDefaultLineChartOptions()
	options2.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Kilograms per capita"

	soefinding.state.chart2 = {
		options: options2,
		series: trendSeries,
		chartactive: true,
	}


	// 3 column, total in latest year for each region
	const regionItems = soefinding.findingJson.data.filter(d => d["Waste region"] != "Queensland")
	regionItems.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})
	const regionSeries = [{
		name: "Kilograms per capita",
		data: regionItems.map(d => d[latestYear])
	}]
	regionSeries.sort(function (a, b) {
		return b - a
	})

	const options3 = soefinding.getDefaultBarChartOptions()
	options3.xaxis.categories = regionItems.map(d => d["Waste region"].replace("-", " –").split(" "))
	options3.xaxis.title.text = "Region"
	options3.yaxis.title.text = "Kilograms per capita"

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
			heading1: () => "Household waste generated per capita",
			heading2: () => "Trend in total household waste generated per capita",
			heading3: () => `Househould waste generated per capita by region, ${latestYear.replace("-", "–")}`, //ndash
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? "",
		}
	}).mount("#chartContainer")
})
