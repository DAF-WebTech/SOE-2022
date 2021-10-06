"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(2)
	const latest = years.at(-1)

	const regions = new Map()
	const clearingTypes = new Set()

	// create a new qld object
	const qldArray = []
	for (let i = 0; i < 7; ++i) {
		const qldObj = {
			Bioregion: "Queensland",
			"Clearing type": soefinding.findingJson[i]["Clearing type"],
		}
		years.forEach(y => qldObj[y] = 0)

		qldArray.push(qldObj)

		clearingTypes.add(soefinding.findingJson[i]["Clearing type"])
	}

	soefinding.findingJson.data.forEach(d => {
		if (!regions.has(d.Bioregion))
			regions.set([d.Bioregion, d])
		else
			regions.get(d.Bioregion).push(d)

		const item = qldArray.find(q => q["Clearing type"] == d["Clearing type"])
		years.forEach(y => item[y] = + d[y])
	})
	regions.set(["Queensland", qldArray])

	// series 1 is the last year values, in a pie chart
	for (let [region, data] of regions) {
		soefinding.findingContent[region].series1 = data.map(d => d[latest])
	}

	const options1 = soefinding.getDefaultPieChartOptions()
	options1.labels = [...clearingTypes]
	options1.xaxis.categories = ["Clearing type", "Hectares"]

	soefinding.state.chart1 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		options1,
		chartactive: true,
	}






	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => {
				let retVal = "Proportion of replacement landcover (clearing type) in threatened fauna habitat"
				if (soefinding.state.currentRegionName != "Queensland")
					retVal += ` in the ${soefinding.state.currentRegionName}`
				retVal += `, ${latest.replace("-", "–")}` // en dash
				return retVal
			}
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})

})