"use strict"

document.addEventListener("DOMContentLoaded", function () {


	const years = soefinding.findingJson.meta.fields.slice(2)

	const series1 = [{
		name: "Places",
		data: years.map(y => soefinding.findingJson.data[0][y])
	}]

	const options1  = soefinding.getDefaultColumnChartOptions() 
	options1.xaxis.categories = years
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number"

		soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}


	const series2 = [soefinding.findingJson.data[0].Entered, soefinding.findingJson.data[0].Removed]

	const options2 = { 
		xaxis: { categories: ["Register<br>Change", "Number<br>of Places"] },
		labels: ["Entered", "Removed"]
	}

	soefinding.state.chart2 = {
		options: options2,
		series: series2,
		chartactive: false,
	}






	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Number of places on the National Heritage Register in Queensland`,
			heading2: () => `Number of places entered or removed from the heritage register, ${years[0]}–${years.at(-1)}`
		},
		methods: {
			formatter1: val => val,
		}
	})

})