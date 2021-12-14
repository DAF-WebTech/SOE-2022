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

	soefinding.state.chart1.series.sort(function (a, b) {
		return b.data[0] - a.data[0]
	})



	soefinding.state.chart1.options = soefinding.getDefaultBarChartOptions();
	soefinding.state.chart1.options.chart.stacked = true;
	soefinding.state.chart1.options.legend.inverseOrder = true
	delete soefinding.state.chart1.options.xaxis.tickPlacement
	soefinding.state.chart1.options.xaxis.categories = soefinding.yearKeys;
	soefinding.state.chart1.options.xaxis.title.text = "Year";
	soefinding.state.chart1.options.yaxis.title.text = "Hectares";
	soefinding.state.chart1.options.tooltip.y = {
		formatter: function (val) {
			if (val == null)
				return "n/a"
			else
				return `${val.toLocaleString()} ha`
		}
	}


	soefinding.state.chart2.options = JSON.parse(JSON.stringify(soefinding.state.chart1.options))
	soefinding.state.chart2.options.tooltip.y = soefinding.state.chart1.options.tooltip.y
	soefinding.state.chart2.options.yaxis.labels.formatter = val => (val / 1000000) + "M"


	// note chart 3 is a line chart version of chart 1, and goes under chart 1
	soefinding.state.chart3 = {
		series: soefinding.state.chart1.series,
		chartactive: true
	}
	soefinding.state.chart3.options = JSON.parse(JSON.stringify(soefinding.state.chart1.options))
	soefinding.state.chart3.options.chart.type = "line"
	soefinding.state.chart3.options.chart.stacked = false;
	soefinding.state.chart3.options.legend.inverseOrder = false
	soefinding.state.chart3.options.tooltip.y = soefinding.state.chart1.options.tooltip.y
	soefinding.state.chart3.options.xaxis.tickPlacement = "on"
	soefinding.state.chart3.options.yaxis.labels.formatter = soefinding.state.chart1.options.yaxis.labels.formatter




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Cumulated number of each protected area`,
			heading2: () => `Cumulated extent of all protected areas`,
			heading3: () => `Number of each protected area`
		},
		methods: {
			formatter1: val => val?.toLocaleString() ?? ""
		}
	})

})
