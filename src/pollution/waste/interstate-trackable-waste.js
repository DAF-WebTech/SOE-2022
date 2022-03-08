"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	//1. totals for each year
	const totals = soefinding.findingJson.data.find(d => d["Waste description"] == "Total")

	const totalSeries = [{
		name: `Total`,
		data: yearKeys.map(y => totals[y])
	}]

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
	options1.xaxis.tickPlacement = "between"
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Tonnes"
	options1.yaxis.labels.formatter = val => {
		return `${val / 1000}K`
	}
	options1.tooltip.y = {
		formatter: val => val.toLocaleString()
	}

	// create vue instance for first chart
	soefinding.state.chart1 = {
		options: options1,
		series: totalSeries,
		chartactive: true,
	};


	// 2. latest year each waste type
	const wasteTypes = {}
	soefinding.findingJson.data.forEach(d => {
		if (d["Waste description"] == "Total")
			return
		if (!wasteTypes[d["Waste description"]])
			wasteTypes[d["Waste description"]] = []
		wasteTypes[d["Waste description"]].push(d)
	})

	const wasteTotalItems = Object.keys(wasteTypes).map(k => {
		return {
			name: k,
			value: wasteTypes[k].reduce(function (acc, val) {
				return acc + val[latestYear]
			}, 0)
		}
	})
	wasteTotalItems.sort(function (a, b) {
		return b.value - a.value
	})
	const wasteSeries = wasteTotalItems.map(d => d.value)

	const options2 = soefinding.getDefaultPieChartOptions()
	options2.colors = options2.colors.concat(["#33b2df", "#546E7A", "#d4526e", "#13d8aa", "#A5978B"])
	options2.xaxis.categories = ["Waste description", latestYear.replace("-", "–")] //ndash
	options2.labels = wasteTotalItems.map(d => d.name)
	options2.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
			}
		}
	}

	soefinding.state.chart2 = {
		options: options2,
		series: wasteSeries,
		chartactive: true,
	};


	//3. pie chart, tonnes from each state
	const states = {}
	soefinding.findingJson.data.forEach(d => {
		if (d.State == "All")
			return
		if (!states[d.State])
			states[d.State] = []
		states[d.State].push(d)
	})

	const stateTotalItems = Object.keys(states).map(k => {
		return {
			name: k,
			value: states[k].reduce(function (acc, val) {
				return acc + val[latestYear]
			}, 0)
		}
	})
	stateTotalItems.sort(function (a, b) {
		return b.value - a.value
	})
	const stateTotalSeries = stateTotalItems.map(d => d.value)

	const options3 = JSON.parse(JSON.stringify(options2))
	options3.xaxis.categories[0] = "State"
	options3.labels = stateTotalItems.map(d => d.name)
	options3.tooltip.y.formatter = (val, options) => {
		const percent = options.globals.seriesPercent[options.seriesIndex][0]
		return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
	}

	soefinding.state.chart3 = {
		options: options3,
		series: stateTotalSeries,
		chartactive: true,
	};

	// 4. stacked column, every state and waste type in the latest year
	const stateTypeSeries = Object.keys(states).map(k => {
		return {
			name: k,
			data: states[k].map(d => d[latestYear])
		}
	})
	stateTypeSeries.sort(function (a, b) {
		return b.data.reduce((a, c) => a + c) - a.data.reduce((a, c) => a + c)
	})

	const options4 = soefinding.getDefaultBarChartOptions()
	options4.chart.stacked = true
	options4.tooltip.y = { formatter: val => val.toLocaleString() }
	options4.xaxis.categories = Object.keys(wasteTypes) // ignored but table needs it
	options4.xaxis.labels.formatter = val => val >= 1000 ? `${val / 1000}K` : val
	options4.plotOptions = {
		bar: {
			horizontal: true
		}
	}
	options4.xaxis.tickPlacement = "between"
	options4.xaxis.title.text = "Tonnes"
	options4.yaxis.labels.maxWidth = 400
	options4.yaxis.title.text = "Waste description"

	soefinding.state.chart4 = {
		options: options4,
		series: stateTypeSeries,
		chartactive: true,
	};


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => "Trackable waste received from interstate",
			heading2: () => `Proportion of trackable waste received from interstate by waste type, ${latestYear.replace("-", "–")}`,
			heading3: () => "Proportion of trackable waste received from interstate by state, 2018–2019",
			heading4: () => `Trackable waste received from interstate by state and waste type, ${latestYear.replace("-", "–")}`
		},
		methods: {
			formatter1: val => val.toLocaleString(),
			formatPercent2: function (s, i, series) {
				if (s == 0) return 0
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(2)
			},
			formatPercent3: function (s, i, series) {
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(3)
			},
		}
	}).mount("#chartContainer")

})
