"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1)
	const latestYear = yearKeys[yearKeys.length - 1]
	const lastFourYears = yearKeys.slice(yearKeys.length - 4)

	//1. column chart for qld for the last four years
	const qldItem = soefinding.findingJson.data.find(d => d["Waste region"] == "Queensland")
	const fourYearSeries = {
		name: "Queensland",
		data: lastFourYears.map(y => qldItem[y])
	}

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










	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Household waste landfilled, by collection type",
			heading2: () => "Trend in total household waste landfilled",
			heading3: () => `Proportion of household waste landfilled by region, ${latestYear.replace("-", "–")}`, //ndash
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? "",
		}
	})
})
