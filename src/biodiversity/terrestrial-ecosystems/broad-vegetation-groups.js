"use strict";

document.addEventListener("DOMContentLoaded", function () {

	soefinding.findingJson.data.sort(function (a, b) {
		return a["Broad vegetation group number"] - b["Broad vegetation group number"]
	})

	const fields = soefinding.findingJson.meta.fields.slice(-2) // last 2, for chart 1
	const qldTotal = {}
	soefinding.findingJson.data.forEach(d => {
		d.name = `${d["Broad vegetation group number"]}. ${d["Broad vegetation group label"].replace("-", "—")}` // em dash

		if (!soefinding.findingContent[d.Bioregion]) {
			soefinding.findingContent[d.Bioregion] = {
				series1: fields.map(f => { return { name: f, data: [] } }),
				groups: [],
				series2: fields.map(f => 0)
			}
		}

		fields.forEach((f, i) => {
			soefinding.findingContent[d.Bioregion].series1[i].data.push(d[f])
			soefinding.findingContent[d.Bioregion].series2[i] += d[f]
		})
		soefinding.findingContent[d.Bioregion].groups.push(d.name)

		if (!qldTotal[d.name])
			qldTotal[d.name] = fields.map(f => 0)
		fields.forEach((f, i) => qldTotal[d.name][i] += d[f])
	})

	// add qld item to regions
	soefinding.findingContent.Queensland = {
		series1: fields.map((f, i) => {
			return {
				name: f,
				data: Object.keys(qldTotal).map(q => {
					return qldTotal[q][i]
				})
			}
		}),
		groups: Object.keys(qldTotal),
		series2: fields.map((f, i) => {
			return Object.keys(qldTotal).reduce((acc, curr) => {
				return acc + qldTotal[curr][i]
			}, 0)
		})
	}

	for (const r in soefinding.findingContent) {
		soefinding.findingContent[r].series2Sum = soefinding.findingContent[r].series2.reduce((acc, curr) => acc + curr)
	}


	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.chart.id = "chart1"
	options1.tooltip.y = { formatter: val => val.toLocaleString() }
	options1.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].groups
	options1.xaxis.labels.trim = true
	options1.xaxis.labels.hideOverlappingLabels = false

	options1.xaxis.tickPlacement = "between" // not a good option, but it fixes a bug
	// where the chart xaxis did not redraw correctly when swapping between regions.,
	// and then you click on one of the legends

	options1.xaxis.title.text = "Hectares"

	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`
	options1.yaxis.title.text = "Broad Vegetation Group"

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		chartactive: true,
	}


	const options2 = soefinding.getDefaultPieChartOptions()
	options2.chart.type = "donut"
	options2.chart.id = "chart2"
	options2.labels = fields
	options2.xaxis.categories = ["Type", "Area (ha)"] // not needed for chart, but vue uses them for table headings
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
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		chartactive: true,
	}

	Vue.createApp({
		data() {
			return soefinding.state
		},
		components: myComponents,
		computed: {
			heading1: () => `Hectares of broad vegetation groups in protected areas in ${soefinding.state.currentRegionName}, 2017  TODO fix year`,
			heading2: () => `Proportion of total remnant vegetation in protected areas in ${soefinding.state.currentRegionName}, 2017 TODO fix year`
		},
		methods: {
			formatter1: val => val.toLocaleString(),
			formatPercent: function (s) {
				return (s / soefinding.findingContent[this.currentRegionName].series2Sum * 100).toFixed(1)
			}
		}
	}).mount("#chartContainer")


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region

		// chart 1
		ApexCharts.exec("chart1", "updateSeries", this.findingContent[this.state.currentRegionName].series1)
		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series1

		// but we also need this for the chart to update
		ApexCharts.exec("chart1", "updateOptions", {
			xaxis: { categories: this.findingContent[this.state.currentRegionName].groups }
		}, true)
		// this works on the table
		options1.xaxis.categories = this.findingContent[this.state.currentRegionName].groups

		// chart 2, pie chart, labels stay the same
		ApexCharts.exec("chart2", "updateSeries", this.findingContent[this.state.currentRegionName].series2)
		soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2


		soefinding.loadFindingHtml()
	}
})