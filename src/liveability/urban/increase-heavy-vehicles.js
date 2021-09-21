"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const keys = soefinding.findingJson.meta.fields.slice(1)

	const series = keys.map(k => {
		return {
			name: k, 
			data: soefinding.findingJson.data.map(d => d[k])
		}
	})


	const options = soefinding.getDefaultColumnChartOptions()
	options.xaxis.categories = soefinding.findingJson.data.map(d => d.Year)
	options.xaxis.title.text = "Year"
	options.yaxis.title.text = "Number of vehicles"
	options.yaxis.labels.formatter = val => {
		if (val >= 1000000)
		  return `${val / 1000000}m`
		else
          return `${val / 1000}k`
		

	}
	options.tooltip = { y: { formatter: val => val.toLocaleString() } }


	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Number of light and heavy vehicles registered in Queensland`
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	});
})
