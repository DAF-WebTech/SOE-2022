"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(2)

	soefinding.findingContent.Queensland

	const series1Keys = ["Total Nitrogen (tonne)", "Total Phosphorus (tonne)"]
	const series1 = series1Keys.map(k => {
		return {
			name: k,
			data: years.map(y => soefinding.findingJson.data.filter(d => d.Variable == k).reduce((acc, curr) => {
				return acc + curr[y]
			}, 0))
		}
	})
	soefinding.findingContent.Queensland = { series1 }

	const regions = ["South East Queensland", "Great Barrier Reef"]
	regions.forEach(r => {
		const series1Items = soefinding.findingJson.data.filter(d => d.Region == r && d.Variable != "Annual volume (GL)")
		const regionSeries1 = series1Items.map(d => {
			return {
				name: d.Variable,
				data: years.map(y => d[y])
			}
		})
		soefinding.findingContent[r] = { series1: regionSeries1 }
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.chart.id = "chart1"
	options1.xaxis.categories = years
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Load (tonnes)"
	options1.yaxis.labels.formatter = val => val.toLocaleString()


	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		chartactive: true,
	}


	soefinding.findingContent.Queensland.series2 = []
	regions.forEach(r => {

		const series2Item = soefinding.findingJson.data.find(d => d.Region == r && d.Variable == "Annual volume (GL)")
		const item = {
			name: r,
			data: years.map(y => series2Item[y])
		}

		soefinding.findingContent.Queensland.series2.push(item)

		soefinding.findingContent[r].series2 = [item]
	})

	const options2 = soefinding.getDefaultLineChartOptions()
	options2.chart.id = "chart2"
	options2.xaxis.categories = years
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Annual Volume (gigalitres)"


	soefinding.state.chart2 = {
		options: options2,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		chartactive: true,
	}



	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: function () {
				let retVal = "Treated sewage total nitrogen and phosphorous"
				if (this.currentRegionName == "Queensland")
					retVal += " (for SEQ and GBR)"
				else
					retVal += " in " + this.currentRegionName
				return retVal
			},
			heading2: function () {
				let retVal = "Trends in sewage load"
				if (this.currentRegionName == "Queensland")
					retVal += " volumes, by region"
				else
					retVal += " volume in " + this.currentRegionName
				return retVal
			}
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	}).mount("#chartContainer")


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region

		// chart 1
		ApexCharts.exec("chart1", "updateSeries", this.findingContent[this.state.currentRegionName].series1)
		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series1

		// chart 1
		ApexCharts.exec("chart2", "updateSeries", this.findingContent[this.state.currentRegionName].series2)
		soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2


		soefinding.loadFindingHtml()
	}
})