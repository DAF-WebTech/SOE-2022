"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const keys = soefinding.findingJson.meta.fields.slice(1)

	soefinding.findingContent.Queensland = { app1: keys.map(k => 0) }

	soefinding.findingJson.data.forEach(d => {
		soefinding.findingContent[d.Region] = {
			app1: keys.map((k, i) => {
				//first a side effect, sum up for qld
				soefinding.findingContent.Queensland.app1[i] += d[k]

				return d[k]
			})
		}
	})

	var options = soefinding.getDefaultPieChartOptions()
	options.labels = keys
	options.xaxis = { categories: ["Use", "Hectares"] }
	options.tooltip.y = {
		formatter: (val, options) => {
			const percent = options.globals.seriesPercent[options.seriesIndex][0]
			return `${val.toLocaleString()}ha (${percent.toFixed(1)}%)`
		}
	}

	soefinding.state.chart1 = {
		options: options,
		series: soefinding.findingContent[soefinding.state.currentRegionName].app1,
		chartactive: true,
	}


	window.vueApp = Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1() { return `Proportion of land by use in ${this.currentRegionName}, 2019` }
		},
		methods: {
			formatter1: val => val == 0 ? 0 : val.toLocaleString(undefined, { minimumFractionDigits: 2 }),
			formatPercent: function (s, i, series) {
				if (s == 0)
					return 0

				const sum = series.reduce((acc, curr) => acc + curr)

				let decimalPlaces = 1

				switch (this.currentRegionName) {
					case "Channel Country":
					case "Desert Uplands":
					case "Mitchell Grass Downs":
					case "Mulga Lands":
						decimalPlaces = 2
						break
					case "New England Tableland":
						decimalPlaces = 4
						break
					default:
				}
				return (s / sum * 100).toFixed(decimalPlaces)
			},
			updateRegion(newRegionName) {
				this.currentRegionName = newRegionName
			}
		},
		watch: {
			currentRegionName(newRegionName) {
				this.chart1.series = soefinding.findingContent[newRegionName].app1;

			}
		}
	}).mount("#chartContainer")



})