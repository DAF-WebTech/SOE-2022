"use strict"

document.addEventListener("DOMContentLoaded", function () {

	// first group our data by region
	const regions = new Map()

	soefinding.findingJson.data.forEach(d => {
		if (!regions.has(d["Water quality report card"]))
			regions.set(d["Water quality report card"], [])

		regions.get(d["Water quality report card"]).push(d)
	})

	for (const [region, data] of regions) {

		if (region == "Reef Water Quality report card") {
			soefinding.findingContent[region].series = {
				headings: ["Year", "Progress toward the 2025 land management target", "Per cent (%) of land in priority areas managed using best management practice systems for water quality outcomes (soil, nutrient and pesticides)"],
				data: data.map(d => {
					return [
						d.Year,
						d.Subcatchment,
						d["Per cent of land in priority areas managed using best management practice systems for water quality outcomes (soil, nutrient and pesticides)"]
					]
				})
			}
		}
		else {
			soefinding.findingContent[region].series = {
				headings: ["Year", "Identified pressure", "Risk level", "Threat level"],
				data: data.map(d => [d.Year, d["Identified pressure"], d["Risk level"], d["Threat level"]])
			}
		}
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Pressures identified in ${this.currentRegionName}`
		},
		methods: {
			formatter1: val => val ?? "",
		}
	})


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region

		// chart 1
		//ApexCharts.exec("chart1", "updateSeries", this.findingContent[this.state.currentRegionName].series1)
		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series

		// // but we also need this for the chart to update
		// ApexCharts.exec("chart1", "updateOptions", {
		// 	xaxis: { categories: this.findingContent[this.state.currentRegionName].groups }
		// }, true)
		// // this works on the table
		// options1.xaxis.categories = this.findingContent[this.state.currentRegionName].groups

		// // chart 2, pie chart, labels stay the same
		// ApexCharts.exec("chart2", "updateSeries", this.findingContent[this.state.currentRegionName].series2)
		// soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2


		soefinding.loadFindingHtml()
	}


})
