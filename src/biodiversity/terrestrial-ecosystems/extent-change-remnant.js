"use strict";

document.addEventListener("DOMContentLoaded", function () {

	var years = soefinding.findingJson.meta.fields.slice(4);
	var latestYear = years.at(-1)

	//  might remove this declaration, bioregions should be available elsewhere
	const bioregions = {}
	const qldData = {} // we need to populate a qld item as we go
	soefinding.findingJson.data.forEach(d => {
		// fix up the group label
		d["Broad vegetation group label"] = `${d["Broad vegetation group number"]}. ${d["Broad vegetation group label"]}`
		delete d["Broad vegetation group number"]

		// group by bioregion
		if (!bioregions[d.Bioregion]) {
			bioregions[d.Bioregion] = []
			qldData["Broad vegetation group label"] = { latestYear: 0}
		}
		bioregions[d.Bioregion].push(d)

		qldData["Broad vegetation group label"].latestYear =+ d[latestYear]
	})


	for (const bioregion in bioregions) {
		soefinding.findingContent[bioregion] = {
			app1: bioregions[bioregion].map((d, i) => {
				// as a side effect populate qld value
				return d[latestYear]
			}),
			app1labels = bioregions[bioregion].map(d => d["Broad vegetation group label"])
		}
	}
	soefinding.findingContent.Queensland = {
		app1: qldData.map(d => d[latestYear]),
		app1labels = Object.keys(qldData) // or could be keys of bioregions
	}

		const options1 = soefinding.getDefaultPieChartOptions();
		options1.xaxis.categories = ["Broad vegetation group", "Hectares"]
		options1.labels = soefinding[soefinding.state.currentRegionName].app1labels


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
				formatter1: val => val
			}
		})


		window.soefinding.onRegionChange = function () {
			// set the data series in each of the vue apps, for the current region
			soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].app1
			soefinding.state.chart1.options.labels = this.findingContent[this.state.currentRegionName].app1labels
			soefinding.loadFindingHtml();
		}


	})