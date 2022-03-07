"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const systems = ["Lacustrine", "Palustrine", "Riverine"]
	const series1Keys = soefinding.findingJson.meta.fields.slice(2, 8)
	const series2Keys = soefinding.findingJson.meta.fields.slice(-2)

	// group by region
	const regions = {}
	soefinding.findingJson.data.forEach(d => {
		if (! regions[d["State of the Environment Report drainage division"]])
			regions[d["State of the Environment Report drainage division"]] = []
		regions[d["State of the Environment Report drainage division"]].push(d)
	})

	// initialise series for queensland
	soefinding.findingContent.Queensland = {
		series1: systems.map(s => {
			return {
				name: s,
				data: series1Keys.map(k => 0)
			}
		}),
		series2: series2Keys.map(s => {
			return {
				name: s,
				data: systems.map(k => 0)
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
			}),
			series2: series2Keys.map((k, i) => {

				const retVal = {
					name: k,
					data: regions[r].map(d => d[k])
				}

				// side effect, populate qld values
				retVal.data.forEach((rv, j) => {
					soefinding.findingContent.Queensland.series2[i].data[j] += rv
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

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.tooltip.y = options1.tooltip.y
	options2.xaxis.categories = systems
	options2.xaxis.title.text = "Wetland System"
	options2.yaxis.labels.formatter = val => val >= 1000000 ? `${val/1000000}M` : val > 1000 ? `${val/1000}K` : val

	soefinding.state.chart2 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		options: options2,
		chartactive: true,
	}

	Vue.createApp({
		data() {
			return soefinding.state
		},
		components: myComponents,
		computed: {
			heading1: function() { 
				let retVal = "Extent of freshwater wetland systems in protected areas"
				if (this.currentRegionName != "Queensland")
					retVal += ` in ${this.currentRegionName}`
				retVal += ", 2024 (TODO fix year)"
				return retVal
			},
			heading2: function() { 
				let retVal = "Overall protection of freshwater wetland systems"
				if (this.currentRegionName != "Queensland")
					retVal += ` in ${this.currentRegionName}`
				retVal += ", 2024 (TODO fix year)"
				return retVal
			}

		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	}).mount("#chartContainer")


	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = soefinding.findingContent[soefinding.state.currentRegionName].series1
		soefinding.state.chart2.series = soefinding.findingContent[soefinding.state.currentRegionName].series2

		soefinding.loadFindingHtml()
	}
})