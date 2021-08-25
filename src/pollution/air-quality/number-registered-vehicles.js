"use strict"

document.addEventListener("DOMContentLoaded", function () {

    const yearKeys = soefinding.findingJson.meta.fields.slice(2)
    const latestYear = yearKeys[yearKeys.length - 1]

    const yearTotals = {}

    yearKeys.forEach(y => yearTotals[y] = 0)

    // group by vehicle type
    const vehicles = {}
    soefinding.findingJson.data.forEach(function (d) {
        if (!vehicles[d["Vehicle Type"]]) {
            const vehicleYearTotals = {}
            yearKeys.forEach(y => vehicleYearTotals[y] = 0)
            vehicles[d["Vehicle Type"]] = { 
                data: [], 
                vehicleYearTotals: vehicleYearTotals
            }
        }
        
        vehicles[d["Vehicle Type"]].data.push(d)
        yearKeys.forEach(y => {
            vehicles[d["Vehicle Type"]].vehicleYearTotals[y] += d[y]
            yearTotals[y] += d[y]
        })
        
        
    })

    // chart 1. proportion of registrations
    const latestProportionseries = Object.keys(vehicles).map(v => {
        return vehicles[v].vehicleYearTotals[latestYear]
    })

    // create the vue instance for first chart, our column chart
    const options1 = soefinding.getDefaultPieChartOptions()
    // the pie charts uses labels, but the table vue is looking for categories
    options1.labels = Object.keys(vehicles)
    options1.tooltip = {
        y: {
            formatter: (val, options) => {
                const percent = options.globals.seriesPercent[options.seriesIndex][0]
                return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
            }
        }
    }
    options1.xaxis.categories = ["Vehicle type", "Registrations"] // not needed for chart, but vue uses them for table headings

    soefinding.state.chart1 = {
        options: options1,
        series: latestProportionseries,
        chartactive: true,
    };

    // chart 2 yearly proportion of vehicle type
    const yearlyProportionSeries = Object.keys(vehicles).map( v => {
        return {
            name: v,
            data: yearKeys.map(y => {
                return vehicles[v].vehicleYearTotals[y] / yearTotals[y] * 100.0
                })
        }
    })
    const options2 = soefinding.getDefaultLineChartOptions()
    options2.xaxis.categories = yearKeys
    options2.xaxis.title.text = "Year"
    options2.yaxis.title.text = "Registered Vehicles %"
    options2.yaxis.labels.formatter = val =>  `${Math.round(val)}`
    options2.tooltip.y = {
        formatter: function (val) {
            return `${val.toFixed(2)}%`;
        }
    }

    soefinding.state.chart2 = {
        options: options2,
        series: yearlyProportionSeries,
        chartactive: true,
    };


    // chart 3 yearly number of vehicle type
    const yearlyNumberSeries = Object.keys(vehicles).map( v => {
        return {
            name: v,
            data: yearKeys.map(y => {
                return vehicles[v].vehicleYearTotals[y]
                })
        }
    })
    const options3 = JSON.parse(JSON.stringify(options2))
    options3.xaxis.title.text = "Year"
    options3.yaxis.title.text = "Registrations"
    options3.yaxis.labels.formatter = val =>  `${Math.round(val/1000000)}M`
    options3.tooltip.y = {
        formatter: function (val) {
            return `${val.toLocaleString()}`;
        }
    }

    soefinding.state.chart3 = {
        options: options3,
        series: yearlyNumberSeries,
        chartactive: true,
    };


    // chart 4 proportion of electric
    const electricProportionseries = Object.keys(vehicles).map(v => {
        const electric = vehicles[v].data.filter(d => d["Fuel Type"].includes("Electric"))
        const count = electric.reduce( (acc, curr) => { return acc + curr[latestYear]}, 0)
        return count 
    })

    // create the vue instance 
    const options4 = JSON.parse(JSON.stringify(options1))
    // the pie charts uses labels, but the table vue is looking for categories
    options4.labels = Object.keys(vehicles)
    options4.xaxis.categories[1] = "Electrified Vehicle Registrations"
    options4.tooltip = {
        y: {
            formatter: (val, options) => {
                const percent = options.globals.seriesPercent[options.seriesIndex][0]
                return `${val.toLocaleString()} (${percent.toFixed(1)}%)`
            }
        }
    }

    soefinding.state.chart4 = {
        options: options4,
        series: electricProportionseries,
        chartactive: true,
    };


    // chart 5 all vehicles by fuel type
    // group by fuel Type
    const fuelTypes = {}
    soefinding.findingJson.data.forEach(function (d) {
        if (!fuelTypes[d["Fuel Type"]])
            fuelTypes[d["Fuel Type"]] = {rawData: [], data: []}
        fuelTypes[d["Fuel Type"]].rawData.push(d)
    })
    Object.keys(fuelTypes).forEach(function(ftkey) {
        // eg 1st iter is diesel
        yearKeys.forEach(function(year) {
            const sum = fuelTypes[ftkey].rawData.reduce( function(acc, d) { 
                return acc + d[year]
            }, 0)
            fuelTypes[ftkey].data.push(sum)
        })
    })

    const fuelTypeSeries = Object.keys(fuelTypes).map(ft => {
        return {
            name: ft,
            data: fuelTypes[ft].data
        }
    })
    console.log(fuelTypeSeries)
    const options5 = soefinding.getDefaultBarChartOptions()
    options5.chart.stacked = true
    options5.xaxis.categories = yearKeys
    options5.xaxis.title.text = "Year"
    options5.yaxis.title.text = "Registrations"
    //options5.yaxis.labels.formatter = val =>  `${Math.round(val/1000000)}M`
    options5.tooltip.y = {
        formatter: val => `${val.toLocaleString()}`
    }

    soefinding.state.chart5 = {
        options: options5,
        series: fuelTypeSeries,
        chartactive: true,
        extra: "extra checkboxes and shit"
    };






    new Vue({
        el: "#chartContainer",
        data: soefinding.state,
        computed: {
            heading1: () => `Proportion of vehicle registrations in ${latestYear}`,
            heading2: () => "Proportion (%) of registered vehicles by type",
            heading3: () => "Number of registered vehicles by vehicle type",
            heading4: () => `Proportion of electrified vehicle registrations in ${latestYear}`,
            heading5: () => "Number of registered vehicles by fuel type",
        },
        methods: {
            formatter1: val => val.toLocaleString(), //reüse for 3, 4, 5
            formatter2: val => val.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}) 
        }
    })
})

