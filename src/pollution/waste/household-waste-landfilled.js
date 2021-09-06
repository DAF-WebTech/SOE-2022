"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	//1. stacked column, all waste types each year
	const qldItems = soefinding.findingJson.filter(d => d["Waste region"] == "Queensland" && d["Waste source"] != "All")
	const wasteYearSeries = qldItems.map(d => {
		return {
			name: d["Waste source"],
			data: yearKeys.map(y => d[y])
		}
	})

	const options1 = soefinding.getDefaultBarChartOptions
	options1.chart.stacked = true
	options1.xaxis.categories = yearKeys
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
		series: wasteYearSeries,
		chartactive: true,
	}







	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Household waste landfilled, by collection type",
			heading2: () => "Trend in total household waste landfilled",
			heading3: () => `Proportion of household waste landfilled by region, ${latestYear.replace("-", "–")}`, //ndash
		},
		methods: {
			formatter1: val => val.toLocaleString(),
		}
	})
})
