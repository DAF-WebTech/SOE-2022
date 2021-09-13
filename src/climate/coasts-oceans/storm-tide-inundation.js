"use strict"

document.addEventListener("DOMContentLoaded", function () {

	// group cyclones
	const cyclones = {}
	soefinding.findingJson.data.forEach(d => {
		if (!cyclones[d.Cyclone])
			cyclones[d.Cyclone] = []
		cyclones[d.Cyclone].push(d)
	})

	const keys = soefinding.findingJson.meta.fields.slice(2)

	const options = soefinding.getDefaultBarChartOptions()

	Object.keys(cyclones).forEach((c, i) => {
		const data = [[], []]
		const names = []
		cyclones[c].forEach((d, i) => {
			names.push(`${d.Location}, ${d.Date}`)
			data[0].push(d[keys[0]])
			data[1].push(d[keys[1]])
		})
		const series = names.map((n, i) => {
			return {
				name: n,
				data: data[i]
			}
		})

		soefinding.state[`chart${i + 1}`] = {
			options: options,
			series: series,
			chartactive: true,
		};

	})


	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => "",
			heading2: () => "",
			heading3: () => "",
			heading4: () => "",
		},
		methods: {
			formatter1: val => val
		}
	});
})
