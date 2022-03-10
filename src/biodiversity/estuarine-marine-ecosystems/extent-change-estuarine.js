"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const keys = soefinding.findingJson.meta.fields.slice(-3)

	const series1Items = soefinding.findingJson.data.filter(d => d.Indicator == "Area (ha)" && d["Drainage division"] != "Queensland")

	soefinding.findingContent.Queensland = {
		series1: [],
		series3: [],
		series5: []
	}

	series1Items.forEach(d => {
		if (d["Drainage division"] != "Other") {
			soefinding.findingContent[d["Drainage division"]] = {
				series2: [{
					name: "Area (ha)",
					data: keys.map(k => d[k])
				}]
			}
		}

		soefinding.findingContent.Queensland.series1.push({
			name: d["Drainage division"],
			data: keys.map(k => d[k])
		})

	})


	// first qld chart, extent by region
	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.chart.id = "chart1"
	options1.tooltip.y = {
		formatter: val => val.toLocaleString()
	}
	options1.xaxis.categories = keys
	options1.xaxis.title.text = "Estuarine wetland"
	options1.yaxis.title.text = "Hectares"
	options1.yaxis.labels.formatter = val => val >= 1000000 ? `${val / 1000000}M` : val >= 1000 ? `${val / 1000}K` : val


	soefinding.state.chart1 = {
		series: soefinding.findingContent.Queensland.series1,
		options: options1,
		chartactive: true
	}

	// first regional chart, extent for region
	const options2 = JSON.parse(JSON.stringify(options1))
	options2.chart.id = "chart2"
	delete options2.chart.stacked
	options2.yaxis.labels.formatter = options1.yaxis.labels.formatter
	options2.tooltip.y = options1.tooltip.y
	options2.xaxis.tickPlacement = "between"

	soefinding.state.chart2 = {
		series: soefinding.findingContent.Gulf.series2, // arbitrary default, will be overwritten by onRegionChange
		options: options2,
		chartactive: true
	}



	const series3Items = soefinding.findingJson.data.filter(d => d.Indicator == "Percent of pre-clear")

	series3Items.forEach(d => {
		if (d["Drainage division"] != "Other" && d["Drainage division"] != "Queensland") {
			soefinding.findingContent[d["Drainage division"]].series4 = [{
				name: "Percent	",
				data: keys.map(k => d[k])
			}]
		}


		soefinding.findingContent.Queensland.series3.push({
			name: d["Drainage division"],
			data: keys.map(k => d[k])
		})

	})

	// chart 3 is the second qld chart, percentages
	const options3 = soefinding.getDefaultColumnChartOptions()
	options3.chart.id = "chart3"
	options3.xaxis.categories = keys
	options3.xaxis.tickPlacement = "between"
	options3.xaxis.title.text = "Estuarine wetland"
	options3.yaxis.forceNiceScale = false
	options3.yaxis.labels.formatter = val => Math.round(val)
	options3.yaxis.max = 100
	options3.yaxis.title.text = "Percentage of pre-clear extent remaining (%)"

	soefinding.state.chart3 = {
		series: soefinding.findingContent.Queensland.series3,
		options: options3,
		chartactive: true
	}

	// chart 4 is the second region chart
	const options4 = soefinding.getDefaultColumnChartOptions()
	options4.chart.id = "chart4"
	options4.xaxis.categories = keys
	options4.xaxis.tickPlacement = "between"
	options4.xaxis.title.text = "Estuarine wetland"
	options4.yaxis.forceNiceScale = false
	options4.yaxis.labels.formatter = val => Math.round(val)
	options4.yaxis.max = 100
	options4.yaxis.title.text = "Percentage"


	soefinding.state.chart4 = {
		series: soefinding.findingContent.Gulf.series4, //arbitrary default, will be overwritten by onRegionChange
		options: options4,
		chartactive: true
	}


	// chart 5 is qld from the second dataset
	const series5json = JSON.parse(document.getElementById("jsonData2").textContent)
	const years = series5json.meta.fields.slice(2)
	let currRegion = ""

	series5json.data.filter(d => d["Drainage division"] != "Other").forEach(d => {
		if (d["Drainage division"] != currRegion) {
			soefinding.findingContent[d["Drainage division"]].series5 = [{
				name: d["Wetland system"],
				data: years.map(k => d[k])
			}]

			currRegion = d["Drainage division"]

		}
		else {
			soefinding.findingContent[d["Drainage division"]].series5.push({
				name: d["Wetland system"],
				data: years.map(k => d[k])
			})
		}

	})

	const options5 = soefinding.getDefaultLineChartOptions()
	options5.chart.id = "chart5"
	options5.xaxis.categories = years
	options5.xaxis.tickPlacement = "between"
	options5.xaxis.title.text = "Year"
	delete options5.yaxis.forceNiceScale
	options5.yaxis.labels.formatter = val => `${val < 0 ? '−' : ''}${Math.abs(val).toFixed(0)}`, // a better minus sign
		options5.yaxis.title.text = "Change in hectares of wetland system"

	soefinding.state.chart5 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series5,
		options: options5,
		chartactive: true
	}

	const YEAR = "TODO YEAR"

	window.vueApp = Vue.createApp({
		data() {
			return soefinding.state
		},
		components: myComponents,
		computed: {
			heading1: () => `Estuarine wetlands extent by region, ${YEAR}`,
			heading2() { return `Estuarine wetlands extent in ${this.currentRegionName}, ${YEAR}` },
			heading3: () => `Estuarine wetlands percentage of pre-clear extent remaining, ${YEAR}`,
			heading4() { return `Estuarine wetlands percentage of pre-clear extent remaining in ${this.currentRegionName}, ${YEAR}` },
			heading5: function () {
				let retVal = "Trends in change (loss or gain) in estuarine wetlands"
				if (this.currentRegionName != "Queensland")
					retVal += ` in ${this.currentRegionName}`
				return retVal
			}
		},
		methods: {
			formatter1: val => val.toLocaleString(),
			formatter2: val => val.toLocaleString(undefined, { minimumFractionDigits: 1 }),
			formatter5: val => soefinding.convertToUnicodeMinus(val.toFixed(2)),
			updateRegion(newRegionName) {
				this.currentRegionName = newRegionName
			}
		},
		watch: {
			currentRegionName(newRegionName) {
				if (newRegionName != "Queensland") {
					this.chart2.series = soefinding.findingContent[newRegionName].series2
					this.chart4.series = soefinding.findingContent[newRegionName].series4
				}
				else {
					// if you start on a region, and swap to qld
					// the apex charts can't draw the columns properly
					// so we manually force it to update
					this.chart1.options.series = soefinding.findingContent.Queensland.series1
					ApexCharts.exec("chart1", "updateOptions", this.chart1.options)
					this.chart3.options.series = this.findingContent.Queensland.series3
					ApexCharts.exec("chart3", "updateOptions", this.chart3.options)

				}

				this.chart5.series = soefinding.findingContent[newRegionName].series5

				if (newRegionName == "Gulf")
					this.chart5.options.yaxis.labels.formatter = val => soefinding.convertToUnicodeMinus(val.toFixed(2))
				else
					this.chart5.options.yaxis.labels.formatter = val => soefinding.convertToUnicodeMinus(val.toFixed(0))

			}
		}
	}).mount("#chartContainer")


})

