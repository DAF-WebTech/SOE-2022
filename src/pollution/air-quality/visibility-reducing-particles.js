"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(1);

	// chart 1. particles
	const particleSeries = soefinding.findingJson.data.map(d => {
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
    		return val;
        }
    }
    options1.yaxis.labels.formatter = function (val) {
    	return val
    }	


	soefinding.state.chart1 = {
		options: options1,
		series: particleSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Number of days when the 1-hour visibility-reducing particle concentrations exceed the Air EPP goal` },

		},
		methods: {
			formatter: function (val) { return (val ?? '').toLocaleString() }
		}
	})
})
