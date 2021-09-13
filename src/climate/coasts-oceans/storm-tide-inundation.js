"use strict"

document.addEventListener("DOMContentLoaded", function () {

	// group cyclones
	const cyclones = {}
	soefinding.findingJson.data.forEach(d => {
		if (!cyclones[d.Cyclone])
			cyclones[d.Cyclone] = []
		cyclones[d.Cyclone].push(d)
	})


	const keys = soefinding.findingJson.meta.fields.slice(3)
	const options = soefinding.getDefaultBarChartOptions()
	options.xaxis.title.text = "Incident"
	options.yaxis.title.text = "Metres"
	options.yaxis.forceNiceScale = false


	Object.keys(cyclones).forEach((c, i) => {
		const data = [[], []]
		const names = []
		cyclones[c].forEach((d, i) => {
			const date = new Date(d.Date)
			names.push([d.Location, `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`])
			data[0].push(d[keys[0]])
			data[1].push(d[keys[1]])
		})
		const series = keys.map((k, i) => {
			return {
				name: k.substring(0, k.indexOf("(")),
				data: data[i]
			}
		})

		const myOptions = JSON.parse(JSON.stringify(options))
		myOptions.xaxis.categories = names
		myOptions.tooltip.y = {
			formatter: function (val) {
				return val < 0 ? `−${Math.abs(val)}` : val // use correct unicode
			},
		}


		switch (i) {
			case 0:
				myOptions.yaxis.min = -0.5
				myOptions.yaxis.max = 2.0
				myOptions.yaxis.tickAmount = 5
				myOptions.yaxis.labels.formatter = val => val.toFixed(1)
				break

			case 1:
				myOptions.yaxis.min = -0.25
				myOptions.yaxis.max = 1.25
				myOptions.yaxis.tickAmount = 6
				myOptions.yaxis.labels.formatter = val => val.toFixed(2)

				break

			case 2:
				myOptions.yaxis.min = -0.2
				myOptions.yaxis.max = 1.0
				myOptions.yaxis.tickAmount = 6
				myOptions.yaxis.labels.formatter = val => val.toFixed(1)

				break
		}


		soefinding.state[`chart${i + 1}`] = {
			options: myOptions,
			series: series,
			chartactive: true,
		}

	})

	// chart 4, just a plain table, not using component
	soefinding.state.chart4 = {
		headings: soefinding.findingJson.meta.fields,
		data: [[]],
		data: soefinding.findingJson.data.map(d => soefinding.findingJson.meta.fields.map(f => {
			if (f == "Date") {
				const date = new Date(d.Date)
				return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
			}
			else
				return d[f]
		})
		)
	};



	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Cyclone ${Object.keys(cyclones)[0]}`,
			heading2: () => `Cyclone ${Object.keys(cyclones)[1]}`,
			heading3: () => `Cyclone ${Object.keys(cyclones)[2]}`,
			heading4: () => "Storm tide inundation incidences, 2018–2019",
		},
		methods: {
			formatter1: val => val < 0 ? `−${Math.abs(val)}` : val // use correct unicode
		}
	});


})
