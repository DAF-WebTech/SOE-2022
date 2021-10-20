"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const densityKeys = soefinding.findingJson.meta.fields.slice(2, 4)

	const series1Items = soefinding.findingJson.data.filter(d => d.Measure == "Dwelling density" && d["Regional Planning Area"] != "Queensland")
	const series1 = densityKeys.map(k => {
		return {
			name: k,
			data: series1Items.map(d => d[k])
		}
	})

	const options1 = soefinding.getDefaultColumnChartOptions()
	options1.xaxis.categories = series1Items.map(d => d["Regional Planning Area"])
	options1.xaxis.title.text = "Region planning area"
	options1.yaxis.title.text = "Dwellings/hectare"

	soefinding.state.chart1 = {
		series: series1,
		options: options1,
		chartactive: true,
	}



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Mean population-weighted dwelling density for Queensland",
			heading2: function() {
			},
			heading3: () => "",
			heading4: () => "",
		},
		methods: {
			formatter1: val => val.toLocaleString(),
		}
	})

	window.soefinding.onRegionChange = function () {


		soefinding.loadFindingHtml()
	})

})