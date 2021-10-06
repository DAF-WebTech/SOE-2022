"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series = [
		{
			name: "Number of threatened species",
			data: soefinding.findingJson.data.map(d => d["Number threatened fauna"])
		}
	]

	const options = soefinding.getDefaultLineChartOptions()
	options.xaxis.categories = soefinding.findingJson.data.map(d => d.Threat.replace("-", "—"))
	options.xaxis.title = "Threat"
	options.yaxis.title = "Number of threatened species"

	soefinding.state.chart1 = {
		options,
		series,
		chartactive: true,
	}


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Major threats to fauna species, 2015 TODO fix year",
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	})

})

