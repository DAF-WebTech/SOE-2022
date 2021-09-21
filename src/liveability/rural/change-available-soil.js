"use strict"

const originalNumberToLocaleString = Number.prototype.toLocaleString;
Number.prototype.toLocaleString = function (opts) {
	const result = originalNumberToLocaleString.call(this, undefined, opts)
	result = result.replace("-", "−") // unicode minus sign
	return result
}


document.addEventListener("DOMContentLoaded", function () {

	const keys = soefinding.findingJson.meta.fields.slice(1)


    //soefinding.findingContent.Queensland = {app1: keys.map(k => 0)}

	soefinding.findingJson.data.forEach(d => {
		soefinding.findingContent[d.Region] = {app1: keys.map((k, i) => {
            //first a side effect, sum up for qld
            //soefinding.findingContent.Queensland.app1[i] += d[k]
			return d[k]
			})
		}

	})

	const options1 = soefinding.getDefaultColumnChartOptions();
	options1.xaxis = keys

	soefinding.state.chart1 = {
		options: options1,
		series: soefinding.findingContent[soefinding.state.currentRegionName].app1,
		chartactive: true,
	};

	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Change in available soil and land resources in ${soefinding.state.currentRegionName}`
		},
		methods: {
			formatter1: val => val.toLocaleString({minimumFractionDigits: 2})
		}
	});


	window.soefinding.onRegionChange = function () {
		// set the data series in each of the vue apps, for the current region
		soefinding.state.chart1.series =
			this.findingContent[this.state.currentRegionName].app1;

		soefinding.loadFindingHtml();
	}


})