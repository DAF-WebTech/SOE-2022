"use strict"
document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1, 12)
	const tableKeys = soefinding.findingJson.meta.fields.slice(-3)


	soefinding.findingContent.Queensland = {
		series1: [{
			name: "Queensland",
			data: yearKeys.map(y => 0)
		}],
		series2: [{
			name: "Queensland",
			data: tableKeys.map(y => 0)
		}],

	}

	soefinding.findingJson.data.forEach(d => {
		soefinding.findingContent[d.LGA] = {
			series1: [{
				name: d.LGA,
				data: yearKeys.map(y => d[y])
			}],
			series2: [{
				name: "Places",
				data: tableKeys.map(y => d[y])
			}],

		}

		yearKeys.map((y, i) => soefinding.findingContent.Queensland.series1[0].data[i] += d[y])
		tableKeys.map((y, i) => soefinding.findingContent.Queensland.series2[0].data[i] += d[y])

	})


	const options = soefinding.getDefaultColumnChartOptions()
	options.yaxis.title.text = "Number of places"
	options.xaxis.title.text = "Year"
	options.xaxis.categories = yearKeys
	options.tooltip.y = { formatter: val => val.toLocaleString() }
	options.yaxis.labels.formatter = val => val.toLocaleString()


	soefinding.state.chart1 = {
		options,
		series: soefinding.findingContent[soefinding.state.currentRegionName].series1,
		chartactive: true,
	}

	soefinding.state.chart2 = {
		options: { xaxis: { categories: tableKeys } },
		series: soefinding.findingContent[soefinding.state.currentRegionName].series2,
		chartactive: false,
	}


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => `Number of places on the heritage register in ${soefinding.state.currentRegionName}`,
			heading2: () => `Number of places entered, removed and merged from the heritage register in ${soefinding.state.currentRegionName}, 2011–2020`
		},
		methods: {
			formatter1: val => val,
		}
	}).mount("#chartContainer")




	window.soefinding.onRegionChange = function () {
		soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].series1
		soefinding.state.chart2.series = this.findingContent[this.state.currentRegionName].series2
		soefinding.loadFindingHtml();
	}

})