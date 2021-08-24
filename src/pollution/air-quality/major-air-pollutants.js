"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(1);

	// chart 1. percentage change trends
	const percentSeries = soefinding.findingJson.data.map(d => {
		return {
			name: d["Emission type"],
			data: soefinding.yearKeys.map(y => {
				return 100.0 / d[yearKeys[0]] * d[y]
			})
		}
	})
	percentSeries = percentSeries.sort(function(a, b) {
		return b.data[yearKeys.length-1] - a.data[yearKeys.length-1]
	}

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultLineChartOptions()
	options1.xaxis.categories = soefinding.yearKeys
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Percentage change"

	options1.tooltip.y = {
    	formatter: val => `${val.ToFixed(7)}`
    }
    options1.yaxis.labels.formatter = val =>  `${Math.round(val)}%`

    // create vue instance for first chart
	soefinding.state.chart1 = {
		options: options1,
		series: percentSeries,
		chartactive: true,
	};


	// chart 2, trends
	const data = soefinding.findingJson.data.sort(function(a, b) {
		return b["2019"] - a["2019"]
	}
	const trendSeries = data.map(d => {
		return {
			name: d["Emission type"],
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.yaxis.title.text = "Tonnes per annum"

  
	// create the vue instance for second chart, 
	soefinding.state.chart2 = {
		options: options1,
		series: trendSeries,
		chartactive: true,
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Percentage change trends in major air pollutant emissions since 2010",
			heading2: () => "Trends in emissions for major air pollutants",
		}
	});

})
