document.addEventListener("DOMContentLoaded", function () {


	soefinding.yearKeys = soefinding.findingJson.meta.fields.slice(3);
	soefinding.state.latestYear = soefinding.yearKeys[soefinding.yearKeys.length - 1];
	soefinding.regions = {};
	soefinding.findingJson.data.forEach(function (row) {
		if (!soefinding.regions[row.Region]) {
			soefinding.regions[row.Region] = [];
		}
		soefinding.regions[row.Region].push(row);
	});
	soefinding.regionNames = Object.keys(soefinding.regions);
	soefinding.speciesGroups = [];
	soefinding.regions[soefinding.state.currentRegionName].forEach(function (row) {
		soefinding.speciesGroups.push(row.Group);
	});

	soefinding.regionNames.forEach(function (regionName) {
		// findingContent holds the html and data series for each region
		soefinding.findingContent[regionName] = {
			html: "",
			app1: [],
			app2: [],
			app3: [],
			app4: [],
		};

		// do some work to normalise the json to apex chart format, chart 1
		const series = [
			{
				name: "Pre-clear",
				data: [],
			},
			{
				name: "Remnant",
				data: [],
			},
		];
		soefinding.regions[regionName].forEach(function (row, i) {
			series[0].data.push(row["Pre-clear"]);
			series[1].data.push(row[soefinding.state.latestYear]);
		});
		soefinding.findingContent[regionName].app1 = series;

		// chart 2 -- normalise date to apex charts format
		const series2 = [
			{
				name: "Remnant",
				data: [],
			},
			{
				name: "Non-remnant",
				data: [],
			},
		];
		soefinding.regions[regionName].forEach(function (row, i) {
			series2[0].data.push(row[soefinding.state.latestYear]);
			series2[1].data.push(row["Pre-clear"] - row[soefinding.state.latestYear]);
		});
		soefinding.findingContent[regionName].app2 = series2;

		// chart 3 -- normalise date to apex charts format
		const series3 = [];
		soefinding.speciesGroups.forEach(function (group, index) {
			const data = [];
			soefinding.yearKeys.forEach(function (key) {
				const item = soefinding.regions[regionName][index][key];
				data.push(item);
			});
			series3.push({ name: group, data: data });
		});
		soefinding.findingContent[regionName].app3 = series3;

		if (regionName == "Queensland") {
			// chart 4 -- normalise date to apex charts format
			soefinding.speciesPreClear = {};
			soefinding.speciesGroups.forEach(function (species, i) {
				soefinding.speciesPreClear[species] = [];
				soefinding.regionNames.forEach(function (key) {
					if (key == "Queensland") return; //don't do Queensland
					soefinding.speciesPreClear[species].push(
						soefinding.regions[key][i]["Pre-clear"]
					);
				});
			});
		}
	});

	//save the default html we received from the server
	soefinding.findingContent[soefinding.firstChildPage].html = document.getElementById(
		"findingTextContents"
	).innerHTML;

	// create vue app instances
	// create the vue instance for first chart, our column chart
	var options1 = soefinding.getDefaultBarChartOptions();
	options1.xaxis.categories = soefinding.speciesGroups;
	options1.xaxis.title.text = "Fauna Group";
	options1.yaxis.title.text = "Hectares";
	options1.yaxis.labels.formatter = function (val) {
		return val / 1000000 + "M";
	}
	options1.tooltip.y = {
		formatter: function (val) {
			return val.toLocaleString() + " ha";
		},
	}

	// set up our second chart/table app, which is a stacked column
	var options2 = soefinding.getPercentStackedBarChartOptions();
	options2.xaxis.categories = soefinding.speciesGroups;
	options2.xaxis.title.text = "Fauna Group";
	options2.yaxis.title.text = "Proportion";
	options2.tooltip.y = {
		formatter: function (val) {
			return val.toLocaleString() + " ha";
		},
	}

	// set up our third chart/table app which is lines for each species

	var options3 = soefinding.getDefaultLineChartOptions();
	options3.xaxis.categories = soefinding.yearKeys;
	options3.xaxis.title = { text: "Year" };
	options3.yaxis.labels.formatter = function (val, index) {
		return val / 1000000 + "M";
	}
	options3.yaxis.title = { text: "Hectares" };
	options3.chart.events = {
		legendClick: function (chartContext, seriesIndex, config) {
			var name = soefinding.speciesGroups[seriesIndex];
			soefinding.app4.series = soefinding.speciesPreClear[name];
			soefinding.app4.speciesName = name;
		},
	};

	// set up our fourth chart/table which is a pie
	var options4 = soefinding.getDefaultPieChartOptions();
	options4.labels = soefinding.regionNames.slice(1); // remove leading "Queensland"
	options4.xaxis = { categories: options4.labels };

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName].app1,
		chartactive: true,
	};

	soefinding.state.chart2 = {
		options: options2,
		series: soefinding.findingContent[soefinding.state.currentRegionName].app2,
		chartactive: true,
	};

	soefinding.state.chart3 = {
		options: options3,
		series: soefinding.findingContent[soefinding.state.currentRegionName].app3,
		chartactive: true,
	};

	soefinding.state.chart4 = {
		options: options4,
		series: soefinding.speciesPreClear["Birds"],
		chartactive: true,
	};

	//

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: function () { return `Area of ${this.currentRegionName} pre-clear threatened fauna habitat and ${this.latestYear} remnant habitat by species group` },
			heading2: function () { return `Proportion of ${this.currentRegionName} pre-clear threatened fauna habitat that is remnant and non-remnant habitat, ${this.latestYear}` },
			heading3: function () { return `Trend in threatened species habitat, for ${this.currentRegionName}` },
			heading4: function () { return `Proportion of pre-clear threatened ${this.currentSpecies} habitat by bioregion` }
		},
		methods : {
		    formatter1: val => val.toLocaleString()
		}
	});


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region
		soefinding.state.chart1.series =
			this.findingContent[this.state.currentRegionName].app1;
		soefinding.state.chart2.series =
			this.findingContent[this.state.currentRegionName].app2;
		soefinding.state.chart3.series =
			this.findingContent[this.state.currentRegionName].app3;
		soefinding.state.chart4.series =
			this.findingContent[this.state.currentRegionName].app4;

		soefinding.loadFindingHtml();
	};


})