"use strict"


document.addEventListener("DOMContentLoaded", function () {

	const items = soefinding.findingJson.data


	const series = [{
		name: "Six month mean",
		data: items.map(d => {
			return { x: new Date(d.Year, d.Month - 1), y: d["Six month mean"] }
		})
	}]


	const options = soefinding.getDefaultLineChartOptions()
	options.annotations = { /* sets a dark colour line on the 0 */
		yaxis: [
			{
				y: 0,
				strokeDashArray: 0,
				borderColor: '#444',
				borderWidth: 1,
				opacity: 1
			}
		]
	}
	options.grid = {
		xaxis: {
			lines: {
				show: true
			}
		}
	}
	options.markers.size = 0
	options.stroke = { width: 1 }
	options.tooltip.x = { format: 'MMMM yyyy' }
	options.tooltip.y = {
		formatter: val => val < 0 ? `−${Math.abs(val).toFixed(1)}` : val.toFixed(1)
	}
	delete options.xaxis.categories
	delete options.xaxis.tickPlacement
	options.xaxis.title.text = "Year"
	options.xaxis.type = "datetime"
	options.yaxis.labels.formatter = val => val < 0 ? `−${Math.abs(val).toFixed(0)}` : val.toFixed(0)
	options.yaxis.title.text = "Index"



	soefinding.state.chart1 = {
		options,
		series,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Southern Oscillation Index 1876–2020` },
		},
		methods: {
			formatter1: val => val?.toFixed(2).replace("-", "−") ?? ""
		},
	})

})
