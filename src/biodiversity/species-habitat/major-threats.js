"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series = [
		{
			name: "Number of<br>threatened<br>species",
			data: soefinding.findingJson.data.map(d => d[`Number threatened ${soefinding.biota}`])
		}
	]

	const options = soefinding.getDefaultColumnChartOptions()
	options.xaxis.categories = soefinding.findingJson.data.map(d => d.Threat.replace("-", "—"))
	options.xaxis.labels.hideOverlappingLabels = false
	options.xaxis.labels.trim = true
	options.xaxis.title.text = "Threat"
	options.yaxis.title.text = "Number of threatened species"

	soefinding.state.chart1 = {
		options,
		series,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Major threats to ${soefinding.biota} species, 2024 TODO fix year",
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})

})

