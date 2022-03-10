document.addEventListener("DOMContentLoaded", function () {

	// todo when the new data comes in

	window.vueApp = Vue.createApp({
		components: myComponents,
		data() {
			return soefinding.state
		},
		computed: {
			heading1() {
				return ""
			}
		},
		methods: {
			formatter1: val => val ?? "",
			updateRegion(newRegionName) {
				this.currentRegionName = newRegionName
			}
		},
		watch: {
			currentRegionName(newRegionName) {
			}
		}
	}).mount("#chartContainer")


})