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

	const region_key = 0
	const subregion_key = 1
	const product_key = 3
	const header = soefinding.findingJson.data.shift()
	const year_keys = [4, 5, 6]
	const years = year_keys.map(yk => header[yk])


	// group by region and subregion
	soefinding.findingContent = {}
	soefinding.state.regionData = {}
	soefinding.findingJson.data.forEach(d => {
		
		if (d[subregion_key] == null) {
			d[subregion_key] = d[region_key]
		}

		if (!soefinding.state.regionData[d[region_key]]) {
			soefinding.state.regionData[d[region_key]] = {}
			soefinding.findingContent[d[region_key]] = {html: ""}
		}

		if (!soefinding.state.regionData[d[region_key]][d[subregion_key]]) {
			soefinding.state.regionData[d[region_key]][d[subregion_key]] = { 
				data: [],
				chart1: [],
				chart2: {}
			}
		}
		if (d[product_key] != "Total")
			soefinding.state.regionData[d[region_key]][d[subregion_key]].data.push(d)
	})

	soefinding.state.columnChartOptions = soefinding.getDefaultColumnChartOptions()
	soefinding.state.columnChartOptions.xaxis.categories = years.map(k => k.replace("-", "–")) // ndash
	soefinding.state.columnChartOptions.xaxis.title.text = "Year"
	soefinding.state.columnChartOptions.yaxis.title.text = "Tonnes"
	soefinding.state.columnChartOptions.yaxis.labels.formatter = val => val >= 1000000 ? `${val/1000000}M` : ( val >= 1000 ? `${val/1000}K`: val)
	soefinding.state.columnChartOptions.tooltip.y = { formatter: val => val.toLocaleString() }
	
	Object.keys(soefinding.state.regionData).forEach(function(regionName) {
		Object.keys(soefinding.state.regionData[regionName]).forEach(function(subregionName) {

			soefinding.state.regionData[regionName][subregionName].chart1 = soefinding.state.regionData[regionName][subregionName].data.map(d => {
				let heading = `Production amount of ${d[product_key]} in ${regionName} `
				if (regionName != "Queensland")
					 heading += "NRM region"
				if (regionName != subregionName)
					heading += ` — ${subregionName}`

				const zeroSeries = year_keys.reduce( function (acc, curr) {
							return acc + d[curr]
						}, 0) == 0

				
				return { // column chart for each product
						productName: d[product_key],
						heading,
						series: [{name: "Tonnes", data: year_keys.map(yk => d[yk])}],
						chartactive: !zeroSeries,
						zeroSeries
				}
			})
			soefinding.state.regionData[regionName][subregionName].chart2 = {} //line chart for production values TODO
		})
	})








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
		soefinding.loadFindingHtml()
	}


})