"use strict";

document.addEventListener("DOMContentLoaded", function () {

	soefinding.findingJson.data.sort(function (a, b) {
		return a["Broad vegetation group number"] - b["Broad vegetation group number"]
	})



	const bioregions = {}
	soefinding.findingJson.data.forEach(d => {

		d.name = `${d["Broad vegetation group number"]}. ${d["Broad vegetation group label"].replace("-", "—")}` // em dash

		if (!bioregions[d.Bioregion])
			bioregions[d.Bioregion] = []
		bioregions[d.Bioregion].push(d)
	})

	// chart 1 column chart
	const fields = soefinding.findingJson.meta.fields.slice(-2) // last 2
	// gather series
	const qldTotal = {}
	for (let bioregion in bioregions) {
		soefinding.findingContent[bioregion] = {
			series1: fields.map((f, i) => {
				return {
					name: f,
					data: bioregions[bioregion].map(d => {

						// as a side effect, populate the qld series
						if (!qldTotal[d.name])
							qldTotal[d.name] = [0, 0]
						qldTotal[d.name][i] += d[f]

						return d[f]
					})
				}
			}),
			groups: bioregions[bioregion].map(d => d.name)
		}
	}
	soefinding.findingContent.Queensland = {
		series1: fields.map((f, i) => {
			return {
				name: f,
				data: Object.keys(qldTotal).map(q => qldTotal[q][i])

			}
		}),
		groups: Object.keys(qldTotal)
	}

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.tooltip = { y: { formatter: val => val.toLocaleString() } }
	options1.xaxis.categories = soefinding.findingContent[soefinding.state.currentRegionName].groups
	options1.xaxis.labels = {
		trim: true,
		hideOverlappingLabels: false
	}
	options1.xaxis.title = "Hectares"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`
	options1.yaxis.title = "Broad Vegetation Group"

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