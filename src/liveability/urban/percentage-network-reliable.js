"use strict"

document.addEventListener("DOMContentLoaded", function () {

	let years = soefinding.findingJson.meta.fields.slice(2)

	const series1 = soefinding.findingJson.data.filter(d => d.Measure == "Peak")
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

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}

	years = years.slice(4)
	const series2 = soefinding.findingJson.data.filter(d => d.Measure == "Reliability")
		.map(d => {
			return {
				name: d.Mode.replace("(", "<br>("), // for the table
				data: years.map(y => d[y])
			}
		})

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.xaxis.categories = options2.xaxis.categories.slice(4)
	options2.yaxis.labels.formatter = val => Math.round(val)
	options2.yaxis.max = 100
	options2.tooltip.y = { title: { formatter: val => val.replace("<br>", "") } } // replace <br> for chart tooltip


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
			formatter2: val => val
		}
	});
})
