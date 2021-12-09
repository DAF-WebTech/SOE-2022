"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const current = ""

	soefinding.findingJson.forEach(d => {
		const name = d["Water quality report card"]

		if (name != current) {
			soefinding.findingContent[name] = {
				series: [
					{
						name: d["Identified pressure"],
						data: [d["Risk level"], d["Threat level"]]
					}
				]
			}
			current = name
		}
		else {
			soefinding.findingContent[name].series.push({
				name: d["Identified pressure"],
				data: [d["Risk level"], d["Threat level"]]
			})
		}
	})

	const options = {
		xaxis: {
			categories: soefinding.findingJson.meta.fields.slice(-3)
		}
	}

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series,
		options,
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Pressures identified in ${this.currentRegionName}` }
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})


	soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series


		soefinding.loadFindingHtml()
	}
})