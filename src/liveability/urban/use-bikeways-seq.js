"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(1)

	const series = years.map(y => {
		return {
			name: y,
			data: soefinding.findingJson.data.map(d => d[y])
		}
	})

	const half = str => {
		const commaPos = str.indexOf(",")
		return [str.substring(0, commaPos + 1), str.substring(commaPos + 2)]
	}

	const options = soefinding.getDefaultColumnChartOptions()
	options.xaxis.categories = soefinding.findingJson.data.map(d => half(d.Site))
	options.xaxis.title.text = "Location"
	options.xaxis.labels.trim = true
	options.yaxis.title.text = "Average daily count"


	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: true,
	}


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => `Daily use of bikeways ${years[0]} to ${years[years.length - 1]}`
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? ""

		}
	}).mount("#chartContainer")
})

