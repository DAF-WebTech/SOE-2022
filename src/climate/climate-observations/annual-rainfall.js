"use strict"

soefinding.regions = {
	"Palmerville": { map: { lat: -16, long: 144.08 }, data: {} },
	"Cairns Airport": { map: { lat: -16.87, long: 145.75 }, data: {} },
	"Burketown": { map: { lat: -17.74, long: 139.55 }, data: {} },
	"Townsville Airport": { map: { lat: -19.25, long: 146.77 }, data: {} },
	"Kalamia Estate": { map: { lat: -19.54, long: 147.41 }, data: {} },
	"Camooweal Township": { map: { lat: -19.92, long: 138.12 }, data: {} },
	"Pleystowe Sugar Mill": { map: { lat: -21.14, long: 149.04 }, data: {} },
	"Barcaldine Post Office": { map: { lat: -23.55, long: 145.29 }, data: {} },
	"Westland": { map: { lat: -23.97, long: 143.82 }, data: {} },
	"Fairymead Sugar Mill": { map: { lat: -24.79, long: 152.36 }, data: {} },
	"Brian Pastures": { map: { lat: -25.66, long: 151.75 }, data: {} },
	"Augathella Post Office": { map: { lat: -25.8, long: 146.58 }, data: {} },
	"Birdsville Police Station": { map: { lat: -25.9, long: 139.35 }, data: {} },
	"University of Queensland, Gatton": { map: { lat: -27.55, long: 152.34 }, data: {} },
	"Pittsworth, Yandilla Street": { map: { lat: -27.72, long: 151.63 }, data: {} },
	"Cunnamulla Post Office": { map: { lat: -28.07, long: 145.68 }, data: {} }
}



document.addEventListener("DOMContentLoaded", function () {

	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(2);
    const regionNames  = Object.keys(soefinding.regions)
    regionNames.push("Queensland")


    for (let regionName of regionNames) {

		// create a data series for this region
		const item = soefinding.findingJson.data.filter(d => d.Name == regionName)
		const seriesNames = ["Actual", "Moving average"]
		const series = seriesNames.map(s => {
			const regionItem = item.find(d => d.Measure == s)
			return {
				name: s,
				data: soefinding.yearKeys.map(y => regionItem[y])
			}
		})

		// findingContent holds the html and data series for each region
		soefinding.findingContent[regionName] = {
			html: "",
			app1: series
		};

  }

  	const options1 = soefinding.getDefaultLineChartOptions();
	options1.xaxis.categories = soefinding.yearKeys
	options1.xaxis.title.text = "Year";
	options1.yaxis.title.text = "Rainfall (millimetres)";
	options1.yaxis.labels.formatter = function (val) {
		return val ;
	}


	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName].app1,
		chartactive: true,
	};


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Annual average rainfall for ${soefinding.state.currentRegionName}` },

		},
		methods: {
			formatter1: function (val) { return val?.toLocaleString(undefined, {minimumFractionDigits: 2}) ?? "" }
		}
	})

})



soefinding.onRegionChange = function () {


	// set the data series in each of the vue apps, for the current region
	this.state.chart1.series = this.findingContent[this.state.currentRegionName].app1;

	soefinding.loadFindingHtml();
}

