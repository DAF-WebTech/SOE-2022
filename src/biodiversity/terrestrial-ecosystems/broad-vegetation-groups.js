"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const fields =  soefinding.findingJson.meta.fields.slice(-2) // last 2
	soefinding.findingContent.Queensland = { series1: [] }
	soefinding.findingJson.data.forEach(d => {
		if (!soefinding.findingContent[d.Bioregion])
			soefinding.findingContent[d.Bioregion] = { series1: [] }
		
			d.name = `${d["Broad vegetation group number"]}. ${d["Broad vegetation group label"]}` 
			soefinding.findingContent[d.Bioregion].series1.push( {
				name: d.name,
				data: fields.map(f => d[f])
			})

			let qldItem = soefinding.findingContent.Queensland.series1.find(q => q.name == d.name)
			if (! qldItem) {
				qldItem =  {
						name: d.name, 
						data: fields.map(f => 0)
					} 
					soefinding.findingContent.Queensland.series1.push(qldItem)
				}
			fields.forEach(f => qldItem[f] += d[f])
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.xaxis.categories = fields
	options1.xaxis.title = "Hecatares"
	options1.yaxis.title = "Broad Vegetation Group"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`
	options1.tooltip = { y: { formatter: val => val.toLocaleString() } }
	
	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		chartactive: true,
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Hectares of broad vegetation groups in protected areas in ${soefinding.state.currentRegionName}, 2017`,
			heading2: () => `Cumulated extent of all protected areas`
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region

		// chart 1
		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series1
		// this works on the table
		soefinding.state.chart1.options.labels = this.findingContent[this.state.currentRegionName].labels1
		// but we also need this for the chart to update
		ApexCharts.exec("chart1", "updateOptions", {
			labels: this.findingContent[this.state.currentRegionName].labels1,
		})
	}
})