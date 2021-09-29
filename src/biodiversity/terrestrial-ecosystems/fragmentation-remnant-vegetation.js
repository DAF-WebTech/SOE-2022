"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series1items = soefinding.findingJson.data.filter(d => d.Figure==1)
	const series1fields = soefinding.findingJson.meta.fields.slice(-3)
	const series1labels = ["Patch value (%)", "Edge value (%)", "Core value (%)"] 
	const years = new Set()
	series1items.forEach(d => {
		years.add(d.YEAR)

		if (!soefinding.findingContent[d.REGPage])
		soefinding.findingContent[d.REGPage] = {
			series1: series1labels.map(l =>  { return { name: l, data: []}})
		}

		series1fields.forEach((f, i) => soefinding.findingContent[d.REGPage].series1[9].data.push(d[f]))
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.tooltip = { y: { formatter: val => val.toFixed(2) } }
	options1.xaxis.categories = [...years]
	options1.xaxis.title = "Percent"
	options1.yaxis.labels.formatter = val => Math.round(val)
	options1.yaxis.title = "Year"
	

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent.Queensland.series1,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => { 
				let title = "Percent change in the number of fragmentation classes from previous reporting period"
				if (soefinding.state.currentRegionName != "Queensland")
					title += ` in ${soefinding.state.currentRegionName}`
				return title
			},
			heading2: () => {
				let title = "Density change of fragmentation classes per 1000km²"
				if (soefinding.state.currentRegionName != "Queensland")
					title += ` in ${soefinding.state.currentRegionName}`
				return title
			},
			heading3: () => {
				let title = "Change in the number of fragmentation classes"
				if (soefinding.state.currentRegionName != "Queensland")
					title += ` in ${soefinding.state.currentRegionName}`
				title += `, in ${latestYear}`
			},
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? ""
		}
	})


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region

		// chart 1
		// the exec function only seems necessary when the x-axis changes, but keeping it here for reference in case i’m wrong
		//ApexCharts.exec("chart1", "updateSeries", this.findingContent[this.state.currentRegionName].series1)
		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series1


		// chart 2
		// the exec function only seems necessary when the x-axis changes, but keeping it here for reference in case i’m wrong
		//ApexCharts.exec("chart2", "updateSeries", this.findingContent[this.state.currentRegionName].series2)
		soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2

		// chart 3
		//ApexCharts.exec("chart3", "updateSeries", this.findingContent[this.state.currentRegionName].series3)
		soefinding.state.chart3.series = this.findingContent[this.state.currentRegionName].series3


		soefinding.loadFindingHtml()
	}
})