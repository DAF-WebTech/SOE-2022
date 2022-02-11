"use strict"


// esri map implementation

var esriSelect;
var graphicsLayer;
var simpleMarkerSymbol;
var getGraphic;



function deselectPin() {
	for (let pin in soefinding.regions) {
		if (soefinding.regions[pin].map.selected) {
			soefinding.regions[pin].map.selected = false;
			// remove it
			graphicsLayer.remove(soefinding.regions[pin].map.graphic);
			delete soefinding.regions[pin].map.graphic;
			// add it back with unselected colour
			simpleMarkerSymbol.color = unselectedColour;
			soefinding.regions[pin].map.graphic = getGraphic(pin);
			graphicsLayer.add(soefinding.regions[pin].map.graphic);
		}
	}
}



require([
	"esri/config",
	"esri/Map",
	"esri/views/MapView",
	"esri/Graphic",
	"esri/layers/GraphicsLayer",
	"esri/widgets/BasemapToggle",
	"esri/widgets/Home",
	"esri/symbols/PictureMarkerSymbol"
],


	function (esriConfig, Map, MapView, Graphic, GraphicsLayer, BasemapToggle, Home, PictureMarkerSymbol) {

		const map = new Map({
			basemap: soefinding.baseLayer //Basemap layer service
		});

		const view = new MapView({
			container: "map-canvas",
			map: map,
			center: soefinding.mapCentre,
			zoom: soefinding.mapZoom,
			constraints: {
				minZoom: 3
			}			
		});

		graphicsLayer = new GraphicsLayer();
		map.add(graphicsLayer);

		// Define the Basemap toggle switch and add it to the map
		var basemapToggle = new BasemapToggle({
			view: view,
			nextBasemap: "hybrid" //Allows the user to switch between the satellite imagery and the street map.
		});

		view.ui.add(basemapToggle, "bottom-left");
		view.ui.add(new Home({ view: view }), "top-left");

		// Define the selection interface and add it to the map
		esriSelect = document.createElement("select", "");
		esriSelect.setAttribute("class", "esri-widget esri-select");
		esriSelect.setAttribute("style", "width: 200px; font-size: 1em");

		var option = document.createElement("option");
		option.textContent = option.value = "Queensland";
		esriSelect.appendChild(option);

		for (const region in soefinding.regions) {
			var option = document.createElement("option");
			option.textContent = option.value = region;
			esriSelect.appendChild(option);
		}

		view.ui.add(esriSelect, "top-right");

		// Listen for changes
		esriSelect.addEventListener("change", function (event) {
			soefinding.onRegionSelect(event.target.value, "select", "pin")
		});



		simpleMarkerSymbol = {
			type: "picture-marker",  
			url: "https://www.stateoftheenvironment.des.qld.gov.au/__data/assets/image/0010/1596583/pin-blue-32x99.png",
			width: "32px",
			height: "99px"
		}
		
		// pin is the string of the name of station
		getGraphic = function (pin, selected) {

			var point = {
				type: "point",
				latitude: soefinding.regions[pin].map.lat,
				longitude: soefinding.regions[pin].map.long
			}

			return new Graphic({
				geometry: point,
				symbol: simpleMarkerSymbol,
				name: pin
			});

		}




		for (let pin in soefinding.regions) {

			const pointGraphic = getGraphic(pin);
			soefinding.regions[pin].map.graphic = pointGraphic;
			graphicsLayer.add(pointGraphic);

		}

		view.on("immediate-click", function (event) {

			view.hitTest(event).then(function (response) {
				if (response.results.length && response.results[0].graphic.name) {

					var name = response.results[0].graphic.name;


					if (!soefinding.regions[name].map.selected) {

						// find the pin that is selected, change its colour, set selected to false
						deselectPin()
						// find this pin and select it
						simpleMarkerSymbol.color = selectedColour;

						response.results[0].graphic.symbol = simpleMarkerSymbol;
						soefinding.regions[name].map.selected = true;

						soefinding.onRegionSelect(name, "map", "pin")
					}
				}
				else {
					deselectPin()

					soefinding.onRegionSelect("Queensland", "map", "pin")
				}
			});
		});

		view.on("pointer-move", function (event) {
			view.hitTest(event).then(function (response) {
				if (response.results.length == 0) {
					esriSelect.querySelector("option[value='" + soefinding.state.currentRegionName + "']").selected = true;
				}
				else {
					if (response.results[0].graphic.name)
						esriSelect.querySelector("option[value='" + response.results[0].graphic.name + "']").selected = true;
					else
						esriSelect.querySelector("option[value='" + soefinding.state.currentRegionName + "']").selected = true;
				}
			});
		});


		view.on("drag", function (event) {
			if (event.action == "end") {
				//console.log(esriView.center.latitude, esriView.center.longitude)
				//console.log(esriView.zoom)
				if (view.center.longitude < 138 || view.center.longitude > 154)
					view.center = soefinding.mapCentre
				if (view.center.latitude < -30 || view.center.latitude > -8)
					view.center = soefinding.mapCentre
			}
		})


		view.when(function () {
			// if the currentRegion (which was elsewhere derived from location.hash) 
			// is not the default region we were loaded with
			// then we need to call onRegionSelect so that the correct region can be selected
			if (soefinding.state.currentRegionName != soefinding.firstChildPage) {
				soefinding.onRegionSelect(soefinding.state.currentRegionName, "regionList", "pin");
			}
		});


	})
