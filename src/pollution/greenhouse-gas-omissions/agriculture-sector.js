"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. pie, proportion by state, latest year
	const allStates = soefinding.findingJson.data.filter(d => d.Category == "All")
	allStates.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})
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
	qldItems.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})
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
		return {
			name: d.Category,
			data: yearKeys.map(y => d[y])
		}
	})

	const options3 = soefinding.getDefaultLineChartOptions()
	options3.xaxis.categories = yearKeys
	options3.xaxis.title.text = "Year"
	options3.yaxis.title.text = "Tonnes"
	options3.yaxis.labels.formatter = val => `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}M`
	options3.tooltip.y = {
		formatter: val => `${(val * 1000000).toLocaleString()}`
	}

	soefinding.state.chart3 = {
		options: options3,
		series: qldTrendSeries,
		chartactive: true,
	};


	// 4. queensland totals table
	const qldTotalItem = soefinding.findingJson.data.find(d => d.State == "Queensland" && d.Category == "All")
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
	};


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => `Amount of agriculture emissions by state, ${latestYear}`,
			heading2: () => `Amount of Queensland’s agriculture emissions by category, ${latestYear}`,
			heading3: () => "Trends in Queensland’s agriculture emissions, by category",
			heading4: () => "Queensland’s total agriculture emissions"
		},
		methods: {
			formatter1: val => val.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }), //reüse for 2, 3
			formatPercent: function (s, i, series) {
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(2)
			}

		}
	}).mount("#chartContainer")
})
