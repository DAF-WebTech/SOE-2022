"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series1items = soefinding.findingJson.data.filter(d => d.Figure == 1)
	const seriesFields = soefinding.findingJson.meta.fields.slice(-3)
	const series1Labels = ["Patch value (%)", "Edge value (%)", "Core value (%)"]
	const years = new Set()
	series1items.forEach(d => {
		years.add(d.YEAR)

		if (!soefinding.findingContent[d.REGPage])
			soefinding.findingContent[d.REGPage] = {
				series1: series1Labels.map(l => { return { name: l, data: [] } })
			}

		seriesFields.forEach((f, i) => soefinding.findingContent[d.REGPage].series1[i].data.push(d[f]))
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.tooltip.y = { formatter: val => val.toFixed(4) }
	options1.xaxis.categories = Array.from(years).map(y => [y.substring(0, y.lastIndexOf(" ")), y.substring(y.lastIndexOf(" ") + 1)])
	options1.xaxis.title.text = "Year"
	options1.yaxis.labels.formatter = val => Math.round(val)
	options1.yaxis.title.text = "Percent"

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent.Queensland.series1,
		chartactive: true,
	}


	// chart 2
	const series2Labels = ["Patch value (count)", "Edge value (count)", "Core value (count)"]
	const series2items = soefinding.findingJson.data.filter(d => d.Figure == 2)
	series2items.sort(function (a, b) {
		return a.RegName >= b.RegName ? 1 : -1
	})
	const series2year = series2items[0].YEAR
	series2items.forEach(d => {
		if (!soefinding.findingContent[d.REGPage].series2)
			soefinding.findingContent[d.REGPage].series2 = series2Labels.map(l => { return { name: l, data: [] } })

		seriesFields.forEach((f, i) => soefinding.findingContent[d.REGPage].series2[i].data.push(d[f]))

		if (!soefinding.findingContent[d.REGPage].subregions)
			soefinding.findingContent[d.REGPage].subregions = []
		soefinding.findingContent[d.REGPage].subregions.push(d.RegName)
	})

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.chart.height = 500
	options2.chart.id = "chart2"
	options2.tooltip.y.formatter = val => `${val < 0 ? '−' : ''}${Math.abs(val).toFixed(2)}`, // a better minus sign
		options2.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].subregions
	options2.xaxis.labels.trim = soefinding.state.currentRegionName == "Brigalow Belt"
	options2.xaxis.labels.hideOverlappingLabels = false
	options2.xaxis.title.text = "Region"
	options2.yaxis.labels.formatter = (val) => {  // a better minus sign
		if (val > 0)
			return `${val < 0 ? '−' : ''}${Math.abs(val).toFixed(2)}`
		else
			return `${val < 0 ? '−' : ''}${Math.abs(val)}`
	},
		options2.yaxis.title.text = "Count per 100km²"

	options2.xaxis.tickPlacement = "between" // not a good option, but it fixes a bug
	// where the chart xaxis did not redraw correctly when swapping between regions.,
	// and then you click on one of the legends

	soefinding.state.chart2 = {
		options: options2,
		series: soefinding.findingContent.Queensland.series2,
		chartactive: true,
	}


	// chart 3
	const series3Labels = ["Patch value (count per 100km²)", "Edge value (count per 100km²)", "Core value (count per 100km²)"]
	const series3items = soefinding.findingJson.data.filter(d => d.Figure == 3)
	const series3year = series3items[0].YEAR
	series3items.forEach(d => {
		if (!soefinding.findingContent[d.REGPage].series3)
			soefinding.findingContent[d.REGPage].series3 = series3Labels.map(l => { return { name: l, data: [] } })

		seriesFields.forEach((f, i) => soefinding.findingContent[d.REGPage].series3[i].data.push(d[f]))

	})



	const options3 = JSON.parse(JSON.stringify(options2))
	options3.chart.id = "chart3"
	options3.tooltip.y.formatter = val => `${val < 0 ? '−' : ''}${Math.abs(val)}`, // a better minus sign
		options3.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].subregions
	options3.yaxis.labels.formatter = options1.yaxis.labels.formatter
	options3.yaxis.title.text = "Count"

	options3.xaxis.tickPlacement = "between" // not a good option, but it fixes a bug
	// where the chart xaxis did not redraw correctly when swapping between regions.,
	// and then you click on one of the legends

	soefinding.state.chart3 = {
		options: options3,
		series: soefinding.findingContent.Queensland.series3,
		chartactive: true,
	}


	window.vueApp = Vue.createApp({
		data() {
			return soefinding.state
		},
		components: myComponents,
		computed: {
			heading1() {
				let title = "Percent change in the number of fragmentation classes from previous reporting period"
				if (this.currentRegionName != "Queensland")
					title += ` in ${this.currentRegionName}`
				return title
			},
			heading2() {
				let title = "Density change of fragmentation classes per 1000km²"
				if (this.currentRegionName == "Queensland")
					title += " by region"
				else
					title += ` in ${this.currentRegionName}`
				title += `, ${series2year}`
				return title
			},
			heading3() {
				let title = "Change in the number of fragmentation classes"
				if (this.currentRegionName == "Queensland")
					title += " by region"
				else
					title += ` in ${this.currentRegionName}`
				title += `, ${series3year}`
				return title
			},
		},
		methods: {
			formatter1: val => soefinding.convertToUnicodeMinus(val.toFixed(4)),
			formatter2: val => soefinding.convertToUnicodeMinus(val.toFixed(2)),
			formatter3: val => soefinding.convertToUnicodeMinus(val),
			updateRegion(newRegionName) {
				this.currentRegionName = newRegionName
			}
		},
		watch: {
			currentRegionName(newRegionName) {
				this.chart1.series = soefinding.findingContent[newRegionName].series1
				this.chart2.series = soefinding.findingContent[newRegionName].series2
				ApexCharts.exec("chart2", "updateOptions", {
					xaxis: {
						categories: soefinding.findingContent[newRegionName].subregions,
						labels: { trim: newRegionName == "Brigalow Belt" }
					}
				})
				this.chart3.series = soefinding.findingContent[newRegionName].series3
				ApexCharts.exec("chart3", "updateOptions", {
					xaxis: {
						categories: soefinding.findingContent[newRegionName].subregions,
						labels: { trim: newRegionName == "Brigalow Belt" }
					}
				})
			}
		}
	}).mount("#chartContainer")

})