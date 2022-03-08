"use strict";

document.addEventListener("DOMContentLoaded", function () {

	//get the json parsed data  
	const jsonDataElement = document.getElementById("jsonData");
	const textContent = jsonDataElement.textContent
	const parsed = JSON.parse(textContent)
	console.log(parsed);


	soefinding.vueState.props = {
		caption: "Status of fish stocks, 2024 TODO",
		index: 1,
		headings: ["Group", "Species", "Stock", "Stock status"],
		numericColumns: [],
		data: parsed.data,
		formatter: val => val
	}

	Vue.createApp({
		data() {
			return soefinding.vueState
		},
		components: myComponents,
	}).mount("#vueApp")

})
