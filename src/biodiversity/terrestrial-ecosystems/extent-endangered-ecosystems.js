"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const fields = ["Endangered", "Of concern", "No concern at present"]
	const yearKeys = soefinding.findingJson.meta.fields.slice(6)
	const latestYear = yearKeys.at(-1)
	const bioregions = new Set()


	soefinding.findingContent.Queensland = {
		series1: fields.map(f => { return { name: f, data: [] } }),
		series2: fields.map(f => { return { name: f, data: [] } }),
		series3: fields.map(f => { return { name: f, data: yearKeys.map(y => 0) } }),
		series4: [0, 0, 0], // not used, but we need a default
		series5: [0, 0, 0], // not used, but we need a default
	}
	soefinding.findingJson.data.forEach((d, i) => {
		// the data comes in groups of 3
		// qld only for charts 1 and 2
		soefinding.findingContent.Queensland.series1[i % 3].data.push(d["Number of regional ecosystem"])
		soefinding.findingContent.Queensland.series2[i % 3].data.push(d[latestYear])
		bioregions.add(d.Bioregion)

		// chart 3 qld
		yearKeys.forEach((y, j) => soefinding.findingContent.Queensland.series3[i % 3].data[j] += d[y])

		// chart 3, 4, 5 each region
		if (!soefinding.findingContent[d.Bioregion]) {
			soefinding.findingContent[d.Bioregion] = {
				series3: [],
				series4: [],
				series5: [],
			}
		}
		soefinding.findingContent[d.Bioregion].series3.push({
			name: d["Biodiversity Status"],
			data: yearKeys.map(y => d[y])
		})
		soefinding.findingContent[d.Bioregion].series4.push(d["Number of regional ecosystem"])
		soefinding.findingContent[d.Bioregion].series5.push(d[latestYear])

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


	const options2 = JSON.parse(JSON.stringify(options1))
	options2.yaxis.labels.formatter = val => `${val / 1000000}M`
	options2.yaxis.title = "Hectares"

	soefinding.state.chart2 = {
		options: options2,
		series: soefinding.findingContent.Queensland.series2,
		chartactive: true,
	}


	const options3 = soefinding.getDefaultLineChartOptions()
	options3.chart.id = "chart3"
	options3.xaxis.title = "Year"
	options3.yaxis.title = "Hectares"
	options3.xaxis.categories = yearKeys
	options3.yaxis.labels.formatter = val => {
		if (val >= 1000000)
			return `${val / 1000000}M`
		else
			return `${val / 1000}K`
	}
	options3.tooltip = { y: { formatter: val => val.toLocaleString() } }

	soefinding.state.chart3 = {
		options: options3,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series3,
		chartactive: true,
	}


	const options4 = soefinding.getDefaultPieChartOptions()
	options4.labels = fields
	options4.xaxis.categories = ["Biodiversity status", "Number of regional ecosystems"]

	soefinding.state.chart4 = {
		options: options4,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series4,
		chartactive: true,
	}

	soefinding.state.chart5 = {
		options: options4,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series5,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of regional ecosystems by biodiversity status, ${latestYear}`,
			heading2: () => `Proportion area of biodiversity status, ${latestYear}`,
			heading3: () => `Trends in extent of remnant vegetation, by biodiversity status in ${soefinding.state.currentRegionName}`,
			heading4: () => `Proportion of regional ecosystems by biodiversity status in ${soefinding.state.currentRegionName}, ${latestYear}`,
			heading5: () => `Proportion area of biodiversity status in ${soefinding.state.currentRegionName}, ${latestYear}`
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})



	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region
		// chart 3
		ApexCharts.exec("chart3", "updateSeries", this.findingContent[this.state.currentRegionName].series3)
		soefinding.state.chart3.series = this.findingContent[this.state.currentRegionName].series3

		soefinding.state.chart4.series = this.findingContent[this.state.currentRegionName].series4
		ApexCharts.exec("chart4", "updateSeries", this.findingContent[this.state.currentRegionName].series4)
		ApexCharts.exec("chart4", "updateOptions", { labels: fields }, true)

		soefinding.state.chart5.series = this.findingContent[this.state.currentRegionName].series5
		ApexCharts.exec("chart5", "updateSeries", this.findingContent[this.state.currentRegionName].series5)
		ApexCharts.exec("chart5", "updateOptions", { labels: fields }, true)


		soefinding.loadFindingHtml()
	}
})