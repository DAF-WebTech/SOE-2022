/*
soefinding.state.regionData = {
	regionName:  {
		subregionName: {
			chart1: [ 
				{ // column chart for each product
					productName: "",
					series: [],
					options: {},
					chartactive: true
				}
			], 
			chart2: {} // line chart for production values 
		},
		subregionName: {},
	},
	regionName: {
	}
}
*/

"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const region_key = 0
	const subregion_key = 1
	const quantity_key = 2
	const product_key = 3
	const header = soefinding.findingJson.data.shift()
	const year_keys = [4, 5, 6]
	const years = year_keys.map(yk => header[yk])

	const year_keys_value = [8, 9, 10]
	const years_value = year_keys_value.map(yk => header[yk])

	// group by region and subregion
	soefinding.findingContent = { Queensland: {} }
	soefinding.state.regionData = {}
	soefinding.findingJson.data.forEach(d => {

		// if it’s all nulls, then ignore it
		if (year_keys.map(yk => d[yk]).every(v => v == null))
			return;

		
		if (d[subregion_key] == null) {
			d[subregion_key] = d[region_key]
		}

		if (!soefinding.state.regionData[d[region_key]]) {
			soefinding.state.regionData[d[region_key]] = {}
			soefinding.findingContent[d[region_key]] = {html: ""}
		}

		if (!soefinding.state.regionData[d[region_key]][d[subregion_key]]) {
			soefinding.state.regionData[d[region_key]][d[subregion_key]] = { 
				data: [],
				chart1: [],
				chart2: {}
			}
		}

		// fix the data, replace n.p. with null
		d.forEach(function(item, i) { 
			if (String(item).indexOf("&") >= 0) 
				d[i] = item.replace("&", "and")
		})

		if (d[product_key] != "Total")
			soefinding.state.regionData[d[region_key]][d[subregion_key]].data.push(d)
	})

	const columnChartOptions = soefinding.getDefaultColumnChartOptions()
	columnChartOptions.xaxis.categories = years.map(k => k.replace("-", "–")) // ndash
	columnChartOptions.xaxis.title.text = "Year"
	columnChartOptions.yaxis.title.text = "Tonnes"
	columnChartOptions.yaxis.labels.formatter = val => val >= 1000000 ? `${val/1000000}M` : ( val >= 1000 ? `${val/1000}K`: val)
	columnChartOptions.tooltip.y = { formatter: val => val.toLocaleString() }

	soefinding.state.lineChartOptions = soefinding.getDefaultLineChartOptions()


	soefinding.state.lineChartOptions.xaxis.categories = years_value.map(k => k.replace("-", "–")) // ndash
	soefinding.state.lineChartOptions.legend.showForNullSeries = false 
	soefinding.state.lineChartOptions.yaxis.showForNullSeries = false
	soefinding.state.lineChartOptions.xaxis.title.text = "Year"
	soefinding.state.lineChartOptions.xaxis.tickPlacement = "between"
	soefinding.state.lineChartOptions.tooltip.y = { formatter: val => { 
		if (val == null)
			return "n/a"
		else
			return `$${val.toLocaleString(undefined, {minimumFractionDigits: 2})}` 
	}}
	soefinding.state.lineChartOptions.yaxis.title.text = "Value ($)"
	soefinding.state.lineChartOptions.yaxis.labels.minWidth = 30
	soefinding.state.lineChartOptions.yaxis.labels.formatter = val => {
		if (val >= 1000000000)
			return `${val/1000000000}B`
		else if (val >= 1000000)
			return `${val/1000000}M`
		else if (val >= 1000)
			return `${val/1000}K`
		else 
			return val
	}


	
	Object.keys(soefinding.state.regionData).forEach(function(regionName) {
		Object.keys(soefinding.state.regionData[regionName]).forEach(function(subregionName) {

			soefinding.state.regionData[regionName][subregionName].chart1 = soefinding.state.regionData[regionName][subregionName].data.map(d => {
				let heading = `Production amount of ${d[product_key]} in ${regionName} `
				if (regionName != "Queensland")
					 heading += "NRM region"
				if (regionName != subregionName)
					heading += ` — ${subregionName}` // mdash

				const zeroSeries = year_keys.reduce( function (acc, curr) {
							return acc + d[curr]
						}, 0) == 0

				const options = JSON.parse(JSON.stringify(columnChartOptions))
				options.yaxis.title.text = d[quantity_key]
				options .tooltip.y = columnChartOptions.tooltip.y
				options.yaxis.labels.formatter = columnChartOptions.yaxis.labels.formatter 

				return { // column chart for each product
						productName: d[product_key],
						heading,
						series: [{name: "Tonnes", data: year_keys.map(yk => d[yk])}],
						chartactive: !zeroSeries,
						zeroSeries,
						options
				}
			})

			// put together chart 2, one line chart per subregion
			let heading2 = `Production values in ${regionName} `
			if (regionName != "Queensland")
				heading2 += "NRM region"
			if (regionName != subregionName)
				heading2 += ` — ${subregionName}`  // mdash

			soefinding.state.regionData[regionName][subregionName].chart2 = {
				heading2, 
				series: soefinding.state.regionData[regionName][subregionName].data.map(d => {
					return {
						name: d[product_key],
						data: year_keys_value.map(ykv => d[ykv])
					}
				}),
				chartactive: true
			}
		})
	})


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		methods: {
			tableCellFormatter: val => {
				if (val == null)
					return "n/a"
				else if (val == 0)
					return "0"
				else
					return val.toLocaleString(undefined, {minimumFractionDigits: 2})
			}
		}

	})


	window.soefinding.onRegionChange = function () {
		soefinding.loadFindingHtml()
	}

})