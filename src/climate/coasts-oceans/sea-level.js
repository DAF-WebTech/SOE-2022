"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const measures = soefinding.findingJson.meta.fields.slice(2, 3)

	const series = measures.map(m => {
		return {
			name: m,
			data: soefinding.findingJson.data.map(d => {
				//return [new Date(d.Year, d.Month-1).getTime(), d[m]]
				return { x: `${d.Year}-${d.Month.toString().padStart(2, '0')}-01`, y: d[m] }
			})
		}
	})

	const options = soefinding.getDefaultLineChartOptions()
	options.xaxis.type = "datetime"
	options.xaxis.title.text = "Date"
	options.yaxis.title.text = "Mean sea level change (mm)"
	//options.yaxis.labels.formatter = val => val < 0 ? `−${Math.abs(val).toFixed(0)}` : val.toFixed(0)
	//options.yaxis.labels.formatter = val => val < 0 ? `−${Math.abs(val).toFixed(0)}` : val.toFixed(0)
	//options.tooltip.y = {
	//	formatter: val => val < 0 ? `−${Math.abs(val)}` : val
	//}

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
			formatter1: val => val
		}
	});
})
