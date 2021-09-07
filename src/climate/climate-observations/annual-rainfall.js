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

soefinding.regionData = Object.assign({}, soefinding.regions)
soefinding.regionData.Queensland = { data: {} }




soefinding.findingContent.Queensland = {
	html: document.getElementById("findingTextContents").innerHTML
}

soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(2)

soefinding.findingJson.data.forEach(function (row) {
	soefinding.regionData[row.Name].data[row.Measure] = row
});

Object.keys(soefinding.regionData).forEach(function (name) {
	soefinding.findingContent[name] = {
		html: "",
		app: []
	}

	var series = [{
		name: "Actual",
		data: []
	}, {
		name: "Moving Average",
		data: []
	}];

	soefinding.yearKeys.forEach(function (year) {
		series[0].data.push(soefinding.regionData[name].data.Actual[year]);
		series[1].data.push(soefinding.regionData[name].data["Moving average"][year])
	})

	soefinding.findingContent[name].app = series;

})

var options = soefinding.getDefaultLineChartOptions();
options.xaxis.categories = soefinding.yearKeys;
options.xaxis.title.text = "Year";
options.xaxis.hideOverlappingLabels = true;
options.xaxis.tickAmount = soefinding.yearKeys.length / 10
options.yaxis.title.text = "Rainfall (mm)";
options.yaxis.labels.formatter = function (val, index) {
	return val.toFixed(0)
}
options.tooltip.y = {
	formatter: function (val) {
		return val ? val.toLocaleString() + " mm" : "–"
	}
}

soefinding.app = new Vue({
	el: "#app",
	components: {
		apexchart: VueApexCharts,
	},
	data: {
		name: soefinding.state.currentRegionName,
		years: soefinding.yearKeys,

		series: soefinding.findingContent[soefinding.state.currentRegionName].app,
		chartOptions: options
	}
})




soefinding.onRegionChange = function () {


	// set the data series in each of the vue apps, for the current region
	this.app.series = this.findingContent[this.state.currentRegionName].app;
	this.app.name = this.state.currentRegionName;

	soefinding.loadFindingHtml();
}

