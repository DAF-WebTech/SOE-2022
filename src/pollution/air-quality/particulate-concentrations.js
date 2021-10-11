"use strict"

document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(2);
	
	//chart 1 24 hour PM10 concentrations exceeded (days)
	const daysExceeded10 = soefinding.findingJson.data.filter(d => {
		return d["Air quality standard"] == "24 hour PM10 concentrations exceeded (days)"
	})
	const daysExceeded10Series = daysExceeded10.map(d => {
		return {
			name: d.Airshed,
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.xaxis.categories = soefinding.yearKeys
	options1.xaxis.title.text = "Year"
	options1.xaxis.axisTicks = { show: false }
	options1.xaxis.labels.rotateAlways = true
	options1.yaxis.title.text = "Number of days"
	options1.yaxis.forceNiceScale = false
	options1.yaxis.min = 0
	options1.yaxis.max = 40
	options1.yaxis.tickAmount = 4


	soefinding.state.chart1 = {
		options: options1,
		series: daysExceeded10Series,
		chartactive: true,
	};

	//chart 2 24 hour PM2.5 concentrations exceeded (days)
	const daysExceeded25 = soefinding.findingJson.data.filter(d => {
		return d["Air quality standard"] == "24 hour PM2.5 concentrations exceeded (days)"
	})
	const daysExceeded25Series = daysExceeded25.map(d => {
		return {
			name: d.Airshed,
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	const options2 = JSON.parse(JSON.stringify(options1))
	options2.yaxis.max = 30
	options2.yaxis.tickAmount = 6

	soefinding.state.chart2 = {
		options: options2,
		series: daysExceeded25Series,
		chartactive: true,
	};


	//chart 3 annual average PM10 
	const concentrations10 = soefinding.findingJson.data.filter(d => {
		return d["Air quality standard"] == "Annual average PM10 concentrations (micrograms/m3)"
	})
	const concentrations10Series = concentrations10.map(d => {
		return {
			name: d.Airshed,
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	const options3 = JSON.parse(JSON.stringify(options1))
	options3.yaxis.labels.formatter = val => val.toFixed(0)
	options3.tooltip.y = {formatter: val => val }

	soefinding.state.chart3 = {
		options: options3,
		series: concentrations10Series,
		chartactive: true,
	};
	
	
	//chart 4 annual average PM2.5
	const concentrations25 = soefinding.findingJson.data.filter(d => {
		return d["Air quality standard"] == "Annual average PM2.5 concentrations (micrograms/m3)"
	})
	const concentrations25Series = concentrations25.map(d => {
		return {
			name: d.Airshed,
			data: soefinding.yearKeys.map(y => d[y])
		}
	})

	const options4 = JSON.parse(JSON.stringify(options1))
	options4.yaxis.max = 10
	options4.yaxis.tickAmount = 5
	options4.yaxis.labels.formatter = val => val.toFixed(0)
	options4.tooltip.y = {formatter: val => val }

	soefinding.state.chart4 = {
		options: options4,
		series: concentrations25Series,
		chartactive: true,
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Number of days when the 24-hour PM₁₀ concentrations exceeded the Air NEPM standards` },
			heading2: function () { return `Number of days when the 24-hour PM₂.₅ concentrations exceeded the Air NEPM standards` },
			heading3: function () { return `Annual average PM₁₀ concentrations (µg/m³)` },
			heading4: function () { return `Annual average PM₂.₅ concentrations (µg/m³)` },

		},
		methods: {
			formatter1: function (val) { return val?.toLocaleString() ?? "" },
			formatter2: function (val) { return val?.toLocaleString(undefined, { minimumFractionDigits: 1 }) ?? "" }
		}
	});



})
