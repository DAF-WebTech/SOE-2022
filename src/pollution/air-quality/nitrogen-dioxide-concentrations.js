"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(2);

	// chart 1. maximum 1 hour average
	const hourAverage = soefinding.findingJson.data.filter(d => {
		return d.Measure == "Annual maximum 1 hour average nitrogen dioxide concentrations"
	})
	const hourAverageSeries = hourAverage.map(d => {
		return {
			name: d.Airshed,
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = soefinding.yearKeys
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Parts per million"
	options1.yaxis.tickAmount = 10
	options1.yaxis.min = 0
	options1.yaxis.max = .1
    options1.tooltip.y = {
    	formatter: val => `${val} ppm`
    }
    options1.yaxis.labels.formatter = val =>  val.toFixed(2)

    // create vue instance for first chart
	soefinding.state.chart1 = {
		options: options1,
		series: hourAverageSeries,
		chartactive: true,
	};


	// chart 2, annual average
	const annualAverage = soefinding.findingJson.data.filter(d => {
		return d.Measure == "Annual average nitrogen dioxide concentrations"
	})
	const annualAverageSeries = annualAverage.map(d => {
		return {
			name: d.Airshed,
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.yaxis.max = .01
    options2.yaxis.labels.formatter = val => val.toFixed(3)
    	

	// create the vue instance for second chart, 
	soefinding.state.chart2 = {
		options: options2,
		series: annualAverageSeries,
		chartactive: true,
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Annual maximum 1–hour average nitrogen dioxide concentrations` },
			heading2: function () { return `Annual average nitrogen dioxide concentrations` },
		},
		methods: {
		    formatter1: function(val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 3 }) ?? "" },
		    formatter2: function(val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 4 }) ?? "" }
		}
	});

})
