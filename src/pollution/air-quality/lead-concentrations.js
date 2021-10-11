"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.fields = soefinding.findingJson.meta.fields.slice(2);
	const names = [
			["SEQ", "major road"], 
			["SEQ", "suburban"], 
			["Mt Isa", "residential"], 
			["Townsville", "peak (industrial)"],
			["NEPM", "Standard"]
	]

	// chart 1. lead particles
	const coSeries = soefinding.fields.map((f, i) => {
		return {
			name: names[i],
			data: soefinding.findingJson.data.map(d => {
				return {
					x: `${d.Year}-${String(d.Month).padStart(2, "0")}`,
					y: d[f]
				}
			})
		}
	})

	// create the vue instance for first chart, our column chart
	const options1 = soefinding.getDefaultLineChartOptions()

	delete options1.markers
	delete options1.xaxis.categories

	options1.stroke = { width: 2 }

	const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	options1.tooltip.x = {
		formatter: function (val) {
			const d = new Date(val)
			return `${months[d.getMonth()]} ${d.getFullYear()}`
		}
	}
	options1.tooltip.y = {
		formatter: function (val) {
			return val ? `${val} µg/m³` : "—"
		}
	}

	options1.xaxis.type = "datetime"
	options1.xaxis.title.text = "Month/Year"

	options1.yaxis.title.text = "Lead concentrations (µg/m³)"
	options1.yaxis.forceNiceScale = false
	options1.yaxis.min = 0
	options1.yaxis.max = 3
	options1.yaxis.tickAmount = 6
	options1.yaxis.labels.formatter = val => val.toFixed(1) 




	soefinding.state.chart1 = {
		options: options1,
		series: coSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Trend in annual average lead concentrations (µg/m³)` },

		},
		methods: {
			formatter1: function (val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 3 }) ?? "" }
		}
	})
})
