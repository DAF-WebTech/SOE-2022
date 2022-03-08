"use strict"

document.addEventListener("DOMContentLoaded", function () {


	const years = [...new Set( soefinding.findingJson.data.map(d => d.Year))]
	const entries = [...new Set( soefinding.findingJson.data.map(d => d.Entry))]
	
	const series1 = entries.map(e => {
		return {
			name: e,
			data: soefinding.findingJson.data.filter(d => d.Entry == e).map(d => d["Updates to existing entries"])
		}
	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.xaxis.categories = years
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number of entries"


	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	};


	const series2 = entries.map(e => {
		return {
			name: e,
			data: soefinding.findingJson.data.filter(d => d.Entry == e).map(d => d["New entries"])
		}
	})

	soefinding.state.chart2 = {
		options: options1,
		series: series2,
		chartactive: true,
	};


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => "Queensland underwater cultural heritage entries updated in the AUCHD",
			heading2: () => "Queensland underwater cultural heritage entries added to the AUCHD"
		},
		methods: {
			formatter1: val => val.toLocaleString()
		}
	}).mount("#chartContainer")

})