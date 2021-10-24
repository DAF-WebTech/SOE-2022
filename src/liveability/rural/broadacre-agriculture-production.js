/*
soefinding.state.regionData = {
	regionName:  {
		subregionName: {
			chart1: [ 
				{ // column chart for each product
					productName: "",
					series: [],
					options: {},
					chartactive: true
				}
			], 
			chart2: {} // line chart for production values 
		},
		subregionName: {},
	},
	regionName: {
	}
}

*/


"use strict";

document.addEventListener("DOMContentLoaded", function () {

	// group by region and subregion
	soefinding.state.regionData = {}
	soefinding.findingJson.data.forEach(d => {
		if (!soefinding.state.regionData[d.Region])
			soefinding.state.regionData[d.Region] = {}

		if (!soefinding.state.regionData[d.Region][d.Subregion])
			soefinding.state.regionData[d.Region][d.Subregion] = {}

		soefinding.state.regionData[d.Region][d.Subregion].data.push(d)
	})

	for (let region of regions) {
		for (let subregion of regions[region]) {
			soefinding.findingContent[soefinding.state.currentRegionName] = {
				chart1: regions[region][subregion].map(d => {
					return { // column chart for each product
						productName: "",
						series: [],
						options: {},
						chartactive: true
					}
				}),
				chart2: {} // line chart for production values
			}
		}
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () {
				return `Production amount of XXX in YYY`
			}

		},
		methods: {
			formatter1: val => val?.toLocaleString(2) ?? "0"
		}
	})




	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series

		soefinding.loadFindingHtml()
	}


})