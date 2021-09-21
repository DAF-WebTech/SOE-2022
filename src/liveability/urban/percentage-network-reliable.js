"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(1)

	const series1 = soefinding.findingJson.data.filter(d => d.Measure=="Peak")
	.map(d => {
		return {
			name: d.Mode,
			data: years.map(y => d[y])
		}
	})

	const options1 = soefinding.getDefaultLineChartOptions()
	options1.xaxis.categories = years.map(y => y.replace("-", "–")) //ndash
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Network travel time reliability (%)"
	// options1.yaxis.labels.formatter = val => val
	// options1.tooltip = { y: { formatter: val => val } }

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}

	const series2 = soefinding.findingJson.data.filter(d => d.Measure=="Reliability")
	.map(d => {
		return {
			name: d.Mode,
			data: years.map(y => d[y])
		}
	})

	const options2 = JSON.parse(JSON.stringify(options1))

	soefinding.state.chart2 = {
		options: options2,
		series: series2,
		chartactive: true,
	}

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Percentage of network travel time reliability (%)`,
			heading2: () => `Percentage of on-time reliability of public transport trips in South East Queensland`
		},
		methods: {
			formatter1: val => val,
			formatter2: val => val.toFixed(2)

		}
	});
})
