"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const locations = ["Coral Sea", "Northern Tropics"]
	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Temperature change (degrees celsius)"
	const options2 = JSON.parse(JSON.stringify(options1))

	locations.forEach((loc, i) => {

		// chart 1, column, Annual mean sea surface temperature anomaly
		const anomalyItems = soefinding.findingJson.data.filter(d => d.Location == loc)
		const anomalyYears = []
		const anomalySeries = {
			name: "Temperature anomaly",
			series: anomalyItems.map(d => {
				anomalyYears.push(d.Year) // side effect
				return d["Annual sea surface temperature anomaly"]
			})
		}

		options1.xaxis.categories = anomalyYears

		soefinding.state[`chart${i + 1}`] = {
			options: options1,
			series: anomalySeries,
			chartactive: true,
		};


		// chart 2, column, Annual mean sea surface temperature 10-year rolling average
		const annualMeanItems = anomalyItems.filter(d => d["Ten year rolling average"] != null)
		const annualMeanYears = []
		const annualMeanSeries = {
			name: "Ten-year rolling average",
			series: annualMeanItems.map(d => {
				annualMeanYears.push(d.Year) // side effect
				return d["Ten year rolling average"]
			})
		}

		options2.xaxis.categories = annualMeanYears

		soefinding.state[`chart${i + 1}`] = {
			options: options2,
			series: annualMeanSeries,
			chartactive: true,
		};

	})

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `${locations[0]} — Annual mean sea surface temperature anomaly` },
			heading2: function () { return `${locations[0]} — Annual mean sea surface temperature 10-year rolling average` },
			heading3: function () { return `${locations[1]} — Annual mean sea surface temperature anomaly` },
			heading4: function () { return `${locations[1]} — Annual mean sea surface temperature 10-year rolling average` },
		},
		methods: {
			formatter1: val => val
		}
	});
})
