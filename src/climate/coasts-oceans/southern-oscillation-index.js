/* https://developers.google.com/chart/interactive/docs/gallery/controls?hl=en */

"use strict"


// Load the Visualization API and the corechart package.
google.charts.load("current", { packages:["corechart"]}).then(drawChart)

const lineChartDiv = document.querySelector('div.chart')

function drawChart() {


	const json = JSON.parse(document.getElementById("jsonData").textContent)
	console.log(json)

//soefinding.findingJson.data

        // Create the data table.
		const array = json.data.map(d => {
				return [ new Date(d.Year, d.Month-1), d["Six month mean"] ] 
			})
		array.unshift([ {label: "Month", type: "date"}, "Six Month Mean"])


        const data = google.visualization.arrayToDataTable(array)


        // Set chart options
        const options = {
			chartArea: {
				width: "90%",
				height: "80%"
			},
			colors: ["#008FFB"],
			explorer: {
				actions: ["dragToZoom", "rightClickToReset"],
				axis: "horizontal",
				keepInBounds: true,
				maxZoomIn: 0,
			},
			hAxis: {
				textStyle: {
					fontName: "Lato",
					fontSize: 11
				},
				title: "Year",
				titleTextStyle: { 	
					bold: true,
					italic: false,
					fontSize: 13,
					fontName: "Lato"
				}
			},
			height: 450,
			legend: {
				position: "none"
			},
			lineWidth: 1,
			tooltip: {
				textStyle: {
					fontName: "Lato",
				}
			},
			vAxis: {
				textStyle: {
					fontName: "Lato",
					fontSize: 11
				},
				title: "Index",
				titleTextStyle: {
					bold: true,
					italic: false,
					fontSize: 13,
					fontName: "Lato"
				}
			},


		}

        // Instantiate and draw our chart, passing in some options.
        const chart = new google.visualization.LineChart(lineChartDiv);
        chart.draw(data, options);




		const tableBody = document.getElementById("tableBody")
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		array.forEach( (a, i) => {
			if (i > 0)
				tableBody.insertAdjacentHTML("beforeend", 
					`<tr><th scope=row>${months[a[0].getMonth()]} ${a[0].getFullYear()}<td class=num>${(a[1]?.toFixed(2) ?? "")
					.replace(/\-/, "−")}`
					)
		})





}



// table/chart toggle
const chartListItems = document.querySelectorAll("ul.chart-tabs li")
const chartListItem = chartListItems[0]
const tableListItem = chartListItems[1]

const divs = document.querySelectorAll("div.chart-table>div")
const chartDiv = divs[0]
const tableDiv = divs[1]

document.querySelector("ul.chart-tabs").addEventListener("click", function(event) {
		if (event.target.parentElement == chartListItem) {
			chartListItem.classList.add("active")
			tableListItem.classList.remove("active")

			chartDiv.classList.remove("inactive")
			tableDiv.classList.add("inactive")

		}
		else if (event.target.parentElement == tableListItem) {
			chartListItem.classList.remove("active")
			tableListItem.classList.add("active")

			chartDiv.classList.add("inactive")
			tableDiv.classList.remove("inactive")
		}
	

})


// chart interactive buttons
document.getElementById("resetButton").addEventListener("click", function() { 

	const evt = new MouseEvent("mousedown", {
		view: window,
		button: 2,
		bubbles: true,
		cancelable: true

	})
	lineChartDiv.firstElementChild.dispatchEvent(evt)
	lineChartDiv.firstElementChild.firstElementChild.dispatchEvent(evt)
	lineChartDiv.firstElementChild.firstElementChild.firstElementChild.dispatchEvent(evt)
	

	const svg = lineChartDiv.firstElementChild.firstElementChild.firstElementChild.firstElementChild
	svg.dispatchEvent(evt)


})

const zoomButton = document.getElementById("resetButton")
zoomButton.addEventListener("click", function() { 

	zoomButton.classList.add("active")
	panButton.classList.remove("active")



})

const panButton = document.getElementById("panButton")
panButton.addEventListener("click", function() { 

	zoomButton.classList.remove("active")
	panButton.classList.add("active")


})


