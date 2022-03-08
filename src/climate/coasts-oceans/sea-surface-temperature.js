"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const locations = ["Coral Sea", "Northern Tropics"]

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.forceNiceScale = false
	options1.xaxis.title.text = "Year"
	options1.xaxis.labels.rotateAlways = false
	options1.xaxis.labels.hideOverlappingLabels = true
	options1.yaxis.title.text = "Temperature change (degrees celsius)"
	options1.yaxis.tickAmount = 4
	options1.yaxis.min = -1
	options1.yaxis.max = 1
	options1.yaxis.labels.formatter = val => val < 0 ? `−${Math.abs(val).toFixed(1)}` : val.toFixed(1)
	options1.grid = { xaxis: { lines: { show: true } } }
	options1.tooltip.y = {
		formatter: val => val < 0 ? `−${Math.abs(val)}` : val
	}
	options1.xaxis.labels.formatter = (val) => val % 10 == 0 ? val : ""





	const options2 = JSON.parse(JSON.stringify(options1))
	options2.yaxis.tickAmount = 6
	options2.yaxis.min = -0.6
	options2.yaxis.max = 0.6
	options2.yaxis.labels.formatter = options1.yaxis.labels.formatter
	options2.tooltip.y.formatter = options1.tooltip.y.formatter
	options2.yaxis.forceNiceScale = false
	options2.xaxis.labels.formatter = options1.xaxis.labels.formatter

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

		options1.tooltip.x = { formatter: val => options1.xaxis.categories[val - 1] }
		options1.xaxis.tickAmount = options1.xaxis.categories.length


		soefinding.state[`chart${i * 2 + 1}`] = {
			options: options1,
			series: anomalySeries,
			chartactive: true,
		};

		//chart 2, column, Annual mean sea surface temperature 10-year rolling average
		const annualMeanItems = anomalyItems
		const annualMeanYears = []
		const annualMeanSeries = [{
			name: "Ten-year rolling average",
			data: annualMeanItems.map(d => {
				annualMeanYears.push(d.Year) // side effect
				return d["Ten year rolling average"]
			})
		}]

		options2.xaxis.categories = annualMeanYears

		options2.tooltip.x = { formatter: val => options2.xaxis.categories[val - 1] }
		options2.xaxis.tickAmount = options2.xaxis.categories.length

		soefinding.state[`chart${i * 2 + 2}`] = {
			options: options2,
			series: annualMeanSeries,
			chartactive: true,
		};

	})

	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
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
	}).mount("#chartContainer")
})
