"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(1);

	// chart 1. carbon monoxide
	const coSeries = soefinding.findingJson.data.map(d => {
		return {
			name: d.Airshed,
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = soefinding.yearKeys
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number of days"
	options1.tooltip.y = {
		formatter: function (val) {
			return `${val} days`;
	    }
	}
	options1.yaxis.labels.formatter = function (val) {
		return val
	}


	soefinding.state.chart1 = {
		options: options1,
		series: coSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Annual maximum 8-hour average carbon monoxide concentrations` },

		},
		methods: {
			formatter1: function (val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? "" }
		}
	});
})
