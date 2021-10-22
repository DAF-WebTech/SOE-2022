"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const areas = soefinding.findingJson.meta.fields.slice(2)

	const regions = new Map()
	const years = new Set()
	soefinding.findingJson.data.forEach(d => {
		if (!regions.has(d.Region))
			regions.set(d.Region, [])
		
		regions.get(d.Region).push(d)

		years.add(d.Year)
	})

	for (let [region, data] of regions) {
		soefinding.findingContent[region].series = areas.map(a => {
			return {
				name: a,
				data: data.map(d => d[a])
			}
		})
	}

	const options = soefinding.getDefaultColumnChartOptions()
	options.xaxis.categories = [...years]
	options.xaxis.title.text = "Year"
	options.yaxis.title.text = "Hectares"



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function() { return  `Cropped area by season (million ha) in ${this.currentRegionName}`
		}

		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})




	window.soefinding.onRegionChange = function () {
		soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].series2

		soefinding.loadFindingHtml()
	}


})