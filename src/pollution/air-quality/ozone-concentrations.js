"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(2);

	// chart 1. Exceedences
	const exceedences = soefinding.findingJson.data.filter(d => {
		return d.Measure == "Exceedence"
	})
	const exceedenceSeries = exceedences.map(d => {
		return {
			name: d.Airshed,
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = soefinding.yearKeys
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number of Days"
	options1.yaxis.tickAmount = 3
	options1.yaxis.min = 0
	options1.yaxis.max = 3
    options1.tooltip.y = {
    	formatter: function (val) {
    		return `${val} day${val > 1 ? "s" : ""}`;
        }
    }
    options1.yaxis.labels.formatter = function (val) {
    	return val
    }	

	soefinding.state.chart1 = {
		options: options1,
		series: exceedenceSeries,
		chartactive: true,
	};


	// chart 2, concentrations
	const concentrations = soefinding.findingJson.data.filter(d => {
		return d.Measure == "Concentration"
	})
	const concentrationSeries = concentrations.map(d => {
		return {
			name: d.Airshed,
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	// create the vue instance for first chart, our column chart
	const options2 = soefinding.getDefaultBarChartOptions()
	options2.xaxis.categories = soefinding.yearKeys
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Parts per million"
	options2.yaxis.max = 0.12
	options2.yaxis.min = 0
	options2.yaxis.tickAmount = 6
	options2.yaxis.labels.formatter = val => val.toFixed(2)
  options2.tooltip.y = { formatter: val=> `${val} ppm` }
        
    

	soefinding.state.chart2 = {
		options: options2,
		series: concentrationSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Number of days when the 1-hour ozone concentrations exceed the Air NEPM standards` },
			heading2: function () { return `Annual maximum 1-hour average ozone concentrations` },
		},
		methods: {
		    formatter1: function(val) { return val },
		    formatter2: function(val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 3 }) ?? "" }
		}
	});

})
