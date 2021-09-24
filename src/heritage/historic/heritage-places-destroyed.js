"use strict"
document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(1)
	const latestYear = years.at(-1)
	
	// add a total property to each
	soefinding.findingJson.data.forEach(d => {
		d.Total = years.map((acc, curr) => {
			return acc + d[curr]
		}, 0)
	})

	const series1items = soefinding.findingJson.data.filter(d => d.Total > 0)
	const series1data = series1items.map(d => d.Total)

	const options1 = soefinding.getDefaultPieChartOptions()
	options1.labels = series1items.map(d => d.LGA)
	options.xaxis = { categories: ["LGA", "Total"] }

	soefinding.state.chart1 = {
		options: options1,
		series: series1data,
		chartactive: true,
	};





	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Heritage places open in ${soefinding.state.currentRegionName}`,
			heading2: () => `People visiting heritage places in ${soefinding.state.currentRegionName}`
		},
		methods: {
			formatter1: val => isNaN(parseInt(val)) ? "" : val.toLocaleString(),
		}
	})

})