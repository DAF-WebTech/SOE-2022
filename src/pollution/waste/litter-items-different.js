"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]
	const extents = ["Australia", "Queensland"]

	// group sites
	const sites = {}
	soefinding.findingJson.data.forEach(d => {
		if (!sites[d.Site])
			sites[d.Site] = []
		sites[d.Site].push(d)
	})

	// 1 - 8, one line chart for each site
	const headings = []
	const options = soefinding.getDefaultLineChartOptions()
	options.xaxis.categories = yearKeys.map(y => y.replace("-", "–"))
	options.xaxis.title.text = "Year"
	options.yaxis.title.text = "Number of items per 100m²"
	Object.keys(sites).forEach((s, i) => {
		const series = extents.map((e, i) => {
			return {
				name: e,
				data: yearKeys.map(y => sites[s][i][y])
			}
		})

		soefinding.state[`chart${i + 1}`] = {
			options: options,
			series: series,
			chartactive: true,
		}

		headings.push(`${s} — Comparison of trends in litter count by Queensland and Australia`)

	})



	// 9. column, average litter count by site type
	const averageSeries = extents.map(e => {
		return {
			name: e,
			data: soefinding.findingJson.data.filter(d => d.Extent == e).map(d => d[latestYear])
		}
	})

	const options9 = soefinding.getDefaultBarChartOptions()
	options9.xaxis.title.text = "Site type"
	options9.xaxis.categories = soefinding.findingJson.data.filter(d => d.Extent == "Queensland").map(d => d.Site.split(" "))
	options9.yaxis.title.text = "Number of items per 100m²"

	soefinding.state.chart9 = {
		options: options9,
		series: averageSeries,
		chartactive: true,
	};


	// 10. column difference in percentage
	//const sites = soefinding.findingJson.data.filter(d => d.Extent == "Queensland").map(d => d.Site)
	const percentSeries = [{
		name: "Percentage", data: Object.keys(sites).map(s => {
			//const extents = soefinding.findingJson.data.filter(d => d.Site == s)
			return Math.round(100.0 - (sites[s][0][latestYear] / sites[s][1][latestYear] * 100.0))
		})
	}]

	const options10 = JSON.parse(JSON.stringify(options9))
	options10.yaxis.title.text = "Percentage difference in count (%)"
	options10.tooltip.y = {
			formatter: function (val) {
				return `${val < 0 ? '−' : ''}${Math.abs(val)}%` // a better minus sign
			}
		}

	soefinding.state.chart10 = {
		options: options10,
		series: percentSeries,
		chartactive: true,
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => headings[0],
			heading2: () => headings[1],
			heading3: () => headings[2],
			heading4: () => headings[3],
			heading5: () => headings[4],
			heading6: () => headings[5],
			heading7: () => headings[6],
			heading8: () => headings[7],
			heading9: () => `Average litter count by site type, ${latestYear.replace("-", "–")}`,
			heading10: () => `Percentage difference between Queensland and Australian counts by site type, ${latestYear.replace("-", "–")}`,
		},
		methods: {
			formatter1: val => val,
			formatter2: val => `${val < 0 ? '−' : ''}${Math.abs(val)}`, // a better minus sign
		}
	})
})
