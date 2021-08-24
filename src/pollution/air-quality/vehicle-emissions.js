"use strict"


document.addEventListener("DOMContentLoaded", function () {


	// chart 1. pie, emissions
	const series = soefinding.findingJson.data.map(d => d["Tonnes per annum"])

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultPieChartOptions()
	// the pie charts uses labels, but the table vue is looking for categories
	options1.labels = options1.categories = soefinding.findingJson.data.map(d => d["Emission type"])
// 	options1.yaxis.title.text = "Kilometres travelled (billions)"
// 	options1.tooltip.y = {
// 		formatter: val => (val*1000000000).toLocaleString()
// 	}
// 	options1.yaxis.labels.formatter = function (val) {
// 		return val
// 	}

	soefinding.state.chart1 = {
		options: options1,
		series: series,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Proportion of annual average vehicle emissions by type in 2010` },

		},
		methods: {
			formatter1: function (val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "" }
		}
	})
})
