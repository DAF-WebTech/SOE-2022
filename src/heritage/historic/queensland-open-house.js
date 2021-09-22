"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const years = [...new Set( soefinding.findingJson.data.map(d => d.Year))]
	const locations = [...new Set( soefinding.findingJson.data.map(d => d.Location))]
	
	const qldSeries = locations.map(loc => {
		return {
			name: loc,
			data: soefinding.findingJson.filter(d => d.Location == loc).map(d => d["Heritage places open"])
		}
	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.xaxis.categories = years
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number of places"

	soefinding.state.chart1 = {
		options: options1,
		series: qldSeries,
		chartactive: true,
	};




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Heritage places open in ${soefinding.currentRegionName}`,
			heading2: () => `People visiting heritage places in ${soefinding.currentRegionName}`
		},
		methods: {
			formatter1: val => val
		}
	})

})