"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series1 = soefinding.findingJson.data[1].slice(1)

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.tooltip = { y: { formatter: val => val.toLocaleString() } }
	options1.xaxis.categories = soefinding.findingJson.data[0].slice(1)
	options1.xaxis.title = "Protected area type"
	options1.yaxis.title = "Hectares"
	options1.yaxis.labels.formatter = `${val / 1000}K`

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Proportion of estuarine wetlands within protected areas, 2024 TOD fix year",
			heading2: () => "Overall protection of estuarine wetlands, 2024 TODO fix year",
		},
		methods: {
			formatter1: val => val.toLocaleString(),
		}
	})
