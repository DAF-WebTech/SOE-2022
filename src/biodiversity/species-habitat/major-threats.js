"use strict";

document.addEventListener("DOMContentLoaded", function () {


	const tableSeries = [{
		name: "Number of<br>threatened<br>species",
		data: soefinding.findingJson.data.map(d => d[`Number threatened ${soefinding.biota}`])
	}]

	const chartItems = soefinding.findingJson.data.slice(0, 30) //the first thirty
	const otherItems = soefinding.findingJson.data.slice(30) // the last few
	const chartSeries = [{
		name: "Number of<br>threatened<br>species",
		data: chartItems.map(d => d[`Number threatened ${soefinding.biota}`])
	}]

	chartSeries[0].data.push(
		otherItems.reduce( function(acc, curr) { 
			return acc + curr[`Number threatened ${soefinding.biota}`]}, 0)
	)

	const options = soefinding.getDefaultBarChartOptions()
	options.chart.height = 600
	options.xaxis.categories = chartItems.map(d => d.Threat.replace("-", "—"))
	options.xaxis.categories.push("Others")
	options.xaxis.labels.trim = true
	options.plotOptions = {
		bar: {
			horizontal: true,
		}
	}
	options.xaxis.title.text = "Threat"
	options.yaxis.labels.minWidth = 300
	options.yaxis.labels.maxWidth = 300
	options.yaxis.title.offsetX = 15
	options.yaxis.title.text = "Number of threatened species"


	soefinding.state.chart1 = {
		options,
		chartSeries,
		tableSeries,
		chartactive: true,
		tableCategories: soefinding.findingJson.data.map(d => d.Threat.replace("-", "—"))
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Major threats to ${soefinding.biota} species, 2024 TODO fix year`,
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})

})

