"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1, 5)

	// 1. stacked column, waste type yearly
	const wasteTypeSeries = soefinding.findingJson.data.map(d => {
		return {
			name: d["Waste type"],
			data: yearKeys.map(y => d[y])
		}
	})

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = yearKeys
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Tonnes (million)"
	options1.yaxis.labels.formatter = val => `${Math.round(val)}M`
	options1.tooltip.y = {
		formatter: val => `${(val * 1000000)?.toLocaleString() ?? "n/a"}`
	}

	soefinding.state.chart1 = {
		options: options1,
		series: wasteTypeSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Interstate household waste received, by waste type",
			heading2: () => "Trends in Queensland's net land use, land use change and forestry (LULUCF) emissions, by category",
			heading3: () => "Queensland’s total land use, land use change and forestry (LULUCF) emissions",
		},
		methods: {
			formatter1: val => val.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
		}
	})
})
