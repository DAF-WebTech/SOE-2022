"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. line, number
	const numberItems = soefinding.findingJson.data.filter(d => d.Measure.startsWith("Number"))
	const numberSeries = numberItems.map(d => {
		return {
			name: d.Extent,
			data: yearKeys.map(y => d[y])
		}
	})

	const options1 = soefinding.getDefaultLineChartOptions()
	options1.xaxis.axisTicks = { show: false }
	options1.xaxis.categories = yearKeys.map(y => [y.slice(0, 4) + "–", y.slice(5)]) // ndash
	options1.xaxis.tickPlacement = "between"
	options1.xaxis.labels.rotateAlways = false
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number of items per 100m²"


	soefinding.state.chart1 = {
		options: options1,
		series: numberSeries,
		chartactive: true,
	};


	// 2. line, volume
	const volumeItems = soefinding.findingJson.data.filter(d => d.Measure.startsWith("Volume"))
	const volumeSeries = volumeItems.map(d => {
		return {
			name: d.Extent,
			data: yearKeys.map(y => d[y])
		}
	})

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.yaxis.title.text = "Volume of items per 100m²"
	options2.yaxis.labels.formatter = val => `${val}`

	soefinding.state.chart2 = {
		options: options2,
		series: volumeSeries,
		chartactive: true,
	};


	Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1: () => "Trends in number of litter items per 1000m² by Queensland and Australia",
			heading2: () => "Trends in volume of litter items per 1000m² by Queensland and Australia",
		},
		methods: {
			formatter1: val => val,
			formatter2: val => val.toLocaleString(undefined, { minimumFractionDigits: 2 }),
		}
	}).mount("#chartContainer")
})
