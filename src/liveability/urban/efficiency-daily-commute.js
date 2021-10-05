"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(1)

	const series = soefinding.findingJson.data.map(d => {
		return {
			name: d.Peak,
			data: years.map(y => d[y])
		}
	})


	const options = soefinding.getDefaultLineChartOptions()
	options.xaxis.categories = years.map(y => y.replace("-", "–")) //ndash
	options.xaxis.title.text = "Year"
	options.yaxis.title.text = "Travel time (minutes per 10 kms)"
	options.yaxis.labels.formatter = val => val
	options.tooltip.y ={ formatter: val => val } 


	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Average travel time in minutes per 10 kilometres`
		},
		methods: {
			formatter1: val => val.toFixed(1)

		}
	});
})
