"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(3)

	// group by region name
	const regions = new Map()
	soefinding.regionNames.forEach(r => regions.set(r, []))

	soefinding.findingJson.data.forEach(d => {
		// normalise region names to match UI
		d.Region = d.Region.replace(" NRM region", "")
		d.Region = d.Region.replace(" Wide", "")

		regions.get(d.Region).push(d)
	})

	// initialise items we will use this in the loop of regions
	const qldTotal = regions.get("Queensland").find(d => d.Use == "total area mapped")["total area mapped"]
	soefinding.state.series4 = {}
	// we need these now because the individual options for chart 4 will be based on this
	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.chart.id = "chart1"
	options1.tooltip.y = { formatter: val => `${val.toLocaleString()} ha` }
	delete options1.xaxis.tickPlacement
	options1.xaxis.title.text = "Year"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val / 1000000}M` : (val >= 1000 ? `${val / 1000}K` : val)
	options1.yaxis.labels.minWidth = 30
	options1.yaxis.title.text = "Hectares"


	// create series for each region
	for (let [region, data] of regions) {
		soefinding.findingContent[region] = {}
		const keys = []

		// chart 1, a stacked column chart, same for qld and each region
		soefinding.findingContent[region].series1 = data.filter(d => d.Use != "total area mapped").map(d => {
			let firstIndex = -1, lastIndex = 0
			yearKeys.forEach((y, i) => {
				if (firstIndex == -1 && d[y] != null)
					firstIndex = i
				if (d[y] != null)
					lastIndex = i
			})

			keys[0] = firstIndex
			keys[1] = lastIndex

			soefinding.findingContent[region].series1categories = [yearKeys[firstIndex], yearKeys[lastIndex]]

			return {
				name: d.Use,
				data: soefinding.findingContent[region].series1categories.map(c => d[c])
			}
		})

		// chart 2, a pie chart, same for qld and each region
		soefinding.findingContent[region].series2LatestYear = soefinding.findingContent[region].series1categories[1]
		soefinding.findingContent[region].series2 = data.filter(d => d.Use != "total area mapped").map(d => d[soefinding.findingContent[region].series2LatestYear])
		const totalRural = soefinding.findingContent[region].series2.reduce((acc, curr) => acc + curr)
		const totalMapped = data.find(d => d.Use == "total area mapped")["total area mapped"]
		const nonRural = totalMapped - totalRural
		soefinding.findingContent[region].series2.push(nonRural)

		// chart 3, a pie chart, regions only
		soefinding.findingContent[region].series3 = [totalRural, qldTotal - totalRural]


		//chart 4 is a column chart for each regions that iis only showed on qld page.
		if (region != "Queensland") {
			const years = keys.map(k => yearKeys[k])
			const options = JSON.parse(JSON.stringify(options1))
			options.yaxis.labels.formatter = options1.yaxis.labels.formatter
			options.tooltip.y.formatter = options1.tooltip.y.formatter
			options.xaxis.categories = years

			soefinding.state.series4[region] = {
				checked: false,
				chartactive: true,
				years,
				options,
				series: data.filter(d => d.Use != "total area mapped").map(d => {
					return {
						name: d.Use,
						data: years.map(y => d[y])
					}
				})
			}
		}

	}

	soefinding.findingContent.Queensland.series3 = [0, 0] // not used but needed to avoid error

	soefinding.state.series4["Burnett Mary"].checked = true


	// set up chart 1
	options1.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].series1categories

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		options: options1,
		chartactive: true,
	}


	// set up chart 2
	const options2 = soefinding.getDefaultPieChartOptions()
	options2.chart.type = "donut"
	options2.labels = ["Rural Land in Intensive Use", "Rural Land in Extensive Use", "Rural Land Not Settled", "Non Rural area"]
	options2.xaxis.categories = ["Use", soefinding.findingContent[soefinding.state.currentRegionName].seriesLatestYear]
	options2.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
			}
		}
	}

	soefinding.state.chart2 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		options: options2,
		chartactive: true,
	}


	// set up chart 3
	const options3 = soefinding.getDefaultPieChartOptions()
	options3.chart.type = "donut"
	options3.labels = [soefinding.state.currentRegionName + " NRM Region", "All Other Qld"]
	options3.xaxis.categories = ["Name", "Value"]
	options3.tooltip = { y: { formatter: options2.tooltip.y.formatter } }

	soefinding.state.chart3 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series3,
		options: options3,
		chartactive: true,
	}


	// chart 4 already done in loop

	soefinding.vueApp = new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () {
				let retVal = `Rural area growth between ${soefinding.findingContent[this.currentRegionName].series1categories[0]} and ${soefinding.findingContent[this.currentRegionName].series1categories[1]}`
				if (this.currentRegionName == "Queensland")
					retVal += "*"
				else
					retVal += ` in ${this.currentRegionName}`
				return retVal
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
			formatter1: val => val.toLocaleString(),
			formatPercent: function (s, i, series) {
				const sum = series.reduce((acc, curr) => acc + curr)
				let ret = (s / sum * 100).toFixed(1)

				switch (this.currentRegionName) {
					case "Desert Channels":
						ret = (s / sum * 100).toFixed(2)
					case "Torres Strait":
						ret = (s / sum * 100).toFixed(2)
					default:
				}

				return ret
			}
		}
	})

	// keep the region-wide "more information links", update them each time a region is laoded
	const moreInformationFinding = document.querySelector("div.more-information-finding")
	const moreInformationRegionLinks = moreInformationFinding.querySelectorAll("li")
	moreInformationFinding.parentElement.removeChild(moreInformationFinding)




	window.soefinding.onRegionChange = function () {

		soefinding.vueApp.chart1.options.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].series1categories
		soefinding.vueApp.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series1

		soefinding.vueApp.chart2.options.xaxis.categories[1] = soefinding.findingContent[soefinding.state.currentRegionName].series2LatestYear
		soefinding.vueApp.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].series2

		soefinding.vueApp.chart3.options.labels[0] = soefinding.state.currentRegionName + " NRM Region"
		soefinding.vueApp.chart3.series = soefinding.findingContent[soefinding.state.currentRegionName].series3

		soefinding.loadFindingHtml(function() {
			const ul = document.querySelector("ul.morinfo")
			moreInformationRegionLinks.forEach(function(l) {
				ul.appendChild(l)
			})
		})
			
	}

})