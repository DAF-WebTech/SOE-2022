"use strict"

document.addEventListener("DOMContentLoaded", function () {


	const years = soefinding.findingJson.meta.fields.slice(2)

	const series1 = [{
		name: "Places",
		data: years.map(y => soefinding.findingJson.data[0][y])
	}]

	const options1 = soefinding.getDefaultColumnChartOptions()
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

	soefinding.state.yearRange = `${years[0]}–${years.at(-1)}`


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		methods: {
			formatter1: val => val,
		}
	}).mount("#chartContainer")

	soefinding.getResetMapDetails = function (place) {
		return places[place]
	}


})