"use strict"
// to get the date series on y working properly, we had to 
// use a different method of passing in data,
// which affected the table render,
// so we should make up a new component for this page,
// on this page only.
// to be done another time
document.addEventListener("DOMContentLoaded", function () {

	const items = soefinding.findingJson.data

	const series = [{
		name: "Six month mean",
		data: items.map(d => {
			return { x: `${d.Year}-${d.Month.toString().padStart(2, "0")}-01`, y: d["Six month mean"] }
		})
	}]

	const options = soefinding.getDefaultLineChartOptions()
	options.chart.animations = {
		initialAnimation: {
			enabled: false
		}
	}
	options.tooltip.y = {
		formatter: val => val < 0 ? `−${Math.abs(val).toFixed(1)}` : val.toFixed(1)
	}
	delete options.xaxis.categories
	options.xaxis.title.text = "Year"
	options.xaxis.type = "datetime"
	options.yaxis.title.text = "Index"
	options.yaxis.labels.formatter = val => val < 0 ? `−${Math.abs(val).toFixed(0)}` : val.toFixed(0)
	options.stroke = {width: 1}
	options.markers.size = 0
	options.tooltip = {x : { format: 'MMMM yyyy' } }

// taking the last 600 data points because they can't all fit
// also need to fix the table
series[0].data = series[0].data.slice(-600)


	soefinding.state.chart1 = {
		options: options,
		series: series,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Southern Oscillation Index 1876–2020` },
		},
		methods: {
			formatter1: val => val?.toFixed(2) ?? ""
		},
	});
})
