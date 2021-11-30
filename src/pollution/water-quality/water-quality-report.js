document.addEventListener("DOMContentLoaded", function () {

	soefinding.regionNames.forEach(r => soefinding.findingContent[r] = {})

	window.soefinding.onRegionChange = function () {
		soefinding.loadFindingHtml()
	}

})