"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const region_key = 0
	const subregion_key = 1
	const product_key = 3
	const header = soefinding.findingJson.data.shift()
	const year_keys = [4, 5, 6]
	const years = year_keys.map(yk => header[yk])

	const year_keys_value = [8, 9, 10]
	const years_value = year_keys_value.map(yk => header[yk])


	// group by region and subregion
	soefinding.findingContent = {}
	soefinding.state.regionData = {}
	soefinding.findingJson.data.forEach(d => {

		if (d[subregion_key] == null) {
			d[subregion_key] = d[region_key]
		}

		if (!soefinding.state.regionData[d[region_key]]) {
			soefinding.state.regionData[d[region_key]] = {}
			soefinding.findingContent[d[region_key]] = { html: "" }
		}

		if (!soefinding.state.regionData[d[region_key]][d[subregion_key]]) {
			soefinding.state.regionData[d[region_key]][d[subregion_key]] = {
				data: [],
				chart1: [],
				chart2: {}
			}
		}

		// fix the data, replace n.p. with null
		d.forEach(function (item, i) {
			if (item == "n.p.")
				d[i] = null
			else if (String(item).indexOf("&") >= 0)
				d[i] = item.replace("&", "and")
		})

		if (d[product_key] != "Total")
			soefinding.state.regionData[d[region_key]][d[subregion_key]].data.push(d)
	})

	soefinding.state.columnChartOptions = soefinding.getDefaultColumnChartOptions()
	soefinding.state.columnChartOptions.xaxis.categories = years.map(k => k.replace("-", "–")) // ndash
	soefinding.state.columnChartOptions.xaxis.title.text = "Year"
	soefinding.state.columnChartOptions.yaxis.title.text = "Tonnes"
	soefinding.state.columnChartOptions.yaxis.labels.formatter = val => val >= 1000000 ? `${val / 1000000}M` : (val >= 1000 ? `${val / 1000}K` : val)
	soefinding.state.columnChartOptions.tooltip.y = { formatter: val => val.toLocaleString() }

	soefinding.state.lineChartOptions = soefinding.getDefaultLineChartOptions()
	soefinding.state.lineChartOptions.xaxis.categories = years_value.map(k => k.replace("-", "–")) // ndash
	soefinding.state.lineChartOptions.xaxis.title.text = "Year"
	soefinding.state.lineChartOptions.xaxis.tickPlacement = "between"
	soefinding.state.lineChartOptions.tooltip.y = {
		formatter: val => {
			if (val == null)
				return "n.p."
			else
				return `$${val.toLocaleString()}`
		}
	}
	soefinding.state.lineChartOptions.yaxis.title.text = "Value ($)"
	soefinding.state.lineChartOptions.yaxis.labels.minWidth = 30
	soefinding.state.lineChartOptions.yaxis.labels.formatter = val => {
		if (val >= 1000000000)
			return `${val / 1000000000}B`
		else if (val >= 1000000)
			return `${val / 1000000}M`
		else if (val >= 1000)
			return `${val / 1000}K`
		else
			return val
	}



	Object.keys(soefinding.state.regionData).forEach(function (regionName) {
		Object.keys(soefinding.state.regionData[regionName]).forEach(function (subregionName) {

			soefinding.state.regionData[regionName][subregionName].chart1 = soefinding.state.regionData[regionName][subregionName].data.map(d => {
				let heading = `Production amount of ${d[product_key]} in ${regionName} `
				if (regionName != "Queensland")
					heading += "NRM region"
				if (regionName != subregionName)
					heading += ` — ${subregionName}` // mdash

				const zeroSeries = year_keys.map(yk => d[yk]).every(val => val == 0)

				return { // column chart for each product
					productName: d[product_key],
					heading,
					series: [{ name: "Tonnes", data: year_keys.map(yk => d[yk]) }],
					chartactive: !zeroSeries,
					zeroSeries
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


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		el: "#chartContainer",
		data: soefinding.state,
	}).mount("#chartContainer")


	window.soefinding.onRegionChange = function () {
		soefinding.loadFindingHtml()
	}

})