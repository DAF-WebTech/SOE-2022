"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(1);

	// chart 1. percentage change trends
	let percentSeries = soefinding.findingJson.data.filter(d => d["Emission type"] != "Volatile organic compounds")
	percentSeries = percentSeries.map(d => {
		return {
			name: d["Emission type"],
			data: soefinding.yearKeys.map(y => {
				
				return 100.0 / d[soefinding.yearKeys[0]] * d[y]
			})
		}
	})

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultLineChartOptions()
	options1.xaxis.categories = soefinding.yearKeys
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Percentage change"
	options1.yaxis.tickAmount = 4
	options1.yaxis.min = 0
	options1.yaxis.max = 400
	options1.tooltip.y = {
    	formatter: val => `${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}%`
    }
    options1.yaxis.labels.formatter = val =>  `${val}%`

    // create vue instance for first chart
	soefinding.state.chart1 = {
		options: options1,
		series: percentSeries,
		chartactive: true,
	};


	// chart 2, trends
	const trendSeries = soefinding.findingJson.data.map(d => {
		return {
			name: d["Emission type"],
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	const options2 = JSON.parse(JSON.stringify(options1))
	delete options2.yaxis.tickAmount 
	delete options2.yaxis.min 
	delete options2.yaxis.max
	options2.yaxis.title.text = "Tonnes per annum"
	options2.tooltip.y.formatter = val => val?.toLocaleString(undefined, { minimumFractionDigits: 3 }) ?? ""
	options2.yaxis.labels.formatter = val =>  `${val / 1000}k`
    

  
	// create the vue instance for second chart, 
	soefinding.state.chart2 = {
		options: options2,
		series: trendSeries,
		chartactive: true,
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Percentage change trends in major air pollutant emissions since 2010",
			heading2: () => "Trends in emissions for major air pollutants",
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? "",
			formatter2: val => val?.toLocaleString(undefined, { minimumFractionDigits: 1 }) ?? ""
		}
	});

})
