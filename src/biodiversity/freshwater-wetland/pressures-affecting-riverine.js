"use strict";

document.addEventListener("DOMContentLoaded", function () {

	let current = ""

	soefinding.findingJson.data.forEach(d => {

		if (d.Year == 2016) // only Reef has this and we want to leave them out
			return

		const name = d["Water quality report card"]

		if (name != current) {
			// if we haven't seen it yet, initialise with first data item
			soefinding.findingContent[name] = {
				series: [
					{
						name: d["Identified pressure"],
						data: [d["Risk level"], d["Threat level"]]
					}
				],
			}
			current = name
		}
		else {
			// add data item
			soefinding.findingContent[name].series.push({
				name: d["Identified pressure"],
				data: [d["Risk level"], d["Threat level"]]
			})
		}
	})

	// not all regions are in the data file, so initalise them
	soefinding.regionNames.forEach(r => {
		if (!soefinding.findingContent[r])
			soefinding.findingContent[r] = {
				series: null
			}
	})

	const options = {
		xaxis: {
			categories: soefinding.findingJson.meta.fields.slice(-2)
		}
	}

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series,
		options,
	}


	Vue.createApp({
		data() {
			return soefinding.state
		},
		components: myComponents,
		computed: {
			heading1: function () { return `Pressures identified in ${this.currentRegionName}` }
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? ""
		}
	}).mount("#chartContainer")


	soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series

		soefinding.loadFindingHtml()
	}
})