"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const header = soefinding.findingJson.data.shift()
	const region_key = 0
	const product_key = 3
	const product_year_keys = [4, 5, 6]
	const product_years = product_year_keys.map(yk => header[yk])
	const value_year_keys = [8, 9, 10]
	const value_years = value_year_keys.map(yk => header[yk])

	const nullRegions = [
		"Queensland", "Cape York", "Desert Channels",
		"Fitzroy Basin", "Northern Gulf", "Reef",
		"Southern Gulf", "Southern Queensland", "Torres Strait"]
	nullRegions.forEach(n => soefinding.findingContent[n] = {})

	const regions = new Map() // we use this in chart 3

	// chart 1 column charts for fruits
	const fruitSeries = soefinding.findingJson.data.filter(d => d[product_key] == "Fruit")
	fruitSeries.forEach(d => {

		regions.set(d[region_key], [d])  // for chart 3

		soefinding.findingContent[d[region_key]] = {
			series1: [{
				name: "Tonnes",
				data: product_year_keys.map(yk => d[yk])
			}]
		}
	})

	const columnChartOptions = soefinding.getDefaultColumnChartOptions()
	columnChartOptions.xaxis.categories = product_years.map(k => k.replace("-", "–")) // ndash
	columnChartOptions.xaxis.title.text = "Year"
	columnChartOptions.yaxis.title.text = "Tonnes"
	columnChartOptions.yaxis.labels.formatter = val => val >= 1000000 ? `${val / 1000000}M` : (val >= 1000 ? `${val / 1000}K` : val)
	columnChartOptions.tooltip.y = { formatter: val => val.toLocaleString() }


	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1 ?? null,
		options: columnChartOptions,
		chartactive: true,
	}


	// chart 2 column charts for vegetables
	const vegetableSeries = soefinding.findingJson.data.filter(d => d[product_key] == "Vegetables")
	vegetableSeries.forEach(d => {

		regions.get(d[region_key]).push(d) // for chart 3

		soefinding.findingContent[d[region_key]].series2 =
			[{
				name: "Tonnes",
				data: product_year_keys.map(yk => d[yk])
			}]
	})

	soefinding.state.chart2 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2 ?? null,
		options: columnChartOptions,
		chartactive: true,
	}



	// chart 3, line chart for values
	for (let [regionName, data] of regions) {
		soefinding.findingContent[regionName].series3 =
			data.map(d => {
				return {
					name: d[product_key],
					data: value_year_keys.map(vyk => d[vyk])
				}
			})
	}


	const lineChartOptions = soefinding.getDefaultLineChartOptions()
	lineChartOptions.xaxis.categories = product_years.map(k => k.replace("-", "–")) // ndash
	lineChartOptions.xaxis.title.text = "Year"
	lineChartOptions.xaxis.tickPlacement = "between"
	lineChartOptions.tooltip.y = { formatter: val => `$${val.toLocaleString()}` }
	lineChartOptions.yaxis.title.text = "Value ($)"
	lineChartOptions.yaxis.labels.minWidth = 30
	lineChartOptions.yaxis.labels.formatter = columnChartOptions.yaxis.labels.formatter

	soefinding.state.chart3 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series3 ?? null,
		options: lineChartOptions,
		chartactive: true,
	}


	window.vueApp = Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1() { return `Production amount of Fruit in ${this.currentRegionName} NRM region` },
			heading2() { return `Production amount of Vegetables in ${this.currentRegionName} NRM region` },
			heading3() { return `Production values in ${this.currentRegionName} NRM region` }
		},
		methods: {
			formatter1: val => val.toLocaleString(),
			updateRegion(newRegionName) {
				this.currentRegionName = newRegionName
			}
		},
		watch: {
			currentRegionName(newRegionName) {
				this.chart1.series = soefinding.findingContent[newRegionName].series1
				this.chart2.series = soefinding.findingContent[newRegionName].series2
				this.chart3.series = soefinding.findingContent[newRegionName].series3

			}
		}
	}).mount("#chartContainer")


})
