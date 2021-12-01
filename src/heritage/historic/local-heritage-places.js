"use strict"
document.addEventListener("DOMContentLoaded", function () {

	const LOCAL = "Local heritage places identified in a local heritage register"
	const localPlaces = soefinding.findingJson.data.filter(d => d[LOCAL] > 0)
	localPlaces.sort(function(a, b) {
		return b[LOCAL] - a[LOCAL]
	})
	
	const series1 = localPlaces.map(p => p[LOCAL])

	const options1 = soefinding.getDefaultPieChartOptions()
	options1.labels = localPlaces.map(p => p.LGA)
	options1.tooltip = { y: { formatter: (val, options) => {
		const percent = options.globals.seriesPercent[options.seriesIndex][0]
		return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
	}}}
	options1.xaxis.categories = ["LGA", LOCAL.replace("identified", "identified<br>")
	]

	soefinding.state.chart1 = {
		series: series1,
		options: options1,
		chartactive: true,
	}

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Proportion of local heritage places on local heritage registers by local government area, 2020 (TODO fix year)"
		},
		methods: {
			formatter1: val => val.toLocaleString(),
		}
	})


})