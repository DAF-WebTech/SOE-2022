"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const series = [{
		name: "Six month mean",
		data: soefinding.findingJson.data.map(d => d["Six month mean"])
	},
	{
		name: "SOI",
		data: soefinding.findingJson.data.map(d => d.SOI)
	}]

	const options = soefinding.getDefaultLineChartOptions()
	options.xaxis.categories = soefinding.findingJson.data.map(d => `${d.Month}/${d.Year}`)
	options.xaxis.title.text = "Year"
	options.yaxis.title.text = "Index"

	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Southern Oscillation Index 1876–2020` },
		},
		methods: {
			formatter1: val => val
		}
	});
})
