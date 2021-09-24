"use strict"

document.addEventListener("DOMContentLoaded", function () {


	const years = soefinding.findingJson.meta.fields.slice(2)

	const series1 = [{
		name: "Places",
		data: years.map(y => soefinding.findingJson.data[0][y])
	}]

	const options1  = soefinding.getDefaultColumnChartOptions() 
	options1.xaxis.categories = years

		soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}







	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Total places removed, ${years[0]}–${latestYear}`,
			heading2: () => `Proportion of places removed by Local Government Area (LGA), ${years[0]}–${latestYear}`,
			heading3: () => `Places removed in each LGA, ${years[0]}–${latestYear}`
		},
		methods: {
			formatter1: val => val,
		}
	})

})