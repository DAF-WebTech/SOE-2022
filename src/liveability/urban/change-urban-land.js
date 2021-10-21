"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const regions = soefinding.findingJson.meta.fields.slice(1)

	const Total_area_mapped = 0
	const Urban_area_in_1999 = 1
	const Urban_area_in_current_mapping = 2
	const Year_of_current_mapping = 3


	// fix "Queensland Wide" to Queensland, and assuming it was in last position
	regions[regions.length - 1] = "Queensland" 
	soefinding.findingJson.data.forEach(d => {
		const temp = d["Queensland Wide"]
		delete d["Queensland Wide"]
		d.Queensland = temp
	})


	// chart 1, each region and qld
	regions.forEach(r => {
		soefinding.findingContent[r] = {
			series1: [{
				name: "Hectares",
				data: [soefinding.findingJson.data[Urban_area_in_1999][r], soefinding.findingJson.data[Urban_area_in_current_mapping][r]]
			}],
			categories1: ["1999", String(soefinding.findingJson.data[Year_of_current_mapping][r]).replace("-", "–")]
		}
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].categories1
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Hectares"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val/1000000}M` : (val >= 1000 ? `${val/1000}K` : val)
	options1.yaxis.labels.minWidth = 30
	options1.tooltip.y = { formatter: val => val.toLocaleString() }

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		options: options1,
		chartactive: true,
	}


	// chart 2, pie chart same for every region and qld
	regions.forEach(r => {
		soefinding.findingContent[r].series2 = [ 
				soefinding.findingJson.data[Urban_area_in_current_mapping][r], 
				soefinding.findingJson.data[Total_area_mapped][r] - soefinding.findingJson.data[Urban_area_in_current_mapping][r] 
		]
		soefinding.findingContent[r].tfoot2 = `<th scope=row>Total<td class=num>${soefinding.findingJson.data[Total_area_mapped][r].toLocaleString()}`
	})

	const options2 = soefinding.getDefaultPieChartOptions()
	options2.labels = ["Urban", "Non-Urban"]
	options2.xaxis.categories = ["", "Hectares"]
	options2.tooltip = {y : {  formatter: (val, options) => {
		const percent = options.globals.seriesPercent[options.seriesIndex][0]
		return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
	}}}		

	soefinding.state.chart2 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		tfoot: soefinding.findingContent[soefinding.state.currentRegionName].tfoot2, 
		options: options2,
		chartactive: true,
	}


	// chart 3, pie chart regions only
	regions.filter(r => r != "Queensland").forEach(r => {
		soefinding.findingContent[r].series3 = [ 
				soefinding.findingJson.data[Total_area_mapped].Queensland, 
				soefinding.findingJson.data[Urban_area_in_current_mapping][r] 
		]
		soefinding.findingContent[r].labels3 = ["Queensland urban", `${r} urban`]
	})

	const options3 = soefinding.getDefaultPieChartOptions()
	options3.labels = soefinding.findingContent[soefinding.state.currentRegionName].labels3
	options3.xaxis.categories = ["", "Hectares"]
	options3.tooltip = {y : {  formatter: options1.tooltip.y.formatter}}

	soefinding.state.chart3 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series3,
		options: options3,
		chartactive: true,
	}


	// chart 4 is a column chart per region that shows on the queensland page
	const options4 = soefinding.getDefaultColumnChartOptions()
	options4.xaxis.title.text = "Year"
	options4.yaxis.title.text = "Hectares"

	soefinding.state.chart4 = soefinding.regionNames.slice(1).map((r, i) => { 
		const options = JSON.parse(JSON.stringify(options4))
		options.xaxis.categories = ["1999", soefinding.findingJson.data[Year_of_current_mapping][r]]
		options.yaxis.labels.formatter = val => val>1000 ? `${val/1000}k` : val
		options.tooltip.y = { formatter: val => val.toLocaleString() }

		return {
			name: r,
			checked: i == 0,
			chartactive: true,
			series: [{
				name: "Hectares", 
				data: [
					soefinding.findingJson.data[Urban_area_in_1999][r], 
					soefinding.findingJson.data[Urban_area_in_current_mapping][r]
				]
			}],
			options
		}
	})


	
	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function() {
				if (this.currentRegionName == "Queensland")
					return "Urban area growth between 1999 and 2017*" 
				else 
					return `Urban area growth between 1999 and ${soefinding.findingJson.data[Year_of_current_mapping][this.currentRegionName]} in ${this.currentRegionName}`
			},
			heading2: function() {
				if (this.currentRegionName == "Queensland")
					return "Proportion of urban and non-urban areas as at 2017*"
				else
					return `Proportion of ${this.currentRegionName} made up of urban and non-urban areas in ${soefinding.findingJson.data[Year_of_current_mapping][this.currentRegionName]}` 
			},
			heading3: function() {
				return `Proportion of Queensland made up of urban area in ${this.currentRegionName} in 2017`
			}
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})

	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.options.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].categories1
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series1

		soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].series2
		soefinding.state.chart2.tfoot = soefinding.findingContent[soefinding.state.currentRegionName].tfoot2

		soefinding.state.chart3.options.labels = soefinding.findingContent[soefinding.state.currentRegionName].labels3
		soefinding.state.chart3.series = soefinding.findingContent[soefinding.state.currentRegionName].series3


		soefinding.loadFindingHtml()
	}

})