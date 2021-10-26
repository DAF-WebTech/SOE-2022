"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = years.at(-1)

	const regions = new Map()
	const sites = new Map()
	soefinding.regionNames.forEach(r => regions.set(r, []))
	soefinding.findingJson.data.forEach(d => {
		regions.get(r.Region).push(d)

		// sites are to populate qld item
		if (!sites.has(d.Site))
			sites.set(d.Site, [])
		sites.get(d.Site).push(d)
	})

	// add each "Site" up for our qld aggregate item
	regions.set("Queensland", [])
	for (let [site, data] in sites) {
		regions.get("Queensland").push(years.map(y => data.reduce((acc, curr) => {
			return acc + curr[y]
		}, 0)))
	}

	// chart 1 stacked column
	for (let [region, data] in regions) {
		data.sort(function(a, b) {
			return b[latestYear] - a[latestYear]
		})
		soefinding.findingContent[region].series1 = data.map(d => {
			return {
				name: d.Site,
				data: years.map(y => d[y])
			}
		})
		soefinding.findingContent[region].series1categories = data.map(d => d.Site)
	}

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.xaxis.title.text = "Year"
	options1.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].series1categories
	options1.yaxis.title.text = "Number of places"
	options1.yaxis.labels.formatter = val => val.toLocaleString()

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		options: options1,
		chartactive: true,
	}




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () {
				if (this.currentRegionName == "Queensland")
					return "Change in number of locations, by site type"
				else 
					return `Change in number of locations by site type in ${this.currentRegionName} cultural heritage region`
			},
			heading2: function () {
				let retVal = `Proportion of rural and other areas as at ${soefinding.findingContent[this.currentRegionName].series2LatestYear}`
				if (this.currentRegionName == "Queensland")
					retVal += "*"
				else
					retVal += ` in ${this.currentRegionName}`
				return retVal
			},
			heading3: function () {
				return `Proportion of Queensland made up of rural areas in ${this.currentRegionName} NRM region in ${soefinding.findingContent[this.currentRegionName].series2LatestYear}`
			}
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})


	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series1
		soefinding.state.chart1.options.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].series1categories

		soefinding.loadFindingHtml()
	}

})