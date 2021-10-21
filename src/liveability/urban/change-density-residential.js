"use strict";

document.addEventListener("DOMContentLoaded", function () {
	const densityKeys = soefinding.findingJson.meta.fields.slice(2, 4)
	const lotKeys = soefinding.findingJson.meta.fields.slice(-2)

	// 1. column chart for qld only, dwelling density
	const series1Items = soefinding.findingJson.data.filter(d => d.Measure == "Dwelling density" && d["Regional Planning Area"] != "Queensland")
	const series1 = densityKeys.map(k => {
		return {
			name: k,
			data: series1Items.map(d => d[k])
		}
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.xaxis.categories = series1Items.map(d => d["Regional Planning Area"].split(/\s|–/))
	options1.xaxis.labels.hideOverlappingLabels = false
	options1.xaxis.labels.rotate = 0
	options1.xaxis.labels.rotateAlways = false
	options1.xaxis.tickPlacement = "between"
	options1.xaxis.title.text = "Region planning area"
	options1.yaxis.title.text = "Dwellings/hectare"
	options1.yaxis.tickAmount = 4
	options1.yaxis.labels.formatter = val => Math.round(val)
	options1.tooltip.y = { formatter: val => val }

	soefinding.state.chart1 = {
		series: series1,
		options: options1,
		chartactive: true,
	}
	soefinding.findingContent.Queensland = { html: "" }


	// 2. column chart for each region, dwelling density
	series1Items.forEach(d => {
		soefinding.findingContent[d["Regional Planning Area"]] = {
			series2: [{
				name: "Density",
				data: densityKeys.map(k => d[k])
			}]
		}
	})

	const options2 = soefinding.getDefaultColumnChartOptions()
	options2.xaxis.categories = densityKeys
	options2.xaxis.tickPlacement = "between"
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Dwellings/hectare"

	soefinding.state.chart2 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		options: options2,
		chartactive: true,
	}


	// 3. column chart for qld only, Median lot size
	const series3Items = soefinding.findingJson.data.filter(d => 
			d.Measure == "Median lot size" 
			&& d[lotKeys[0]] != null
			&& d["Regional Planning Area"] != "Queensland" )
	const series3 = lotKeys.map(k => {
		return {
			name: k,
			data: series3Items.map(d => d[k])
		}
	})

	const options3 = soefinding.getDefaultColumnChartOptions()
	options3.xaxis.categories = series3Items.map(d => d["Regional Planning Area"].split(/\s|–/))
	options3.xaxis.labels.hideOverlappingLabels = false
	options3.xaxis.labels.rotate = 0
	options3.xaxis.labels.rotateAlways = false
	options3.xaxis.tickPlacement = "between"
	options3.xaxis.title.text = "Regional planning area"
	options3.yaxis.title.text = "Median lot size registered m²"

	soefinding.state.chart3 = {
		series: series3,
		options: options3,
		chartactive: true,
	}


	// 4. column chart for each region, Median lot size
	for(let regionName in soefinding.findingContent)
		soefinding.findingContent[regionName].series4 = null //initialise, not all will have data
	series3Items.forEach(d => {
		soefinding.findingContent[d["Regional Planning Area"]].series4 = [{
			name: "Size",
			data: lotKeys.map(k => d[k])
		}]
	})

	const options4 = JSON.parse(JSON.stringify(options2))
	options4.xaxis.categories = lotKeys
	options2.yaxis.title.text = "Median lot size registered m²"

	soefinding.state.chart4 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series4,
		options: options4,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Mean population-weighted dwelling density for Queensland",
			heading2: function() {
				return `Mean population-weighted dwelling density for ${this.currentRegionName}`
			},
			heading3: () => "Change in median lot size in regions for Queensland",
			heading4: function() {
				return `Change in median lot size in regions for ${this.currentRegionName}`
			},
		},
		methods: {
			formatter1: val => val.toFixed(1),
			formatter4: val => val
		}
	})

	
	window.soefinding.onRegionChange = function () {
		soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].series2
		soefinding.state.chart4.series = soefinding.findingContent[soefinding.state.currentRegionName].series4


		soefinding.loadFindingHtml()
	}


})