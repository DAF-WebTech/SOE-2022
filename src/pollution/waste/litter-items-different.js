"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. bar, average litter count by site type
	const extents = ["Australia", "Queensland"]
	const averageSeries = extents.map (e => {
		return {
			name: e, 
			data: soefinding.findingJson.data.filter(d => d.Extent == e).map(d => d[latestYear])
		}
	})

	const options1 = soefinding.getDefaultLineChartOptions()
	options1.xaxis.title.text = "Site type"
	options1.xaxis.categories = soefinding.findingJson.data.filter(d => d.Extent == "Queensland").map(d => d.Extent)
	options1.yaxis.title.text = "Number of items per 100m²"


	soefinding.state.chart1 = {
		options: options1,
		series: averageSeries,
		chartactive: true,
	};




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Average litter count by site type, ${latestYear}`,
			heading2: () => "Trends in volume of litter items per 1000m² by Queensland and Australia",
		},
		methods: {
			formatter1: val => val,
			formatter2: val => val.toLocaleString(undefined, {minimumFractionDigits: 2}),
		}
	})
})
