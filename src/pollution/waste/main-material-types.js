"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(4)
	const latestYear = yearKeys[yearKeys.length - 1]
	const extents = ""

	// groupings
	const materials = {}
	const extents = {}
	const sites = {}
	soefinding.findingJson.data.forEach(d => {
		if (!materials[d.Material])
			materials[d.Material] = []
		materials[d.Material].push(d)

		if (!extents[d.Extent])
			extents[d.Extent] = []
		extents[d.Extent].push(d)

		if (!sites[d.Site])
			sites[d.Site] = []
		sites[d.Site].push(d)
	})


	// 1. column chart, count by type
	const countAllSeries = Object.keys(sites).map(s => {
		return {
			name: s,
			data: sites.filter(e => e.Measure == "Count" && e.site == "All").map(d => d[latestYear])
		}
	})

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = Object.keys(materials)
	options1.xaxis.title.text = "Litter Type"
	options1.yaxis.title.text = "Number of items per 100m²"

	soefinding.state.chart1 = {
		options: options1,
		series: countAllSeries,
		chartactive: true,
	};

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Litter items by type, ${latestYear}`,
			heading2: () => "Trends in volume of litter items per 1000m² by Queensland and Australia",
		},
		methods: {
			formatter1: val => val,
			formatter2: val => val.toLocaleString(undefined, {minimumFractionDigits: 2}),
		}
	})
})
