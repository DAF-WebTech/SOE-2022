"use strict"
document.addEventListener("DOMContentLoaded", function () {

	const years = soefinding.findingJson.meta.fields.slice(1)
	const latestYear = years.at(-1)

	//will use for series 1
	const yearsTotals = years.map(y => 0)
	let total = 0

	soefinding.findingJson.data.forEach(d => {
		// create a total property for each lga
		d.Total = years.reduce((accumulator, current) => {
			return accumulator + d[current]
		}, 0)

		// get year totals for table 1
		years.forEach((y, i) => {
			yearsTotals[i] += d[y]
			total += d[y]
		})

	})

	//sort
	soefinding.findingJson.data.sort(function (a, b) {
		return b.Total - a.Total
	})


	// series 1 table
	const series1 = [...yearsTotals, total]
	const options1 = {
		labels: [...years, "Total"],
		xaxis: { categories: ["Year", "Places<br>removed"] }
	}

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: false,
	}


	// series 2 pie chart
	const series2items = soefinding.findingJson.data.filter(d => d.Total > 0)
	const series2data = series2items.map(d => d.Total)

	const options2 = soefinding.getDefaultPieChartOptions()
	options2.labels = series2items.map(d => d.LGA)
	options2.xaxis = { categories: ["LGA", "Total"] }
	options2.tooltip.y = {
		formatter: (val, options) => {
			const percent = options.globals.seriesPercent[options.seriesIndex][0]
			return `${val.toLocaleString()}ha (${percent.toFixed(0)}%)`
		}
	}


	soefinding.state.chart2 = {
		options: options2,
		series: series2data,
		chartactive: true,
	};


	// series 3 table
	const series3 = soefinding.findingJson.data.map(d => {
		return {
			name: d.LGA,
			data: [...years.map(y => d[y]), d.Total]
		}
	})

	const options3 = {
		xaxis: { categories: [...years, "Total"] }
	}

	soefinding.state.chart3 = {
		options: options3,
		series: series3,
		chartactive: false,
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Total places removed, ${years[0]}–${latestYear}`,
			heading2: () => `Proportion of places removed by Local Government Area (LGA), ${years[0]}–${latestYear}`,
			heading3: () => `Places removed in each LGA, ${years[0]}–${latestYear}`
		},
		methods: {
			formatter1: val => val,
		}
	})

})