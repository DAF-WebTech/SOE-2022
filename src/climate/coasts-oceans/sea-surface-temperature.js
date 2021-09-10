"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const locations = ["Coral Sea", "Northern Tropics"]

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Temperature change (degrees celsius)"
	options1.yaxis.tickAmount = 4
	options1.yaxis.min = -1
	options1.yaxis.max = 1
	options1.yaxis.labels.formatter = val => val < 0 ? `−${Math.abs(val).toFixed(1)}` : val.toFixed(1)
	options1.tooltip.y = {
		formatter: val => val < 0 ? `−${Math.abs(val)}` : val
	}

	const options2 = JSON.parse(JSON.stringify(options1))
	//options2.forceNiceScale = false
	options2.yaxis.tickAmount = 6
	options2.yaxis.min = -0.6
	options2.yaxis.max = 0.6
	options2.yaxis.labels.formatter = options1.yaxis.labels.formatter
	options2.tooltip.y.formatter = options1.tooltip.y.formatter

	locations.forEach((loc, i) => {

		// chart 1, column, Annual mean sea surface temperature anomaly
		const anomalyItems = soefinding.findingJson.data.filter(d => d.Location == loc)
		const anomalyYears = []
		const anomalySeries = [{
			name: "Temperature anomaly",
			data: anomalyItems.map(d => {
				anomalyYears.push(d.Year) // side effect
				return d["Annual sea surface temperature anomaly"]
			})
		}]

		options1.xaxis.categories = anomalyYears

		soefinding.state[`chart${i * 2 + 1}`] = {
			options: options1,
			series: anomalySeries,
			chartactive: true,
		};

		//chart 2, column, Annual mean sea surface temperature 10-year rolling average
		const annualMeanItems = anomalyItems.filter(d => d["Ten year rolling average"] != null)
		const annualMeanYears = []
		const annualMeanSeries = [{
			name: "Ten-year rolling average",
			data: annualMeanItems.map(d => {
				annualMeanYears.push(d.Year) // side effect
				return d["Ten year rolling average"]
			})
		}]

		options2.xaxis.categories = annualMeanYears

		soefinding.state[`chart${i * 2 + 2}`] = {
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
			formatter1: val => val < 0 ? `−${Math.abs(val).toFixed(2)}` : val.toFixed(2),
			formatter2: val => val < 0 ? `−${Math.abs(val).toFixed(3)}` : val.toFixed(3)
		}
	});
})
