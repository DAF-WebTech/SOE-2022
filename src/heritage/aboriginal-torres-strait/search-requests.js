"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1)
	const latestYear = yearKeys[yearKeys.length - 1]

	const series1 = soefinding.findingJson.data.map(d => {
		return {
			name: d.Category,
			data: yearKeys.map(y => d[y])
	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.xaxis.categories = yearKeys
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number of requests"

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Number of cultural heritage search requests, by category",
			heading2: () => `Proportion of cultural heritage search requests by category, ${latestYear}`
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	});


})