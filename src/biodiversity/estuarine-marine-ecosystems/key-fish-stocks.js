"use strict";

document.addEventListener("DOMContentLoaded", function () {

	const lastKey = soefinding.findingJson.meta.fields.at(-1)
	const groups = {}

	soefinding.findingJson.forEach(d => {
		if (!groups[d.Group])
			groups[d.Group] = { species: {} }

		if (!groups[d.Group].species[d.Species])
			groups[d.Group].species(d.Species) = []

		groups[d.Group].species(d.Species).push(d)
	})

	const innerhtml = ""

	Object.keys(groups).forEach((g) => {
		const group = groups[g]
		innerhtml += `<tr><td rowspan=${group.species).reduce((acc, cur) => { return acc + cur.length }, 0)
} > ${g}` 

	Object.keys(g.species).forEach((s, i) => {
		const species = g.species[s]
		if (i == 0)
			innerhtml += `< tr > <td rowspan=${species.length}>s`
		
		innerhtml += species.map(s => `<td>${s.Stock}<td>${s["Stock status " + lastKey]}`)
	})
	
})

document.querySelector("div#chartContainer tbody").innerHtml = innerhtml

})