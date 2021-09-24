"use strict"

soefinding.regions = pinLocations // these should already be set in ssjs


document.addEventListener("DOMContentLoaded", function () {

	const years = [...new Set(soefinding.findingJson.data.map(d => d.Year))]
	const locations = [...new Set(soefinding.findingJson.data.map(d => d.Location))]

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
	options2.yaxis.labels.formatter = val => `${val / 1000}k`
	options2.tooltip.y = { formatter: val => val.toLocaleString() }


	soefinding.state.chart2 = {
		options: options2,
		series: qldSeries2,
		chartactive: true,
	};

	// now we can interate qld series and pull out info for each city
	soefinding.findingContent.Queensland = { html: "" } // qld is not in chart3 and 4, but we still need to save its html

	// chart 3, places open
	qldSeries1.forEach(q => {
		soefinding.findingContent[q.name] = {
			app3: [{
				name: q.name,
				data: q.data,
				html: null
			}]
		}
		// we have to remove the null items
		soefinding.findingContent[q.name].categories = []
		const newData = [] // 
		soefinding.findingContent[q.name].app3[0].data.forEach((d, i) => {
			if (!isNaN(parseInt(d))) {
				newData.push(d)
				soefinding.findingContent[q.name].categories.push(years[i])
			}
		})
		soefinding.findingContent[q.name].app3[0].data = newData
	})

	const options3 = JSON.parse(JSON.stringify(options1))
	options3.chart.id = "chart3"
	soefinding.state.chart3 = {
		options: options3,
		chartactive: true,
		html: null
	};
	if (soefinding.state.currentRegionName == "Queensland")
		soefinding.state.chart3.series = soefinding.findingContent.Bundaberg.app3 // set a default
	else
		soefinding.state.chart3.series = soefinding.findingContent[soefinding.state.currentRegionName].app3


	// chart 4, visitors
	qldSeries2.forEach(q => {
		soefinding.findingContent[q.name].app4 = [{
			name: q.name,
			data: q.data
		}]
		// we have to remove the null items
		soefinding.findingContent[q.name].categories = []
		const newData = [] // 
		soefinding.findingContent[q.name].app4[0].data.forEach((d, i) => {
			if (!isNaN(parseInt(d))) {
				newData.push(d)
				soefinding.findingContent[q.name].categories.push(years[i])
			}
		})
		soefinding.findingContent[q.name].app4[0].data = newData
	})

	const options4 = JSON.parse(JSON.stringify(options2))
	options4.chart.id = "chart4"
	options4.yaxis.labels.formatter = options2.yaxis.labels.formatter
	options4.tooltip.y = options2.tooltip.y
	soefinding.state.chart4 = {
		options: options4,
		chartactive: true,
		html: null
	};
	if (soefinding.state.currentRegionName == "Queensland")
		soefinding.state.chart4.series = soefinding.findingContent.Bundaberg.app4 // set a default
	else
		soefinding.state.chart4.series = soefinding.findingContent[soefinding.state.currentRegionName].app4


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Heritage places open in ${soefinding.state.currentRegionName}`,
			heading2: () => `People visiting heritage places in ${soefinding.state.currentRegionName}`
		},
		methods: {
			formatter1: val => isNaN(parseInt(val)) ? "" : val.toLocaleString(),
		}
	})

	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region
		if (this.state.currentRegionName != "Queensland") {

			// update chart 3
			this.state.chart3.series = this.findingContent[this.state.currentRegionName].app3

			// this works on the table
			soefinding.state.chart3.options.xaxis.categories = this.findingContent[this.state.currentRegionName].categories
			// but we also need this for the chart to update
			ApexCharts.exec("chart3", "updateOptions", {
				xaxis: { categories: this.findingContent[this.state.currentRegionName].categories }
			})


			// update chart 4
			this.state.chart4.series = this.findingContent[this.state.currentRegionName].app4
			// this works on the table
			soefinding.state.chart4.options.xaxis.categories = this.findingContent[this.state.currentRegionName].categories
			// but we also need this for the chart to update
			ApexCharts.exec("chart4", "updateOptions", {
				xaxis: { categories: this.findingContent[this.state.currentRegionName].categories }
			})

		}

		soefinding.loadFindingHtml();
	}

})