"use strict";

document.addEventListener("DOMContentLoaded", function () {

	var fields = soefinding.findingJson.meta.fields.slice(2);

	soefinding.yearKeys = [];
	for (var i = 0; i < fields.length; i += 3) {
		soefinding.yearKeys.push(fields[i].split(" ")[0]);
	}

	soefinding.state.chart1 = { series: [], chartactive: true }
	soefinding.state.chart2 = { series: [], chartactive: true }
	soefinding.findingJson.data.forEach(function (row) {
		if (row["Protected areas"] == "All") {
			var data = [];
			fields.forEach(function (field, index) {
				if (index % 3 == 1) {
					data.push(row[field]);
				}
			})
			soefinding.state.chart2.series.push({ name: row["Type"], data: data });
		}
		else {
			var data = [];
			fields.forEach(function (field, index) {
				if (index % 3 == 0) {
					data.push(row[field]);
				}
			})
			soefinding.state.chart1.series.push({ name: row["Protected areas"], data: data });
		}
	});



	soefinding.state.chart1.options = soefinding.getDefaultBarChartOptions();
	soefinding.state.chart1.options.chart.stacked = "true";
	soefinding.state.chart1.options.xaxis.categories = soefinding.yearKeys;
	soefinding.state.chart1.options.xaxis.title.text = "Year";
	soefinding.state.chart1.options.yaxis.title.text = "Hectares";
	soefinding.state.chart1.options.tooltip.y = {
		formatter: val => val.toLocaleString() + " ha"
	}


	soefinding.state.chart2.options = JSON.parse(JSON.stringify(soefinding.state.chart1.options))
	soefinding.state.chart2.options.tooltip.y = {
		formatter: val => val.toLocaleString() + " ha"
	}
	soefinding.state.chart2.options.yaxis.labels.formatter = val => (val / 1000000) + "M"



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Cumulated number of each protected area`,
			heading2: () => `Cumulated extent of all protected areas`
		},
		methods: {
			formatter1: () => val.toLocaleString()
		}
	})



})