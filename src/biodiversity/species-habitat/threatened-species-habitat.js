// used by fauna and flora

"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(3)
	const latestYear = yearKeys.at(-1)

	const regions = {}
	soefinding.findingJson.data.forEach(d => {
		if (!regions[d.Region])
			regions[d.Region] = []

		d.Remnant = d[latestYear]
		d["Non-remnant"] = d["Pre-clear"] - d.Remnant
		regions[d.Region].push(d)
	})

	const speciesNames = regions.Queensland.map(d => d.Group)

	const series1Keys = ["Pre-clear", "Remnant"]
	for (let region in regions) {
		soefinding.findingContent[region] = {
			series1: series1Keys.map(k => {
				return {
					name: k,
					data: regions[region].map(d => d[k])
				}
			})
		}
	}

	function justify(s) {
		const a = s.split(" ")
		const ret = [a.shift()]
		while (a.length > 0) {
			if (ret[ret.length - 1].length + a[0].length < 15)
				ret[ret.length - 1] += " " + a.shift()
			else
				ret.push(a.shift())
		}
		return ret
	}

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.chart.id = "chart1"
	options1.xaxis.categories = speciesNames.map(n => justify(n))
	options1.xaxis.title.text = `F${soefinding.biota.slice(1)} Group`
	options1.yaxis.title.text = "Hectares"
	options1.yaxis.labels.formatter = val => {
		if (val >= 1000000)
			return `${val / 1000000}M`
		else if (val >= 1000)
			return `${val / 1000}K`
		else
			return val
	}
	options1.tooltip.y = { formatter: val => `${val.toLocaleString()} ha` }

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		chartactive: true,
	}



	// chart 2  a stacked column percent chart
	const series2Keys = ["Remnant", "Non-remnant"]
	for (let region in regions) {
		soefinding.findingContent[region].series2 = series2Keys.map(k => {
			return {
				name: k,
				data: regions[region].map(d => d[k])
			}
		})
	}


	const options2 = soefinding.getPercentStackedBarChartOptions()
	options2.chart.id = "chart2"
	options2.xaxis.categories = speciesNames.map(n => justify(n))
	options2.xaxis.title.text = `F${soefinding.biota.slice(1)} Group`
	options2.yaxis.title.text = "Proportion"
	options2.tooltip.y = { formatter: val => `${val.toLocaleString()}  ha.` } //todo
	delete options2.yaxis.forceNiceScale

	soefinding.state.chart2 = {
		options: options2,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		chartactive: true,
	}

	// create the species items for checkbox list and series 3 data
	soefinding.state.species = {}
	speciesNames.forEach((s, i) => {
		soefinding.state.species[s] = {
			checked: i == 0,
			name: s,
			chart3active: true,
			chart4active: true,
			regions: {},
			nullSeries: false
		}
		for (let region in regions) {
			const item = regions[region].find(d => d.Group == s)
			soefinding.state.species[s].regions[region] = {
				isSeries3Null: false, // some have all 0 for data, so we show just the table if that happens
				series3: [{
					name: "Habitat",
					data: yearKeys.map(y => item[y])
				}]
			}
			if (soefinding.state.species[s].regions[region].series3[0].data.every(d => d == 0))
				soefinding.state.species[s].regions[region].isSeries3Null = true
		}
	})


	//options for chart 3 in the species list
	const options3 = soefinding.getDefaultLineChartOptions()
	options3.chart.id = "chart3"
	options3.xaxis.categories = yearKeys
	options3.xaxis.title.text = "Year"
	options3.yaxis.title.text = "Hectares"
	options3.yaxis.labels.formatter = options1.yaxis.labels.formatter
	options3.yaxis.showForNullSeries = false
	options3.tooltip.y = { formatter: options1.tooltip.y.formatter }
	soefinding.state.options3 = options3


	// chart 4 is a pie chart for qld only
	speciesNames.forEach(s => {
		soefinding.state.species[s].regions.Queensland.series4 = soefinding.findingJson.data
			.filter(d => d.Group == s && d.Region != "Queensland")
			.map(d => d["Pre-clear"])
		soefinding.state.species[s].regions.Queensland.series4Sum =
			soefinding.state.species[s].regions.Queensland.series4.reduce(function (acc, curr) { return acc + curr }, 0)
	})

	soefinding.state.options4 = soefinding.getDefaultPieChartOptions()
	soefinding.state.options4.labels = Object.keys(regions).slice(1)
	soefinding.state.options4.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} ha (${percent.toFixed(1)}%)`
			}
		}
	}
	soefinding.state.options4.xaxis.categories = ["Region", "Pre-clear (ha)"]

	soefinding.state.chart2.topleft = "" // hoping they don't want it `${soefinding.biota[0].toUpperCase()}${soefinding.biota.substring(1)} Group`
	soefinding.state.chart2.measure = "Hectares"

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Area of ${this.currentRegionName} pre-clear threatened ${soefinding.biota} habitat and ${latestYear} remnant habitat by species group` },
			heading2: function () { return `Proportion of ${this.currentRegionName} pre-clear threatened ${soefinding.biota} habitat that is remnant and non-remnant habitat, ${latestYear}` },
			heading4: function () { return `Proportion of pre-clear threatened ${this.currentSpecies} habitat by bioregion` }
		},
		methods: {
			formatter1: val => val.toLocaleString(),
			formatPercent: function (s, i, series) {
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(1)
			},
			seriesIndexSum: function (series, i) {
				var sum = series.reduce((acc, curr) => {
					return acc + curr.data[i]
				}, 0)
				return sum
			}
		}
	});


	window.soefinding.onRegionChange = function () {

		// set the data series in each of the vue apps, for the current region
		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series1
		ApexCharts.exec("chart1", "updateSeries", this.findingContent[this.state.currentRegionName].series1)

		soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2
		ApexCharts.exec("chart2", "updateSeries", this.findingContent[this.state.currentRegionName].series2)



		soefinding.loadFindingHtml();
	}


})