"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1)
	const latestYear = yearKeys[yearKeys.length - 1]

	//1. column, all waste types each year
	const qldItem = soefinding.findingJson.data.find(d => d["Waste region"] == "Queensland")
	const wasteYearSeries = {
		name: "Total",
		data: yearKeys.slice(8).map(y => qldItem[y])
	}

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = yearKeys.slice(8).map(y => y.replace("-", "–")) // ndash
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Kilograms per capita"
	options1.yaxis.labels.formatter = val => {
		return `${(val / 1000000).toFixed(1)}M`
	}
	options1.tooltip.y = {
		formatter: val => val.toLocaleString()
	}

	soefinding.state.chart1 = {
		options: options1,
		series: wasteYearSeries,
		chartactive: true,
	}


	// 2. line, same data as (1), all years
	const trendSeries = {
		name: "Total",
		data: yearKeys.map(y => qldItem[y])
	}

	const options2 = soefinding.getDefaultLineChartOptions()
	options2.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Kilograms per capita"
	options2.yaxis.labels.formatter = val => {
		return `${(val / 1000000).toFixed(1)}M`
	}
	options2.tooltip.y = {
		formatter: val => val.toLocaleString()
	}

	soefinding.state.chart2 = {
		options: options2,
		series: qldAllSeries,
		chartactive: true,
	}


	// 3 column, total in latest year for each region
	const regionItems = soefinding.findingJson.data.filter(d => d["Waste region"] != "Queensland")
	const regionSeries = regionItems.map(d => d[latestYear])
	regionSeries.sort(function (a, b) {
		return b - a
	})

	const options3 = soefinding.getDefaultBarChartOptions()
	options3.xaxis.categories = regionItems.map(d => d["Waste region"].replace("-", "–"))
	options3.xaxis.title.text = "Region"
	options3.yaxis.title.text = "Kilograms per capita"

	soefinding.state.chart3 = {
		options: options3,
		series: regionSeries,
		chartactive: true,
	}




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Household waste recovered, by collection type",
			heading2: () => "Trend in total household waste recovered",
			heading3: () => `Proportion of household waste recovered by region, ${latestYear.replace("-", "–")}`, //ndash
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? "",
		}
	})
})
