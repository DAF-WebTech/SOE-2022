"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(1, 6)
	const latestYear = yearKeys[yearKeys.length - 1]

	// 1. stacked columns, waste by type
	let wasteTypes = soefinding.findingJson.data.filter(d => d["Waste type"] != "All")
	wasteTypes.sort(function(a, b) {
		return b[latestYear] - a[latestYear]
	})
	const wasteTypeSeries = wasteTypes.map(d => {
		return {
			name: d["Waste type"],
			data: yearKeys.map(y => d[y])
		}
	})

	const options1 = soefinding.getDefaultBarChartOptions()
	options1.chart.stacked = true
	options1.legend.inverseOrder = true
	options1.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
    options1.xaxis.title.text = "Year"
    options1.yaxis.title.text = "Tonnes"
    options1.yaxis.labels.formatter = val =>  `${val/1000000}M`
    options1.tooltip.y = {
        formatter: val => `${val.toLocaleString()}`
    }

	soefinding.state.chart1 = {
		options: options1,
		series: wasteTypeSeries,
		chartactive: true,
	};


	//2. line chart,yearly trend
    const wasteConstructionDemolition = soefinding.findingJson.data.find(d => d["Waste type"] == "Construction and demolition")
    const wasteConstructionDemolitionSeries = [{ name: "Tonnes", data:yearKeys.map(y => wasteConstructionDemolition[y])}]

	const options2 = soefinding.getDefaultLineChartOptions()
	options2.xaxis.categories = yearKeys.map(y => y.replace("-", "–")) // ndash
    options2.xaxis.title.text = "Year"
    options2.yaxis.title.text = "Tonnes"
    options2.yaxis.labels.formatter = val => val < 1000000 ? `${val/1000}K` : `${val/1000000}M` 
    options2.tooltip.y = {
        formatter: val => `${val.toLocaleString()}`
    }

	soefinding.state.chart2 = {
		options: options2,
		series: wasteConstructionDemolitionSeries,
		chartactive: true,
	};


	// 3. pie, latest, not sent to landfill 
	//2018-19 Not sent to landfill
	const LATEST_NOT_SENT = "2018-19 Not sent to landfill"
	wasteTypes.sort(function(a, b) {
		return b[LATEST_NOT_SENT] - a[LATEST_NOT_SENT]
	})
	wasteTypes = wasteTypes.filter(d => d[LATEST_NOT_SENT] != null)
	const notSentLandfillSeries = wasteTypes.map(d => d[LATEST_NOT_SENT])

	const options3 = soefinding.getDefaultPieChartOptions()
	options3.labels = wasteTypes.map(d => d["Waste type"])
	options3.xaxis.categories = ["Waste type", "Tonnes"] // not needed for chart, but vue uses them for table headings

	soefinding.state.chart3 = {
		options: options3,
		series: notSentLandfillSeries,
		chartactive: true,
	};


	// 4 stacked columns, latest year, other and landfill
	const keys = ["2018-19 Received by Landfill", LATEST_NOT_SENT]   
	const latestOtherLandfillSeries = keys.map(k =>
	{
      return {
      	name: k.replace ("-", "–"), // ndash
      	data: wasteTypes.map(d => d[k])
      }
	})


	const options4 = soefinding.getDefaultBarChartOptions()
	options4.chart.stacked = true
	options4.xaxis.categories = wasteTypes.map(d => d["Waste type"].split(" ")) //keys
	options4.xaxis.title.text = "Type of interstate construction and demolition waste received"
	options4.yaxis.title.text = "Tonnes (million)"
	options4.yaxis.labels.formatter = val => `${val / 1000000}M`
	options4.tooltip.y = {
		formatter: val => `${(val)?.toLocaleString() ?? "n/a"}`
	}

	soefinding.state.chart4 = {
		options: options4,
		series: latestOtherLandfillSeries,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "Interstate construction and demolition waste received, by waste type",
			heading2: () => "Trend in total interstate construction and demolition waste received",
			heading3: () => "Proportion of interstate construction and demolition waste received, 2018–19 Not sent to landfill",
			heading4: () => "Interstate constrution and demolition waste received by landfill and other, 2018–2019"
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? ""
		},
		mounted: function() { 
          const divs = document.querySelectorAll("div.region-info")
          divs[0].querySelector("th").textContent = "Waste type"
          divs[1].querySelector("th").textContent = "Year range"
		}

	})
})
