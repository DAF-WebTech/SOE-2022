"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. column, average litter count by site type
	const extents = ["Australia", "Queensland"]
	const averageSeries = extents.map (e => {
		return {
			name: e, 
			data: soefinding.findingJson.data.filter(d => d.Extent == e).map(d => d[latestYear])
		}
	})

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.title.text = "Site type"
	options1.xaxis.categories = soefinding.findingJson.data.filter(d => d.Extent == "Queensland").map(d => d.Site.split(" "))
	options1.yaxis.title.text = "Number of items per 100m²"

	soefinding.state.chart1 = {
		options: options1,
		series: averageSeries,
		chartactive: true,
	};


  //2. column difference in percentage
  const sites = soefinding.findingJson.data.filter(d => d.Extent == "Queensland").map(d => d.Site)
  const percentSeries = [{ name: "Percentage", data: sites.map(s => {
  	  const extents = soefinding.findingJson.data.filter(d => d.Site == s)
  	  return Math.round(100.0 - (extents[0][latestYear] / extents[1][latestYear] * 100.0))
  })  }]

  const options2 = JSON.parse(JSON.stringify(options1))
  options2.yaxis.title.text = "Percentage difference in count (%)"
      options2.tooltip = {
		y: {
			formatter: function (val) {
				return `${val < 1 ? '−' : ''}${Math.abs(val)}%` // a better minus sign
			}
		}
	};


	soefinding.state.chart2 = {
		options: options2,
		series: percentSeries,
		chartactive: true,
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Average litter count by site type, ${latestYear.replace("-", "–")}`,
			heading2: () => `Percentage difference between Queensland and Australian counts by site type, ${latestYear.replace("-", "–")}`,
		},
		methods: {
			formatter1: val => val,
			formatter2: val => `${val < 1 ? '−' : ''}${Math.abs(val)}`, // a better minus sign
		}
	})
})
