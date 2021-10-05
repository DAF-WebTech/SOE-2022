/*
we have a bug here, I don't know what to do
first load up queensland, the default,
choose a region,
the pie chart doesn't render the labels and there's console errors logged.
note also the table loses its labels

maybe it's because the map layer is failing?

note the pie charts are fine if you load the page with a region already picked,
and then pick other regions.
but  if you go to queensland, and then go back to a region,
the pie chart fails again

*/


"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series1items = soefinding.findingJson.data.filter(d => d["Drainage division"] != "Queensland" && d.Indicator == "Area (ha)")
	const seriesNames = soefinding.findingJson.meta.fields.slice(2, 5)
	const series1 = seriesNames.map(n => {
		return {
			name: n,
			data: series1items.map(d => d[n])
		}
	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.tooltip.y = { formatter: val => val.toLocaleString() } 
	options1.xaxis.categories = series1items.map(d => {
		if (d["Drainage division"].startsWith("North East"))
			return [
				d["Drainage division"].substring(0, d["Drainage division"].lastIndexOf(" ")),
				d["Drainage division"].substring(d["Drainage division"].lastIndexOf(" ") + 1)
			]
		else
			return d["Drainage division"]
	})
	options1.xaxis.title.text = "Wetland System"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}K`
	options1.yaxis.forceNiceScale = false
	options1.yaxis.min = 0
	options1.yaxis.max = 3000000
	options1.yaxis.tickAmount = 6
	options1.yaxis.title.text = "Hectares"

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}


	// chart 2 pie chart for each region but not qld
	const series2items = series1items.filter(d => d["Drainage division"] != "Other")
	series2items.forEach(d => {
		soefinding.findingContent[d["Drainage division"]] = {
			series2: seriesNames.map(n => d[n])
		}
	})
	soefinding.findingContent.Queensland = soefinding.findingContent.Gulf.series2 // dummy values, never used

	const options2 = soefinding.getDefaultPieChartOptions()
	options2.chart.id = "chart2"
	options2.labels = seriesNames
	options2.xaxis = { categories: ["Drainage division", "Hectares"] }
	options2.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
			}
		}
	}

	soefinding.state.chart2 = {
		options: options2,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		chartactive: true,
	}


	// chart 3 shared
	const series3Names = [...seriesNames, "Total"]
	const series3items = soefinding.findingJson.data.filter(d => d["Drainage division"] != "Other"
		&& d["Drainage division"] != "Queensland"
		&& d.Indicator == "Percent of pre-clear")
	series3items.forEach(d => {
		soefinding.findingContent[d["Drainage division"]].series3 = [{
			name: "Percent",
			data: series3Names.map(n => d[n])
		}]
	})
	// qld is different
	soefinding.findingContent.Queensland.series3 = soefinding.findingJson.data
		.filter(d => d.Indicator == "Percent of pre-clear")
		.map(d => {
			return {
				name: d["Drainage division"],
				data: series3Names.map(n => d[n])
			}
		})

	const options3 = soefinding.getDefaultColumnChartOptions()
	//options3.plotOptions = { bar: { barHeight: "90%" } }
	options3.tooltip.y = { formatter: val => val } 
	options3.xaxis.categories = series3Names
	options3.xaxis.title.text = "Wetland system"
	delete options3.xaxis.tickPlacement
	options3.yaxis.title.text = "Percent"
	options3.yaxis.forceNiceScale = false
	options3.yaxis.min = 0
	options3.yaxis.max = 100
	options3.yaxis.tickAmount = 5
	options3.yaxis.labels.formatter = val => Math.round(val)

	soefinding.state.chart3 = {
		options: options3,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series3,
		chartactive: true,
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Freshwater wetland systems extent by region, 2024  TODO fix year`,
			heading2: () => `Proportion of freshwater wetland systems extent in ${soefinding.state.currentRegionName}, 2024 TODO fix year`,
			heading3: () => {
				let heading = "Freshwater wetland system percentage of pre-clear extent remaining"
				if (soefinding.state.currentRegionName != "Queensland")
					heading += " in Bulloo"
				heading += ", 2024 TODO FIX YEAR"
				return heading
			}
		},
		methods: {
			formatter1: val => val.toLocaleString(),
			formatter3: val => val.toFixed(1)
		}
	})


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region

		// chart 2
		if (this.state.currentRegionName != "Queensland") {
			ApexCharts.exec("chart2", "updateSeries", this.findingContent[this.state.currentRegionName].series2)
			soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2
		}

		// chart 3
		ApexCharts.exec("chart3", "updateSeries", this.findingContent[this.state.currentRegionName].series3)
		soefinding.state.chart3.series = this.findingContent[this.state.currentRegionName].series3



		// but we also need this for the chart to update
		//		ApexCharts.exec("chart1", "updateOptions", {
		//			xaxis: { categories: this.findingContent[this.state.currentRegionName].groups }
		//		}, true)
		// this works on the table
		//		options1.xaxis.categories = this.findingContent[this.state.currentRegionName].groups

		soefinding.loadFindingHtml()
	}
})