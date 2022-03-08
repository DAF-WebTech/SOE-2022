"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series1Keys = ["Marine conservation park zone", "Marine national park zone", "Marine preservation zone",
		"Buffer zone", "Scientific research zone", "Fish habitat area management level A",
		"Fish habitat area management level B"]

	const series1KeyLabels = [
		["Marine", "conservation", "park zone"],
		["Marine national", "park zone"],
		["Marine", "preservation", "zone"],
		["Buffer zone"],
		["Scientific", "research zone"],
		["Fish habitat area", "management", "level A"],
		["Fish habitat area", "management", "level B"]
	] // there doesn't seem to be any way to get this done otherwise

	const series1 = [{
		name: "Hectares",
		data: series1Keys.map(k => soefinding.findingJson.data[0][k])
	}]

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.tooltip.y = { formatter: val => val.toLocaleString() }
	options1.xaxis.categories = series1KeyLabels
	options1.xaxis.title.text = "Protected area type"
	options1.yaxis.title.text = "Hectares"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}K`
	options1.yaxis.tickAmount = 6

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}


	const series2Keys = ["Total all protection", "Outside all protection"]
	const series2 = series2Keys.map(k => soefinding.findingJson.data[0][k])

	const options2 = soefinding.getDefaultPieChartOptions()
	options2.chart.type = "donut"
	options2.labels = series2Keys
	options2.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()}ha (${percent.toFixed(1)}%)`
			}
		}
	}
	options2.xaxis.categories = ["Protection", "Hectares"]

	soefinding.state.chart2 = {
		options: options2,
		series: series2,
		seriesSum: series2.reduce(function (acc, curr) { return acc + curr }, 0),
		chartactive: true,
	}

	Vue.createApp({
		data() {
			return soefinding.state
		},
		components: myComponents,
		computed: {
			heading1: () => "Extent of marine wetlands within protected areas, 2024 TODO fix year",
			heading2: () => "Overall protection of marine wetlands, 2024 TODO fix year",
		},
		methods: {
			formatter1: val => val.toLocaleString(),
			formatPercent: function (s) {
				return (s / this.chart2.seriesSum * 100).toFixed(1)
			}
		}
	}).mount("#chartContainer")

})