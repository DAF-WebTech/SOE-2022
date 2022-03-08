"use strict"
document.addEventListener("DOMContentLoaded", function () {


	const keys = soefinding.findingJson.meta.fields.slice(2)
	const localPlaces = []
	const series2 = []
	let currentLga = ""
	soefinding.findingContent.Queensland = { series3: null }


	//iterate the data and group them in to each series
	soefinding.findingJson.data.forEach(d => {
		// if it has a value in the last column, it goes into the qld pie chart
		if (d[keys[2]] > 0)
			localPlaces.push(d)

		// all items go into qld table, we concatenate lga name and first key
		let name = d.LGA
		if (d["Planning scheme"])
			name += ` (${d["Planning scheme"]})`
		series2.push({
			name,
			data: keys.map(k => d[k])
		})


		if (currentLga != d.LGA) {
			// first time seeing this LGA
			soefinding.findingContent[d.LGA] = {
				series3: [{
					name: d["Planning scheme"],
					data: keys.map(k => d[k])
				}]
			}
		}
		else {
			// saw this lga previously
			soefinding.findingContent[d.LGA].series3.push({
				name: d["Planning scheme"],
				data: keys.map(k => d[k])
			})
		}

		currentLga = d.LGA

	})


	// fix the qld series
	localPlaces.sort(function (a, b) {
		return b[keys[2]] - a[keys[2]]
	})
	const series1 = localPlaces.map(p => p[keys[2]])

	series2.sort(function (a, b) {
		return b.data[0] - a.data[0]
	})



	const options1 = soefinding.getDefaultPieChartOptions()
	options1.labels = localPlaces.map(p => p.LGA)
	options1.tooltip = {
		y: {
			formatter: (val, options) => {
				const percent = options.globals.seriesPercent[options.seriesIndex][0]
				return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
			}
		}
	}
	options1.xaxis.categories = ["LGA", keys[2].replace("identified", "identified<br>")
	]

	soefinding.state.chart1 = {
		series: series1,
		options: options1,
		chartactive: true,
	}

	const options2 = {
		xaxis: {
			categories: keys
		}
	}
	soefinding.state.chart2 = {
		series: series2,
		options: options2,
		chartactive: false,
	}


	soefinding.state.chart3 = {
		series: soefinding.findingContent[soefinding.state.currentRegionName].series3,
		options: options2,
		chartactive: false,
	}


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => "Proportion of local heritage places on local heritage registers by local government area, 2020 (TODO fix year)",
			heading2: function () {
				return `Local heritage places and areas by planning scheme in ${this.currentRegionName} Local Government Area`
			},
			heading3: function () {
				return `Local heritage places and areas by planning scheme in ${this.currentRegionName}`
			}
		},
		methods: {
			formatter1: val => val.toLocaleString(),
			formatPercent: function (s, i, series) {
				const sum = series.reduce((acc, curr) => acc + curr)
				return (s / sum * 100).toFixed(1)
			}
		}
	}).mount("#chartContainer")


	window.soefinding.onRegionChange = function () {
		soefinding.state.chart3.series = this.findingContent[this.state.currentRegionName].series3
		soefinding.loadFindingHtml();
	}

})