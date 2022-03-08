"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1, 6)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. stacked column, waste type yearly
	const sectorItems = soefinding.findingJson.data.filter(d => d["Waste type"] !== "All")
	sectorItems.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})
	const wasteTypeSeries = sectorItems.map(d => {
		return {
			name: d["Waste type"],
			data: yearKeys.map(y => d[y])
		}
	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.markers = { size: 4 } // line chart only
	options1.tooltip.shared = false // line chart only
	options1.tooltip.y = {
		formatter: val => `${(val)?.toLocaleString() ?? "n/a"}`
	}
	options1.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
	options1.xaxis.title.text = "Year"
	options1.yaxis.forceNiceScale = false
	options1.yaxis.labels.formatter = val => `${(val / 1000000)}M`
	options1.yaxis.max = 1250000
	options1.yaxis.min = 0
	options1.yaxis.tickAmount = 5
	options1.yaxis.title.text = "Tonnes (million)"


	soefinding.state.chart1 = {
		options: options1,
		series: wasteTypeSeries,
		chartactive: true,
	};


	//2. line chart, total items by year
	const allItem = soefinding.findingJson.data.find(d => d["Waste type"] == "Municipal solid")
	const totalItemSeries = [{ name: "Tonnes", data: yearKeys.slice(1).map(y => allItem[y]) }]

	const options2 = soefinding.getDefaultLineChartOptions()
	options2.chart.stacked = true
	options2.xaxis.categories = yearKeys.slice(1).map(y => y.replace("-", "–")) // ndash
	options2.xaxis.title.text = "Year"
	options2.xaxis.tickPlacement = "between"
	options2.yaxis.title.text = "Tonnes"
	options2.yaxis.tickAmount = 7
	options2.yaxis.min = 40000
	options2.yaxis.max = 70000
	options2.yaxis.labels.formatter = val => `${(val.toLocaleString())}`
	options2.tooltip.y = {
		formatter: val => `${val}`
	}



	soefinding.state.chart2 = {
		options: options2,
		series: totalItemSeries,
		chartactive: true,
	};


	// 3. pie lastest other items
	sectorItems.sort(function (a, b) {
		return b["2018-19 Other"] - a["2018-19 Other"]
	})
	const latestOtherSeries = sectorItems.map(d => d["2018-19 Other"] ? d["2018-19 Other"] : 0)

	const options3 = soefinding.getDefaultPieChartOptions()
	// the pie charts uses labels, but the table vue is looking for categories
	options3.labels = sectorItems.map(d => d["Waste type"])
	options3.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
			}
		}
	}
	options3.xaxis.categories = ["Waste Type", "Tonnes"] // not needed for chart, but vue uses them for table headings

	soefinding.state.chart3 = {
		options: options3,
		series: latestOtherSeries,
		chartactive: true,
	};


	// 4 stacked columns, latest year, other and landfill
	const keys = ["2018-19 Received by Landfill", "2018-19 Other"]
	const latestOtherLandfillSeries = keys.map(k => {
		return {
			name: k.replace("-", "–").split(" "),  //ndash
			data: sectorItems.map(d => d[k])
		}
	})


	const options4 = soefinding.getDefaultBarChartOptions()
	options4.chart.stacked = true
	options4.xaxis.categories = sectorItems.map(d => d["Waste type"].split(" "))
	options4.xaxis.title.text = "Type of interstate household waste received"
	options4.yaxis.title.text = "Tonnes (million)"
	options4.yaxis.labels.formatter = val => val == 0 ? 0 : (val >= 100000 ? `${(val / 1000000).toFixed(1)}m` : `${(val / 1000)}k`)
	options4.tooltip.y = {
		formatter: val => `${(val)?.toLocaleString() ?? "n/a"}`
	}
	delete options4.xaxis.tickPlacement


	soefinding.state.chart4 = {
		options: options4,
		series: latestOtherLandfillSeries,
		chartactive: true,
	};



	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => "Interstate household waste received, by waste type",
			heading2: () => "Trend in total interstate household waste received",
			heading3: () => "Proportion of interstate household waste received, 2018–19 Other",
			heading4: () => "Interstate household waste received by landfill and other, 2018–2019"
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? "",
			formatter2: val => val?.toLocaleString() ?? 0,
			onStackedRadioClick: function () {
				this.chart1.options.chart.type = "bar"
				this.chart1.options.chart.stacked = true
			},
			onLineRadioClick: function () {
				this.chart1.options.chart.type = "line"
				this.chart1.options.chart.stacked = false
				this.chart1.options.markers = { size: 4 } // ignored by column chart
				this.chart1.options.tooltip.shared = false
			},
			formatPercent: function (s, i, series) {
				if (s == 0) return 0
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(1)
			},
		}
	}).mount("#chartContainer")

})
