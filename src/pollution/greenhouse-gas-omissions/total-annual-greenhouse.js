"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	// chart 1. pie, Queensland proportion
	const qldSectors = soefinding.findingJson.data.filter(d => d.State == "Queensland" && d.Sector != "All (incl. LULUCF)")
	qldSectors.sort(function (a, b) {
		return b[latestYear] - a[latestYear]
	})
	const proportionSeries = qldSectors.map(d => d[latestYear])

	const options1 = soefinding.getDefaultPieChartOptions()
	// the pie charts uses labels, but the table vue is looking for categories
	options1.labels = qldSectors.map(d => d.Sector)
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
		series: proportionSeries,
		chartactive: true,
	};

	// 2. stacked columns, all states all sectors latest year
	const sectors = {}
	soefinding.findingJson.data.forEach(d => {
		if (d.Sector != "All" && d.Sector != "All (incl. LULUCF)") {
			if (!sectors[d.Sector])
				sectors[d.Sector] = []
			sectors[d.Sector].push(d)
		}
	})
	const sectorSeries = Object.keys(sectors).map(k => {
		return {
			name: k,
			data: sectors[k].map(d => d[latestYear])
		}
	})

	const options2 = soefinding.getDefaultBarChartOptions()
	options2.chart.stacked = true
	options2.xaxis.categories = ["Qld", "NSW", "Vic", "WA", "SA", "NT", "Tas", "ACT"]
	options2.xaxis.title.text = "State"
	options2.yaxis.title.text = "Tonnes"
	options2.yaxis.labels.formatter = val => `${Math.round(val)}M`
	options2.tooltip.y = {
		formatter: val => `${(val * 1000000).toLocaleString()}`
	}

	soefinding.state.chart2 = {
		options: options2,
		series: sectorSeries,
		chartactive: true,
	};


	//3. multi line, trend in qld sectors
	const qldTotal = soefinding.findingJson.data.find(d => d.State == "Queensland" && d.Sector == "All (incl. LULUCF)")
	qldSectors.unshift(qldTotal)
	const qldTrendSeries = qldSectors.map(d => {
		return {
			name: d.Sector,
			data: yearKeys.map(y => d[y])
		}
	})

	const options3 = soefinding.getDefaultLineChartOptions()
	options3.markers.size = 4
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


	//4. table only, qld totals
	const qldTotalSeries = [{
		name: "Tonnes",
		data: yearKeys.map(y => qldTotal[y])
	}]

	const options4 = JSON.parse(JSON.stringify(options3))
	options4.xaxis.categories = yearKeys
	options4.yaxis.labels.formatter = options3.yaxis.labels.formatter
	options4.yaxis.min = 0
	options4.xaxis.labels.rotateAlways = true



	soefinding.state.chart4 = {
		options: options4,
		series: qldTotalSeries,
		chartactive: true,
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of Queensland’s emissions by sector, ${latestYear}`,
			heading2: () => `Comparison of state and territory emissions by sector, ${latestYear}`,
			heading3: () => `Trends in Queensland emissions, by sector`,
			heading4: () => "Total Queensland emissions"
		},
		methods: {
			formatter1: val => val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
			formatPercent: function (s, i, series) {
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(1)
			}

		}
	})
})
