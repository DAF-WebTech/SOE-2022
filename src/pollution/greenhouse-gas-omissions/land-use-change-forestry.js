"use strict"

document.addEventListener("DOMContentLoaded", function () {

	const yearKeys = soefinding.findingJson.meta.fields.slice(2)
	const latestYear = yearKeys[yearKeys.length - 1]




	new Vue({
		el: "#chartContainer",
		data: soefinding.state,
		computed: {
			heading1: () => `Proportion of agriculture emissions by state, ${latestYear}`,
			heading2: () => `Proportion of Queensland’s agriculture emissions by category, ${latestYear}`,
			heading3: () => "Trends in Queensland’s agriculture emissions, by category",
			heading4: () => "Queensland’s total agriculture emissions"
		},
		methods: {
			formatter1: val => val.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) //reüse for 2, 3
		}
	})
})
