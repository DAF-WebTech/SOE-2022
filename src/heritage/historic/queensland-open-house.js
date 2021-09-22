"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const years = [...new Set( soefinding.findingJson.data.map(d => d.Year))]
	const locations = [...new Set( soefinding.findingJson.data.map(d => d.Location))]
	
	const qldSeries1 = locations.map(loc => {
		const locationData = soefinding.findingJson.data.filter(d => d.Location == loc)
		return {
			name: loc,
			data: years.map(y => {
				const item = locationData.find(ld => ld.Year == y)
				if (item)
					return item["Heritage places open"]
				else 
				return ""
			})
		}
	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.xaxis.categories = years
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number of places"

	soefinding.state.chart1 = {
		options: options1,
		series: qldSeries1,
		chartactive: true,
	};


	const qldSeries2 = locations.map(loc => {
		const locationData = soefinding.findingJson.data.filter(d => d.Location == loc)
		return {
			name: loc,
			data: years.map(y => {
				const item = locationData.find(ld => ld.Year == y)
				if (item)
					return item["Visitors"]
				else 
				return ""
			})
		}
	})

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.yaxis.title.text = "Number of visitors"
	options2.yaxis.labels.formatter = val => `${val/1000}k`
	options2.tooltip.y = { formatter: val => val.toLocaleString() }


	soefinding.state.chart2 = {
		options: options2,
		series: qldSeries2,
		chartactive: true,
	};


	qldSeries1.forEach(q => {
		soefinding.state[q.name]
		soefinding.findingContent[q.name] = { app1: [{
			name: q.name,
			data: q.data
		}]}
	})

	soefinding.state.chart3 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName]?.app1 ?? [],
		chartactive: true,
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Heritage places open in ${soefinding.state.currentRegionName}`,
			heading2: () => `People visiting heritage places in ${soefinding.state.currentRegionName}`
		},
		methods: {
			formatter1: val =>  isNaN(parseInt(val)) ? "" : val.toLocaleString()
		}
	})

	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region
		if (this.state.currentRegionName != "Queensland") {
			soefinding.state.chart1.series = this.findingContent[this.state.currentRegionName].app1;
		}
		
		soefinding.loadFindingHtml();
	}

})