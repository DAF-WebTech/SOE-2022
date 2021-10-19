"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const measures = soefinding.findingJson.meta.fields.slice(2)

	const series = measures.map(m => {
		return {
			name: m,
			data: soefinding.findingJson.data.map(d => {
				return { x: `${d.Year}-${d.Month.toString().padStart(2, "0")}`, y: d[m] }
			})
		}
	})


	const options = soefinding.getDefaultLineChartOptions()
	delete options.xaxis.categories
	options.colors=[ "#008FFB", "#ff4560", "#feb019"]
	options.tooltip.x = { format: 'MMMM yyyy' }
	options.tooltip.y = { formatter: val => val < 0 ? `−${Math.abs(val)}` : val }
	options.xaxis.type = "datetime"
	options.xaxis.title.text = "Date"
	options.yaxis.title.text = "Mean sea level change (mm)"
	options.yaxis.labels.formatter = val => val < 0 ? `−${Math.abs(val).toFixed(0)}` : val.toFixed(0)
	options.stroke = {width: 1}
	options.markers.size = 0

	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Trends of mean sea level change from the Australian Baseline Sea Level Monitoring Project sites at Cape Ferguson and Rosslyn Bay for the period 1996 to February 2020`
		},
		methods: {
			formatter1: (val, index) => {
				const sign = val < 0 ? "−" : ""
				const abs = Math.abs(val)
				return sign + ( index == 2 ? abs.toFixed(1) : abs)
			}
		}
	});
})
