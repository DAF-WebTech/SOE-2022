"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(4)
	const latestYear = yearKeys[yearKeys.length - 1]

	// groupings
	const materials = {}
	const extents = { Australia: [], Queensland: [], }
	const sites = {}
	soefinding.findingJson.data.forEach(d => {
		if (!materials[d.Material])
			materials[d.Material] = []
		materials[d.Material].push(d)

		if (d.Extent == "Queensland")
			extents.Queensland.push(d)
		else
			extents.Australia.push(d)

		if (!sites[d.Site])
			sites[d.Site] = []
		sites[d.Site].push(d)
	})


	// 1. column chart, count by type
	const countAllSeries = Object.keys(extents).map(e => {
		return {
			name: e,
			data: extents[e].filter(d => d.Measure == "Count" && d.Site == "All" && d.Material != "Large items").map(d => Math.ceil(d[latestYear]))
		}
	})


	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = Object.keys(materials).filter(m => m != "Large items")
	options1.xaxis.title.text = "Litter Type"
	options1.yaxis.title.text = "Number of items per 100m²"

	soefinding.state.chart1 = {
		options: options1,
		series: countAllSeries,
		chartactive: true,
	};


	// 2. column chart, count by volume
	const volumeAllSeries = Object.keys(extents).map(e => {
		return {
			name: e,
			data: extents[e].filter(d => d.Measure == "Volume"/* && d.Site == "All"*/).map(d => d[latestYear])
		}
	})

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.xaxis.categories = Object.keys(materials)
	options2.yaxis.title.text = "Litres per 100m²"
	options2.yaxis.tickAmount = 4
	options2.yaxis.max = 2.0
	options2.yaxis.labels.formatter = val => val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })


	soefinding.state.chart2 = {
		options: options2,
		series: volumeAllSeries,
		chartactive: true,
	};


	//3 and 4. stacked column, litter count by type in Queensland and Australia
	const options3 = JSON.parse(JSON.stringify(options1))
	options3.chart.stacked = true
	options3.legend.inverseOrder = true
	options3.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
	options3.xaxis.title.text = "Year"
	options3.yaxis.labels.formatter = val => `${val.toFixed(0)}`
	options3.tooltip = { y: { formatter: val => val } }
	const options4 = JSON.parse(JSON.stringify(options3))
	options4.tooltip = options4.tooltip

	Object.keys(extents).forEach((e, i) => {
		const countAllItems = soefinding.findingJson.data.filter(d =>
			d.Extent == e
			&& d.Measure == "Count"
			&& d.Site == "All")
		countAllItems.sort(function (a, b) {
			return b[latestYear] - a[latestYear]
		})
		const countAllSeries = countAllItems.map(d => {
			return {
				name: d.Material,
				data: yearKeys.map(y => d[y])
			}
		})

		soefinding.state[i == 0 ? "chart3" : "chart4"] = {
			options: i == 0 ? options3 : options4,
			series: countAllSeries,
			chartactive: true,
		}
	})


	//5 and 6. stacked column, cigarette and non-cigarette count by type in Queensland and Australia
	const options5 = JSON.parse(JSON.stringify(options3))
	options5.xaxis.categories = Object.keys(sites)  // not large items
	options5.yaxis.labels.formatter = val => Math.round(val)
	options5.tooltip = { y: { formatter: (val, options) => (options.seriesIndex == 0 ? val : val.toFixed(1)) } }


	Object.keys(extents).forEach((e, i) => {
		const cigaretteItems = soefinding.findingJson.data.filter(d =>
			d.Extent == e
			&& d.Material == "Cigarettes"
			&& d.Measure == "Count"
		)
		const cigaretteSeries = [
			{
				name: "Cigarette",
				data: cigaretteItems.map(c => c[latestYear])
			}
		]
		const nonCigaretteItems = soefinding.findingJson.data.filter(d =>
			d.Extent == e
			&& d.Material != "Cigarettes"
			&& d.Measure == "Count"
		)

		cigaretteSeries.push({
			name: "Non-cigarette",
			data: Object.keys(sites).map(s => {
				return nonCigaretteItems.filter(nci => nci.Site == s).reduce(function (a, c) {
					return a + c[latestYear]
				}, 0)
			})
		})

		soefinding.state[`chart${i + 5}`] = {
			options: options5,
			series: cigaretteSeries,
			chartactive: true,
		}
	})


	//7. Litter type by site in qld
	const materialSiteQldItems = extents.Queensland.filter(d => d.Measure == "Count")
	const materialSiteQldSeries = []
	for (let material in materials) {
		if (material == "Large items") continue
		materialSiteQldSeries.push({
			name: material,
			data: materialSiteQldItems.filter(d => d.Material == material).map(d => d[latestYear])
		})
	}

	const options7 = JSON.parse(JSON.stringify(options5))
	options7.yaxis.labels.formatter = val => Math.round(val)
	options7.tooltip.y.formatter = function (val) {
		return val
	}

	soefinding.state.chart7 = {
		options: options7,
		series: materialSiteQldSeries,
		chartactive: true,
	}


	// charts 8–13, line chart for each material type in qld and aust
	const options8 = soefinding.getDefaultLineChartOptions()
	options8.xaxis.axisTicks = { show: false }
	options8.xaxis.categories = yearKeys.map(y => [y.slice(0, 4) + "–", y.slice(5)]) // ndash
	options8.xaxis.labels.rotateAlways = false
	options8.xaxis.tickPlacement = "between"
	options8.xaxis.title.text = "Year"
	options8.yaxis.title.text = "Number of items per 100m²"
	options8.yaxis.min = 0

	Object.keys(materials).forEach((m, i) => { // chart for each material
		if (m == "Large items") return

		const series = Object.keys(extents).map(e => {
			const item = extents[e].find(d => d.Material == m && d.Measure == "Count" && d.Site == "All")
			return {
				name: e,
				data: yearKeys.map(y => item[y])
			}
		})

		const myOptions = JSON.parse(JSON.stringify(options8))
		switch (m) {
			case "Cigarettes":
				myOptions.yaxis.max = 50
				break
			case "Glass":
				myOptions.yaxis.max = 2
				myOptions.yaxis.labels.formatter = val => Math.round(val)
				myOptions.tooltip = { y: { formatter: val => val } }
				break
			case "Metal":
			case "Paper":
			case "Plastic":
			case "Other":
				myOptions.yaxis.labels.formatter = val => Math.round(val)
				myOptions.tooltip = { y: { formatter: val => val } }
				break
		}

		soefinding.state[`chart${i + 8}`] = {
			options: myOptions,
			series: series,
			chartactive: true,
		}
	})



	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => `Litter items by type, ${latestYear.replace("-", "–")}`,
			heading2: () => `Volume of litter by type, ${latestYear.replace("-", "–")}`,
			heading3: () => "Average litter count by type in Queensland",
			heading4: () => "Average litter count by type in Australia",
			heading5: () => `Number of cigarette and non-cigarette litter items by site type in Queensland, ${latestYear.replace("-", "–")}`,
			heading6: () => `Number of cigarette and non-cigarette litter items by site type in Australia, ${latestYear.replace("-", "–")}`,
			heading7: () => `Litter type by site type in Queensland, ${latestYear.replace("-", "–")}`,
			heading8: () => `Cigarettes — Comparison of trends in litter count by Queensland and Australia`,
			heading9: () => `Glass — Comparison of trends in litter count by Queensland and Australia`,
			heading10: () => `Metal — Comparison of trends in litter count by Queensland and Australia`,
			heading11: () => `Paper — Comparison of trends in litter count by Queensland and Australia`,
			heading12: () => `Plastic — Comparison of trends in litter count by Queensland and Australia`,
			heading13: () => `Other material type — Comparison of trends in litter count by Queensland and Australia`,
		},
		methods: {
			formatter1: val => val,
			formatter2: val => val.toLocaleString(undefined, { minimumFractionDigits: 3 }),
			formatter3: val => val == null ? null : Number.isInteger(val) ? val : val.toLocaleString(undefined, { minimumFractionDigits: 1 }),
			onStackedRadioClick: function (chart) {
				chart.options.chart.type = "bar"
				chart.options.chart.stacked = true
			},
			onLineRadioClick: function (chart) {
				chart.options.chart.type = "line"
				chart.options.chart.stacked = false
				this.chart1.options.markers = { size: 4 } // ignored by column chart
				this.chart1.options.tooltip.shared = false
			}
		}
	}).mount("#chartContainer")
})
