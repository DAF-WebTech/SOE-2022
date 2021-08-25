"use strict"

document.addEventListener("DOMContentLoaded", function () {

  const yearKeys = soefinding.findingJson.meta.fields.slice(3)
  const latestYear = yearKeys[yearKeys.length-1]
  
  // group by vehicle type
  const vehicles = {}
  soefinding.findingJson.data.forEach(function(d) {
    if (!vehicles[d["Vehicle Type"]])
        vehicles[d["Vehicle Type"] = []
    vehicles[d["Vehicle Type"].push(d)    
  })
  
	// chart 1. proportion of registrations
	const series = data.map(d => {
    return d.sum(function(accumulator, currentValue) {
      return accumulator + currentValue[latestYear] 
    })
  })

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultPieChartOptions()
	// the pie charts uses labels, but the table vue is looking for categories
	options1.labels = Object.keys(vehicles)
	options1.tooltip = { y: { formatter: (val, options) => {
		const percent = options.globals.seriesPercent[options.seriesIndex][0]
		return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
	}}}
	options1.xaxis.categories = ["Vehicle type", "Registrations"] // not needed for chart, but vue uses them for table headings

	soefinding.state.chart1 = {
		options: options1,
		series: series,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of vehicle registrations in ${latestYear}`,
		},
		methods: {
			formatter1: val => val.toLocaleString() 
		}
	})
})
