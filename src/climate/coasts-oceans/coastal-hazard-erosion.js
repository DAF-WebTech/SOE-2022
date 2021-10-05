"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const old = Number.prototype.toLocaleString;
	Number.prototype.toLocaleString = function () {
		const result = old.call(this)
		return result
	}

	const series = [{
		name: "Area",
		data: soefinding.findingJson.data.map(d => d.Area)
	}]

	const options = soefinding.getDefaultBarChartOptions()
	options.xaxis.categories = soefinding.findingJson.data.map(d => d.Region)
	options.xaxis.title.text = "Region"
	options.yaxis.title.text = "Hectares"
	options.yaxis.labels.formatter = val => `${val / 1000}k`
	options.tooltip.y = { formatter: val => `${val.toLocaleString()} ha.` } 


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
			formatter1: val => val.toLocaleString()

		}
	});
})
