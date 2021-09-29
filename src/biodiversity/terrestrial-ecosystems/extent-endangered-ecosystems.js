"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const fields = ["Endangered", "Of concern", "No concern at present"]
	const latestYear = soefinding.meta.fields.at(-1)
	const bioregions = new Set()

	soefinding.findingContent.Queensland = {
		series1: fields.map(f => {return { name: f , data: []}})
	}
	soefinding.findingJson.data.forEach((d, i) => {
		// the data comes in groups of 3
		soefinding.findingContent.Queensland.series1[i%3] = d[latestYear]

		bioregions.add(d.Bioregion)
	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.xaxis.categories = [...bioregions]
	options1.xaxis.title = "Bioregion"
	options1.yaxis.title = "Number of regional ecosystems"

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent.Queensland.series1,
		chartactive: true,
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of regional ecosystems by biodiversity status, ${latestYear}`,
			heading2: () => `Proportion of total remnant vegetation in protected areas in ${soefinding.state.currentRegionName}, 2017 TODO fix year`
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})



	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region



		soefinding.loadFindingHtml()
	}
})