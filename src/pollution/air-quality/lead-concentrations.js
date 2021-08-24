"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.fields = soefinding.findingJson.meta.fields.slice(2);

	// chart 1. lead particles
	const coSeries = soefinding.fields.map(f => {
	    return { name: f,
	             data: soefinding.findingJson.data.map(d => d[f])
	            } 
	})

	// create the vue instance for first chart, our column chart
	const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	const options1 = soefinding.getDefaultLineChartOptions()
	options1.xaxis.categories = soefinding.findingJson.data.map(d => `${months[d.Month]} ${d.Year}`)
	options1.xaxis.title.text = "Month/Year"
	options1.yaxis.title.text = "Lead concentrations (µg/m³)"
	options1.tooltip.y = {
		formatter: function (val) {
		    return val ? `${val} µg/m³` : "—"
	    }
	}
	options1.yaxis.labels.formatter = function (val) {
		return val
	}
	

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

