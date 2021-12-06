"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const systems = ["Lacustrine", "Palustrine", "Riverine"]
	const series1Keys = soefinding.findingJson.meta.fields.slice(2, 8)

	// group by region
	const regions = {}
	soefinding.findingJson.data.forEach(d => {
		if (! regions[d["State of the Environment Report drainage division"]])
			regions[d["State of the Environment Report drainage division"]] = []
		regions[d["State of the Environment Report drainage division"]].push(d)
	})

	// initialise series 1 for queensland
	soefinding.findingContent.Queensland = {
		series1: systems.map(s => {
			return {
				name: s,
				data: series1Keys.map(k => 0)
			}
		})
	}

	// iterate regions and make a series1 for them
	for (let r in regions) {
		soefinding.findingContent[r] = { 
			series1: regions[r].map((d, i) => {

				const retVal = {
					name: d["Wetland system"],
					data: series1Keys.map(k => d[k])
				}

				// side effect, populate qld values
				soefinding.findingContent.Queensland.series1[i].data.forEach( function(x, j) {
					soefinding.findingContent.Queensland.series1[i].data[j] += d[series1Keys[j]]
				})

				return retVal
			})
		}
	}

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.tooltip.y = { formatter: val => val.toLocaleString() } 
	options1.xaxis.categories = [ /*there's no easy way to automatically break these down so do it manually*/
		"Nature refuge", 
		["National park", "(scientific)"],
		"National park",
		["National park", "(Cape York", "Aboriginal land)"],
		"Conservation park",
		"Resources reserve"
	]
	delete options1.xaxis.tickPlacement
	options1.xaxis.title.text = "Protected area type"
	options1.yaxis.labels.formatter = val => `${val/1000}K`
	options1.yaxis.title.text = "Hectares"


	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		options: options1,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function() { return `Proportion of freshwater wetland systems in protected areas in ${this.currentRegionName}, 2024`}
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})


	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series1

		soefinding.loadFindingHtml()
	}
})