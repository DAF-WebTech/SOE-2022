"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const header = soefinding.findingJson.data.shift()
	const region_key = 0
	const product_key = 3
	const product_year_keys = [4, 5, 6]
	const product_years = product_year_keys.map(yk => header[yk])

	const nullRegions = ["Queensland", "Cape York", "Desert Channels", "Fitzroy Basin", "Northern Gulf", "Reef", "Southern Gulf", "Torres Strait" ]
	nullRegions.forEach(n => soefinding.findingContent[n] = { })

// chart 1 column charts for fruits
const fruitSeries = soefinding.findingJson.data.filter(d => d[product_key] == "Fruit")
fruitSeries.forEach(d => {
	soefinding.findingContent[d[region_key]].series1 = [{
		name: "Tonnes",
		data: product_year_keys.map(yk => d[yk])
	}]
})

const columnChartOptions = soefinding.getDefaultColumnChartOptions()
columnChartOptions.xaxis.categories = years.map(k => k.replace("-", "–")) // ndash
columnChartOptions.xaxis.title.text = "Year"
columnChartOptions.yaxis.title.text = "Tonnes"
columnChartOptions.yaxis.labels.formatter = val => val >= 1000000 ? `${val/1000000}M` : ( val >= 1000 ? `${val/1000}K`: val)
columnChartOptions.tooltip.y = { formatter: val => val.toLocaleString() }

const lineChartOptions = soefinding.getDefaultLineChartOptions()
lineChartOptions.xaxis.categories = years_value.map(k => k.replace("-", "–")) // ndash
lineChartOptions.xaxis.title.text = "Year"
lineChartOptions.xaxis.tickPlacement = "between"
lineChartOptions.tooltip.y = { formatter: val => val.toLocaleString() }
lineChartOptions.yaxis.title.text = "Tonnes"
lineChartOptions.yaxis.labels.minWidth = 30
lineChartOptions.yaxis.labels.formatter = columnChartOptions.yaxis.labels.formatter

soefinding.state.chart1 = {
	series: soefinding.findingContent[soefinding.state.currentRegionName].series1 ?? null,
	options: columnChartOptions,
	chartactive: true,
}









	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "dude"
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})

	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series1
		soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].series2
		soefinding.state.chart3.series = soefinding.findingContent[soefinding.state.currentRegionName].series3

		soefinding.loadFindingHtml()
	}

})


