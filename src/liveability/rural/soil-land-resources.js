"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const keys = soefinding.findingJson.meta.fields.slice(1)


    soefinding.findingContent.Queensland = {app1: keys.map(k => 0)}

	soefinding.findingJson.data.forEach(d => {
		soefinding.findingContent[d.Region] = {app1: keys.map((k, i) => {
            //first a side effect, sum up for qld
            soefinding.findingContent.Queensland.app1[i] += d[k]

			return d[k]
			})
		}

	})




	var options = soefinding.getDefaultPieChartOptions();
	options.labels = keys
	options.xaxis = { categories: ["Use", "Hectares"] }

	soefinding.state.chart1 = {
		options: options,
		series: soefinding.findingContent[soefinding.state.currentRegionName].app1,
		chartactive: true,
	};

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of land by use in ${soefinding.state.currentRegionName}, 2019`
		},
		methods: {
			formatter1: val => val == 0 ? 0 : val.toLocaleString(undefined, {minimumFractionDigits: 2})
		}
	});


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region
		soefinding.state.chart1.series =
			this.findingContent[this.state.currentRegionName].app1;

		soefinding.loadFindingHtml();
	}


})