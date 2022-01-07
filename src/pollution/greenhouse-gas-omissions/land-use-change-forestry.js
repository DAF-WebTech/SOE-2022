"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. bar chart each state total
	const stateTotals = soefinding.findingJson.data.filter(d => d.Sector == "All")
	const stateComparisonSeries = [{ data: stateTotals.map(d => d[latestYear]) }]


	const options1 = soefinding.getDefaultBarChartOptions()
	options1.forceNiceScale = false
	options1.tooltip.y = { formatter: val => `${(val * 1000000).toLocaleString()}` }
	options1.xaxis.categories = ["Queensland", ["New South", "Wales"], "Victoria", ["Western", "Australia"], ["South", "Australia"], ["Northern", "Territory"], "Tasmania", ["Australian", "Capital", "Territory"]]
	options1.xaxis.title.text = "State"
	options1.yaxis.labels.formatter = val => `${Math.round(val)}M`
	options1.yaxis.max = 30
	options1.yaxis.min = -20
	options1.yaxis.tickAmount = 6
	options1.yaxis.title.text = "Tonnes of carbon dioxide equivalent"

	soefinding.state.chart1 = {
		options: options1,
		series: stateComparisonSeries,
		chartactive: true,
	};


	//2. qld sectors
	const qldItems = soefinding.findingJson.data.filter(d => d.State == "Queensland" && d.Sector != "All")
	const stateSectorSeries = qldItems.map(d => {
		return {
			name: d.Sector,
			data: yearKeys.map(y => d[y])
		}
	})
	stateSectorSeries.sort(function (a, b) {
		return b.data[b.data.length - 1] - a.data[a.data.length - 1]
	})


	const options2 = soefinding.getDefaultAreaChartOptions()
	delete options2.forceNiceScale
	options2.stroke = { width: 2 }
	options2.xaxis.categories = yearKeys
	options2.xaxis.title.text = "Year"
	options2.yaxis.title.text = "Tonnes of carbon dioxide equivalent (million)"
	options2.yaxis.labels.formatter = val => `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}M`
	options2.tooltip.y = {
		formatter: val => `${(val * 1000000).toLocaleString()}`
	}


	soefinding.state.chart2 = {
		options: options2,
		series: stateSectorSeries,
		chartactive: true,
	};


	// 3. table only, qld yearly totals
	const qldTotalItem = soefinding.findingJson.data.find(d => d.State == "Queensland" && d.Sector == "All")
	const qldTotalSeries = [{
		name: "Tonnes",
		data: yearKeys.map(y => qldTotalItem[y])
	}]

	const options3 = soefinding.getDefaultLineChartOptions()
	options3.tooltip.y = {
		formatter: val => `${val}M`
	}
	options3.xaxis.categories = yearKeys
	options3.xaxis.labels.rotateAlways = true
	options3.xaxis.title.text = "Year"
	options3.yaxis.labels.formatter = val => `${Math.round(val)}M`
	options3.yaxis.title.text = "Tonnes"

	soefinding.state.chart3 = {
		options: options3,
		series: qldTotalSeries,
		chartactive: true
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Comparison of state and territory land use, land use change and forestry (LULUCF) emissions, ${latestYear}`,
			heading2: () => "Trends in Queensland's net land use, land use change and forestry (LULUCF) emissions, by category",
			heading3: () => "Queensland’s total land use, land use change and forestry (LULUCF) emissions",
		},
		methods: {
			formatter1: val => val.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
		}
	})
})
