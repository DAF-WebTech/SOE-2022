"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series1Keys = soefinding.findingJson.meta.fields.filter(f => f.includes("threatened") && !f.includes("near"))
	const series1 = soefinding.findingJson.data.map(d => {
		return {
			name: d.Group,
			data: series1Keys.map(k => d[k])
		}
	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.xaxis.categories = series1Keys.map(k => k.split(" ")[0])
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number of species"

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Numbers of threatened fauna (<i>Nature Conservation Act 1992</i> Extinct, Extinct in the Wild, Critically Endangered, Endangered, and Vulnerable) by species group",
			heading2: () => `Proportion of freshwater wetland systems extent in ${soefinding.state.currentRegionName}, 2024 TODO fix year`,
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})
})