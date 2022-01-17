"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. pie, proportion by state, latest year
	const allStates = soefinding.findingJson.data.filter(d => d.Category == "All")
	const allStatesSeries = allStates.map(d => d[latestYear])

	const options1 = soefinding.getDefaultPieChartOptions()
	// the pie charts uses labels, but the table vue is looking for categories
	options1.labels = allStates.map(d => d.State)
	options1.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
			}
		}
	}
	options1.xaxis.categories = ["Sector", "Emissions<br>(million tonnes)"] // not needed for chart, but vue uses them for table headings

	soefinding.state.chart1 = {
		options: options1,
		series: allStatesSeries,
		chartactive: true,
	};


	// 2. pie qld proportion of sectors, latest year
	const qldItems = soefinding.findingJson.data.filter(d => d.State == "Queensland" && d.Category != "All")
	const qldSeries = qldItems.map(d => d[latestYear])

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.labels = qldItems.map(d => d.Category)
	options2.tooltip.y.formatter = options1.tooltip.y.formatter

	soefinding.state.chart2 = {
		options: options2, // reüse
		series: qldSeries,
		chartactive: true,
	};


	// 3. stacked area chart, trend in each sector
	const qldTrendSeries = qldItems.map(d => {
		let name = d.Category
		if (name.indexOf("and") > -1)
			name = [name.substring(0, name.indexOf("and") - 1), name.substring(name.indexOf("and"))]
		else if (name.indexOf(" ") > -1)
			name = name.split(" ")
		return {
			name,
			data: yearKeys.map(y => d[y])
		}
	})
	qldTrendSeries.sort(function (a, b) {
		return b.data.at(-1) - a.data.at(-1)
	})


	const options3 = soefinding.getDefaultAreaChartOptions()
	options3.xaxis.categories = yearKeys
	options3.legend.inverseOrder = true
	options3.xaxis.title.text = "Year"
	options3.yaxis.title.text = "Tonnes"
	options3.stroke = { width: 1 }
	options3.yaxis.labels.formatter = val => `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}M`
	options3.tooltip.y = {
		formatter: val => `${(val * 1000000).toLocaleString()}`
	}

	soefinding.state.chart3 = {
		options: options3,
		series: qldTrendSeries,
		chartactive: true,
	};


	// 4 queensland totals table
	const qldTotalItem = allStates.find(d => d.State == "Queensland")
	const qldTotalSeries = [{
		name: "Tonnes",
		data: yearKeys.map(y => qldTotalItem[y])
	}]

	const options4 = soefinding.getDefaultLineChartOptions()
	options4.tooltip.y = {
		formatter: val => `${val}M`
	}
	options4.xaxis.categories = yearKeys
	options4.xaxis.labels.rotateAlways = true
	options4.xaxis.title.text = "Year"
	options4.yaxis.labels.formatter = val => `${Math.round(val)}M`
	options4.yaxis.title.text = "Tonnes"


	soefinding.state.chart4 = {
		options: options4,
		series: qldTotalSeries,
		chartactive: true
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of stationary energy emissions by state, ${latestYear}`,
			heading2: () => `Proportion of Queensland’s stationary energy emissions by category, ${latestYear}`,
			heading3: () => "Trends in Queensland’s stationary energy emissions, by category",
			heading4: () => "Queensland’s total stationary energy emissions"
		},
		methods: {
			formatter1: val => val.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
			formatPercent1: function (s, i, series) {
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(1)
			},
			formatPercent3: function (s, i, series) {
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(3)
			}


		}
	})
})
