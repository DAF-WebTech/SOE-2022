"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(3)
	const latestYear = years.at(-1)

	const regions = {}
	soefinding.findingJson.data.forEach(d => {
		if (! regions[d.Region] ) 
			regions[d.Region] = []

			regions[d.Region].push(d)
	})

	const series1Keys = [soefinding.findingJson.meta.fields[2], latestYear]
	for(let region in regions) {
		soefinding.findingContent[region].series1 = series1Keys.map(k => {
			return {
				name: "k",
				data: regions[region].map(d => d[k])
			}
		})
	}

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.chart.id = "chart1"
	options1.xaxis.categories = regions.Queensland.map(d => d.Group)
	options1.xaxis.title.text = "Fauna Group"
	options1.yaxis.title.text = "Hectares"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val/1000000}M` : `${val/1000}K`
	options1.tooltip.y = { formatter: val => val.toLocaleString() }

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		chartactive: true,
	}







	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Area of ${this.currentRegionName} pre-clear threatened fauna habitat and ${this.latestYear} remnant habitat by species group` },
			heading2: function () { return `Proportion of ${this.currentRegionName} pre-clear threatened fauna habitat that is remnant and non-remnant habitat, ${this.latestYear}` },
			heading3: function () { return `Trend in threatened species habitat, for ${this.currentRegionName}` },
			heading4: function () { return `Proportion of pre-clear threatened ${this.currentSpecies} habitat by bioregion` }
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	});


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region
		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].app1;
		ApexCharts.exec("chart1", "updateSeries", this.findingContent[this.state.currentRegionName].series1)





		// soefinding.state.chart2.series =
		// 	this.findingContent[this.state.currentRegionName].app2;
		// soefinding.state.chart3.series =
		// 	this.findingContent[this.state.currentRegionName].app3;
		// soefinding.state.chart4.series =
		// 	this.findingContent[this.state.currentRegionName].app4;

		soefinding.loadFindingHtml();
	};


})