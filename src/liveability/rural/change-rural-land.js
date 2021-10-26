"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(3)

	// group by region name
	const regions = new Map()
	soefinding.findingJson.data.forEach(d => {
		// normalise region names to match UI
		d.Region = d.Region.replace(" NRM region", "")
		d.Region = d.Region.replace(" Wide", "")

		if (!regions.has(d.Region))
			regions.set(d.Region, [])
		regions.get(d.Region).push(d)
	})

	// create series 1 for each region
	for(let [region, data] of regions) {
		soefinding.findingContent[region] = {}
		soefinding.findingContent[region].series1 = data.filter(d => d.Use != "total area mapped").map(d => {
			let firstIndex = -1, lastIndex = 0
			yearKeys.forEach((y, i) => {
				if (firstIndex == -1 && d[y] != null)
					firstIndex = i
				if  (d[y] != null)
					lastIndex = i
			})
			soefinding.findingContent[region].series1categories = [firstIndex, lastIndex]

			return {
				name: d.Use,
				data: soefinding.findingContent[region].series1categories.map(c => d[c])
			}
		})
	}

	const options1 = soefinding.getDefaultColumnChartOptions
	options1.xaxis.categories = soefinding.findingContent[region].series1categories
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Hectares"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val/1000000}M` : (val >= 1000 ? `${val/1000}K` : val)
	options1.tooltip.y = { formatter: val => `${val.toLocaleString()} ha` }

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		options: options1,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
	})


	window.soefinding.onRegionChange = function () {
		soefinding.state.options1.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].series1categories
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series1

		soefinding.loadFindingHtml()
	}

})