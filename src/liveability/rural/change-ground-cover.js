"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(2, soefinding.findingJson.meta.fields.length - 1)
	const latestYear = years.at(-2)


	const series1Items = soefinding.findingJson.data.filter(d => d.Region != "Queensland")

	const series1 = [
		{
			name: "Groundcover (%)",
			data: series1Items.map(d => d[latestYear]),
			type: "column"
		},
		{
			name: "All year mean",
			data: series1Items.map(d => d.AllYearMean),
			type: "line"
		}
	]

	const options1 = soefinding.getDefaultLineChartOptions()
	options1.stroke = {
		width: [0, 4]
	}
	options1.xaxis.categories = series1Items.map(d => d.Region)
	options1.xaxis.title.text = "Region"
	options1.tooltip.y = { formatter: val => val }
	options1.yaxis.forceNiceScale = false
	options1.yaxis.labels.formatter = val => Math.round(val)
	options1.yaxis.min = 0
	options1.yaxis.max = 100
	options1.yaxis.title.text = "Groundcover (%)"

	soefinding.state.chart1 = {
		series: series1,
		options: options1,
		chartactive: true,
	}


	soefinding.findingJson.data.forEach(d => {
		soefinding.findingContent[d.Region] = {
			series2: [
				{
					name: "Groundcover (%)",
					data: years.map(y => d[y])
				}
			]
		}
	})

	const options2 = soefinding.getDefaultLineChartOptions()
	options2.xaxis.categories = years
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Groundcover (%)"
	options2.yaxis.labels.formatter = val => Math.round(val)
	options2.tooltip.y = { formatter: val => val }
	options2.yaxis.min = 0
	options2.yaxis.max = 100
	options2.yaxis.forceNiceScale = false
	options2.xaxis.tickPlacement = "between"
	options2.xaxis.axisTicks = { show: false }

	soefinding.state.chart2 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		options: options2,
		chartactive: true,
	}


	window.vueApp = Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => `Mean late dry season ground cover (%), ${latestYear}`,
			heading2() {
				return `Mean late dry season ground cover (%) ${this.currentRegionName == "Queensland" ? "across" : "in"} ${this.currentRegionName}`
			}
		},
		methods: {
			formatter1: val => val.toFixed(1),
			updateRegion(newRegionName) {
				this.currentRegionName = newRegionName
			}
		},
		watch: {
			currentRegionName(newRegionName) {
				this.chart2.series = soefinding.findingContent[newRegionName].series2
			}
		}
	}).mount("#chartContainer")

})