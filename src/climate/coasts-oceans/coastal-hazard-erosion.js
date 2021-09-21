"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const old = Number.prototype.toLocaleString;
	Number.prototype.toLocaleString = function()
	{
		result="hi"+ this
		return result
	}

const series = {
		name: "Area",
		data: soefinding.findingJson.data.map(d => d.Area)
	}

	const options = soefinding.getDefaultBarChartOptions()
	options.xaxis.categories = soefinding.findingJson.data.map(d => d.Region)
	options.xaxis.title.text = "Hectares"
	options.yaxis.title.text = "Region"
	options.tooltip = { y: {formatter = val => `${val} ha.` }}


	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Erosion prone area by region, 2016`
		},
		methods: {
			formatter1: val => val

		}
	});
})
