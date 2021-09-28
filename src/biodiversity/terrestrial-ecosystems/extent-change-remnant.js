"use strict";

document.addEventListener("DOMContentLoaded", function () {

	var years = soefinding.findingJson.meta.fields.slice(4);
	var latestYear = years.at(-1)

	// sort data by latest year
	soefinding.findingJson.data.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})

	const bioregions = {}
	const qldData = [] // we need to populate a qld item as we go
	soefinding.findingJson.data.forEach(d => {
		// fix up the group label
		d["Broad vegetation group label"] = `${d["Broad vegetation group number"]}. ${d["Broad vegetation group label"].replace("-", "—")}` //mdash
		delete d["Broad vegetation group number"]

		// group by bioregion
		if (!bioregions[d.Bioregion]) {
			bioregions[d.Bioregion] = []
		}
		bioregions[d.Bioregion].push(d)

		let qldGroup = qldData.find(q => q["Broad vegetation group label"] == d["Broad vegetation group label"])
		if (!qldGroup) {
			qldGroup = {
				"Broad vegetation group label": d["Broad vegetation group label"],
				[latestYear]: 0
			}
			qldData.push(qldGroup)
		}
		qldGroup[latestYear] += d[latestYear]
	})

	// set our chart data for each region
	for (const bioregion in bioregions) {
		soefinding.findingContent[bioregion] = {
			app1: bioregions[bioregion].map((d, i) => {
				// as a side effect populate qld value
				return d[latestYear]
			}),
			labels: bioregions[bioregion].map(d => d["Broad vegetation group label"])
		}
	}
	// set chart date for qld, but first needs sorting
	qldData.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})
	soefinding.findingContent.Queensland = {
		app1: qldData.map(d => d[latestYear]),
		labels: qldData.map(d => d["Broad vegetation group label"]) // or could be keys of bioregions
	}

	const options1 = soefinding.getDefaultPieChartOptions();
	options1.chart.id = "chart1"
	options1.labels = soefinding.findingContent[soefinding.state.currentRegionName].labels
	options1.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()}ha (${percent.toFixed(1)}%)`
			}
		}
	}
	options1.xaxis.categories = ["Broad vegetation group", "Hectares"] // these are the table headings


	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName].app1,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of broad vegetation groups in ${soefinding.state.currentRegionName}, ${latestYear}`,
			heading2: () => "Percentage change in area between 1999 and 2019"
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region

		// chart 1
		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].app1
		// this works on the table
		soefinding.state.chart1.options.labels = this.findingContent[this.state.currentRegionName].labels
		// but we also need this for the chart to update
		ApexCharts.exec("chart1", "updateOptions", {
			labels: this.findingContent[this.state.currentRegionName].labels,
		})





		soefinding.loadFindingHtml();
	}


})