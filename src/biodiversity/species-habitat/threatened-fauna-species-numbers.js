soefinding.normaliseData = function () {
    
    soefinding.yearKeys = soefinding.parsed.meta.fields.slice(3)
    soefinding.latestYear = soefinding.yearKeys[soefinding.yearKeys.length - 1];
    soefinding.regions = {}
    soefinding.parsed.data.forEach(function(row) {
        if (!soefinding.regions[row.Region]) {
            soefinding.regions[row.Region] = []
        }
        soefinding.regions[row.Region].push(row)
    })
    soefinding.regionNames = Object.keys(soefinding.regions);
    soefinding.speciesGroups = [];
    soefinding.regions[soefinding.myRegionName].forEach(function(row) {
        soefinding.speciesGroups.push(row.Group);
    })
    
    
    soefinding.regionNames.forEach(function(regionName) {
        
        // findingContent holds the html and data series for each region
        this.findingContent[regionName] = {
            html: "",
            app1: [],
            app2: [],
            app3: [],
            app4: []
        }
    

        // do some work to normalise the json to apex chart format, chart 1
        var series = [{
            name: "Pre-clear",
            data: []
        },{
            name: "Remnant",
            data: []
        }]
        this.regions[regionName].forEach(function(row, i) {
            series[0].data.push(row["Pre-clear"]);
            series[1].data.push(row[this.latestYear]);
        }, this);
        this.findingContent[regionName].app1 = series;
        
        
        // chart 2 -- normalise date to apex charts format
        var series2 = [{
            name: "Remnant",
            data: []
        },{
            name: "Non-remnant",
            data: []
        }]
        this.regions[regionName].forEach(function(row, i) {
            series2[0].data.push(row[this.latestYear]);
            series2[1].data.push(row["Pre-clear"] - row[this.latestYear]);
        }, this)
        this.findingContent[regionName].app2 = series2;
    
    
        // chart 3 -- normalise date to apex charts format
        var series3 = [];
        this.speciesGroups.forEach(function(group, index) {
            var data = [];
            soefinding.yearKeys.forEach(function(key) {
                var item = soefinding.regions[regionName][index][key];
                data.push(item);
            })
            series3.push({name: group, data: data });
        });
        this.findingContent[regionName].app3 = series3;
        
        
        if (regionName == "Queensland") {
            // chart 4 -- normalise date to apex charts format
            this.speciesPreClear = {};
            this.speciesGroups.forEach(function(species, i) {
                this.speciesPreClear[species] = [];
                this.regionNames.forEach(function(key) {
                    if (key == "Queensland") return; //don't do Queensland
                    soefinding.speciesPreClear[species].push(soefinding.regions[key][i]["Pre-clear"]);
                });
            }, this);
        }
        
    }, this);
    
    //save the default html we received from the server
    soefinding.findingContent["Queensland"].html = document.getElementById("findingTextContents").innerHTML;

};


soefinding.createChartTableVueApps = function() {



    // create vue app instances
    // create the vue instance for first chart, our column chart   
    var options1 = soefinding.getDefaultBarChartOptions();
    options1.xaxis.categories = soefinding.speciesGroups;
    options1.xaxis.title.text = "Fauna Group";
    options1.yaxis.title.text = "Hectares";
    options1.yaxis.labels = {
        formatter: function (val) {
			return (val / 1000000) + "M"
		}
	};
	options1.tooltip = {
		y: {
			formatter: function (val) {
				return val.toLocaleString() + " ha"
			}
		}
	};
    soefinding.app1 = new Vue({
        el: "#app1",
        components: {
            apexchart: VueApexCharts,
        },
        data: {
            regionName: soefinding.myRegionName,
            latestYear: soefinding.latestYear,

            series: soefinding.findingContent[soefinding.myRegionName].app1,
            chartOptions: options1
        }
    
    })
    

  

    // set up our second chart/table app, which is a stacked column
    var options2 = soefinding.getPercentStackedBarChartOptions()
    options2.xaxis.categories = soefinding.speciesGroups;
    options2.xaxis.title.text = "Fauna Group";
    options2.yaxis.title.text = "Proportion";
    options2.tooltip = {
		y: {
			formatter: function (val) {
				return val.toLocaleString() + " ha"
			}
		}
	};
    soefinding.app2 = new Vue({
        el: "#app2",
        components: {
            apexchart: VueApexCharts,
        },
        data: {
            regionName: soefinding.myRegionName,
            latestYear: soefinding.latestYear,

            series: soefinding.findingContent[soefinding.myRegionName].app2 ,
            chartOptions: options2,
        }
    }) 
    
    // set up our third chart/table app which is lines for each species

    var options3 = soefinding.getDefaultLineChartOptions(); 
    options3.xaxis.categories = soefinding.yearKeys;
    options3.xaxis.title.text = {text: "Year"}
    options3.yaxis.labels = {
        formatter: function (val, index) {
			return (val / 1000000) + "M"
		}
    }
    options3.yaxis.title.text = {text: "Hectares"}
    options3.chart.events = {
        legendClick: function(chartContext, seriesIndex, config) {
              var name = soefinding.speciesGroups[seriesIndex];
               soefinding.app4.series = soefinding.speciesPreClear[name]
               soefinding.app4.speciesName = name;
        }
    };
    soefinding.app3 = new Vue({
        el: "#app3",
        components: {
            apexchart: VueApexCharts,
        },
        data: {
            regionName: soefinding.myRegionName,
            series: soefinding.findingContent[soefinding.myRegionName].app3 ,
            chartOptions: options3,
        }
    }) 

    
    // set up our fourth chart/table which is a pie
    var options4 = soefinding.getDefaultPieChartOptions();
    options4.labels = soefinding.regionNames.slice(1);// remove leading "Queensland"
    soefinding.app4 = new Vue({
        el: "#app4",
        components: {
            apexchart: VueApexCharts,
        },
        data: {
            speciesName: "Birds",
            series: soefinding.speciesPreClear["Birds"], 
            chartOptions: options4
        }
    }) 
        
}


soefinding.onRegionChange = function() {


    // set the data series in each of the vue apps, for the current region
    this.app1.series = this.findingContent[this.myRegionName].app1
    this.app1.regionName = this.myRegionName
    this.app2.series = this.findingContent[this.myRegionName].app2
    this.app2.regionName = this.myRegionName
    this.app3.series = this.findingContent[this.myRegionName].app3
    this.app3.regionName = this.myRegionName
    
    // the pie chart is only displayed if it is queensland 
    var qldOnly = document.querySelector ("div.region-info.qld-only")
    qldOnly.style.display = soefinding.myRegionName == "Queensland" ? "block" : "none";    

   soefinding.loadFindingHtml();
}


    


