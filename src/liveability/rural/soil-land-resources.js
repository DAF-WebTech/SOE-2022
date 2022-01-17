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


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of land by use in ${soefinding.state.currentRegionName}, 2019`
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
			}

		}
	})


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region
		soefinding.state.chart1.series =
			this.findingContent[this.state.currentRegionName].app1;

		soefinding.loadFindingHtml();
	}

})