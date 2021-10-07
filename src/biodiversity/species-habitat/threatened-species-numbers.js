// this is used by both flora and fauna

"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const series1Keys = soefinding.findingJson.meta.fields.filter(f => f.includes("threatened") 
			&& !f.includes("near"))
	const series1 = soefinding.findingJson.data.map(d => {
		return {
			name: d.Group,
			data: series1Keys.map(k => d[k])
		}
	})

	const options1 = soefinding.getDefaultStackedColumnChartOptions()
	options1.xaxis.categories = series1Keys.map(k => k.split(" ")[0])
	options1.xaxis.title.text = "Year"
	options1.yaxis.title.text = "Number of species"

	soefinding.state.chart1 = {
		options: options1,
		series: series1,
		chartactive: true,
	}

	// now set up check box list 
	// and a chart component for each item in data
	const years = options1.xaxis.categories
	// there's a bad situation here where they changed the name of extinct in 2019, we need to normalise this.
	soefinding.findingJson.data.forEach(d => {
		years.forEach(y => {
			if (d.hasOwnProperty(`${y} extinct in the wild`))
				d[`${y} presumed extinct`] = d[`${y} extinct in the wild`]
		})
	})


	const series2Fields = ["vulnerable", "endangered", "presumed extinct"]
	const series2Keys = []
	years.forEach(y => {
		series2Fields.forEach(f => series2Keys.push(`${y} ${f}`))
	})

	const species = soefinding.findingJson.data.map(d => {
		return { 
			name: d.Group, 
			checked: false,
			chartactive: true,
			data: series2Fields.map(f => { 
				return {
					name: f[0].toUpperCase() + f.slice(1), 
					data: series2Keys.filter(k => k.includes(f)).map(k => d[k])
				}
			}),
		}
	})
	species[0].checked = true
	soefinding.state.species = species

	soefinding.state.options2 = soefinding.getDefaultStackedColumnChartOptions()
	soefinding.state.options2.xaxis.categories = options1.xaxis.categories
	soefinding.state.options2.xaxis.title.text = "Year"
	soefinding.state.options2.yaxis.title.text = "Number of species"




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Numbers of threatened ${soefinding.biota} (<i>Nature Conservation Act 1992</i> Extinct, Extinct in the Wild, Critically Endangered, Endangered, and Vulnerable) by species group`
		},
		methods: {
			formatter1: val => val
		}
	})
})