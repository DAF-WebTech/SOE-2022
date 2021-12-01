"use strict"
document.addEventListener("DOMContentLoaded", function () {

	const localPlaces = soefinding.finding.Json.data.filter(d => d["Local heritage places identified in a local heritage register"] > 0)
	const series1 = [{
		name: "Places",
		data: localPlaces.map(p => p["Local heritage places identified in a local heritage register"])
	}]

	const options1 = soefinding.getDefaultPieChartOptions()
	options1.labels = localPlaces.map(p => p.LGA)
	options1.tooltip = { y: { formatter: (val, options) => {
		const percent = options.globals.seriesPercent[options.seriesIndex][0]
		return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
	}}}

	soefinding.state.chart1 = {
		series: series1,
		options: options1,
		chartactive: true,
	}

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Proportion of local heritage places on local heritage registers by local government area (LGA), 2020 (TODO fix year)"
		},
		methods: {
			formatter1: val => val.toLocaleString(),
		}
	})


})