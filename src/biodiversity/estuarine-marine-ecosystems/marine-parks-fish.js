"use strict";

document.addEventListener("DOMContentLoaded", function () {

	var series1Keys = ["Marine conservation park zone", "Marine national park zone", "Marine preservation zone", 
		"Buffer zone	", "Scientific research zone", "Fish habitat area management level A", 
		"Fish habitat area management level B"]



	const series1 = [{ 
		name: "Hectares",
	 	data: series1Keys.map(k => soefinding.findingJson.data[0][k])
	 }]

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.tooltip = { y: { formatter: val => val.toLocaleString() } }
	options1.xaxis.categories = series1Keys
	options1.xaxis.labels = { trim: true, maxHeight: 160 }
	options1.xaxis.title.text = "Protected area type"
	options1.yaxis.title.text = "Hectares"
	options1.yaxis.labels.formatter = val => `${val / 1000}K`

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}


	const series2Keys = ["Total all protection", "Outside all protection"]
	const series2 = series2Keys.map(k => soefinding.findingJson.data[0][k])

	const options2 = soefinding.getDefaultPieChartOptions()
	options2.labels = series2Keys
	options2.tooltip = { y: { formatter: (val, options) => {
		const percent = options.globals.seriesPercent[options.seriesIndex][0]
		return `${val.toLocaleString()}ha (${percent.toFixed(1)}%)`
	}}}
	options2.xaxis.categories = ["Protection", "Hectares"]

	soefinding.state.chart2 = {
		options: options2,
		series: series2,
		chartactive: true,
	}




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Proportion of marine wetlands within protected areas, 2024 TODO fix year",
			heading2: () => "Overall protection of marine wetlands, 2024 TODO fix year",
		},
		methods: {
			formatter1: val => val.toLocaleString(),
		}
	})
})