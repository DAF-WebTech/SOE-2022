"use strict";document.addEventListener("DOMContentLoaded",function(){const years=soefinding.findingJson.meta.fields.slice(2);const latest=years.at(-1);const qldArray=[];for(let i=0;i<7;++i){const qldObj={Bioregion:"Queensland","Clearing type":soefinding.findingJson.data[i]["Clearing type"]};years.forEach(y=>qldObj[y]=0);qldArray.push(qldObj)}soefinding.findingJson.data.sort(function(a,b){return b[latest]-a[latest]});const regions=new Map;soefinding.findingJson.data.forEach(d=>{if(!regions.has(d.Bioregion))regions.set(d.Bioregion,[d]);else regions.get(d.Bioregion).push(d);const item=qldArray.find(q=>q["Clearing type"]==d["Clearing type"]);years.forEach(y=>item[y]+=d[y])});qldArray.sort(function(a,b){return b[latest]-a[latest]});regions.set("Queensland",qldArray);for(let[region,data]in regions){}for(let[region,data]of regions){soefinding.findingContent[region]={series1:data.map(d=>d[latest]),labels:data.map(d=>d["Clearing type"])};soefinding.findingContent[region].series2=data.map(d=>{return{name:d["Clearing type"].split(" "),data:years.map(y=>d[y])}});const totalItem={Bioregion:region,"Clearing type":"total"};years.forEach(y=>totalItem[y]=0);data.forEach(d=>{years.forEach(y=>{totalItem[y]+=d[y]})});soefinding.findingContent[region].series3=[{name:"Hectares",data:years.map(y=>totalItem[y])}]}const options1=soefinding.getDefaultPieChartOptions();options1.chart.id="chart1";options1.labels=soefinding.findingContent[soefinding.state.currentRegionName].labels;options1.xaxis.categories=["Clearing type","Hectares"];options1.tooltip={y:{formatter:(val,options)=>{const percent=options.globals.seriesPercent[options.seriesIndex][0];return`${val.toLocaleString()} ha. (${percent.toFixed(1)}%)`}}};soefinding.state.chart1={series:soefinding.findingContent[soefinding.state.currentRegionName].series1,options:options1,chartactive:true};const options2=soefinding.getDefaultLineChartOptions();options2.chart.id="chart2";options2.xaxis.categories=years.map(y=>y.replace("-","\u2013"));options2.xaxis.title.text="Year";options2.yaxis.title.text="Hectares";options2.yaxis.labels.formatter=val=>{if(val>=1e6)return`${val/1e6}M`;if(val>=1e3)return`${val/1e3}K`;return val};options2.tooltip.y={formatter:val=>`${val.toLocaleString()} ha.`};soefinding.state.chart2={series:soefinding.findingContent[soefinding.state.currentRegionName].series2,options:options2,chartactive:true};soefinding.state.chart3={series:soefinding.findingContent[soefinding.state.currentRegionName].series3,options:options2,chartactive:true};new Vue({el:"#chartContainer",data:soefinding.state,computed:{heading1:()=>{let retVal=`Proportion of replacement landcover (clearing type) in threatened ${soefinding.biota} habitat`;if(soefinding.state.currentRegionName!="Queensland"){retVal+=" in ";if(!soefinding.state.currentRegionName.startsWith("South")&&!soefinding.state.currentRegionName.startsWith("Cape"))retVal+=" the ";retVal+=`${soefinding.state.currentRegionName}`}retVal+=`, ${latest.replace("-","\u2013")}`;return retVal},heading2:()=>{let retVal=`Trends in replacement landcover (clearing type) in threatened ${soefinding.biota} habitat`;if(soefinding.state.currentRegionName!="Queensland"){retVal+=" in ";if(!soefinding.state.currentRegionName.includes("Queensland"))retVal+=" the ";retVal+=`${soefinding.state.currentRegionName}`}retVal+=`, ${latest.replace("-","\u2013")}`;return retVal},heading3:()=>{let retVal=`Trend in total replacement landcover (clearing type) in threatened ${soefinding.biota} habitat`;if(soefinding.state.currentRegionName!="Queensland"){retVal+=" in ";if(!soefinding.state.currentRegionName.includes("Queensland"))retVal+=" the ";retVal+=`${soefinding.state.currentRegionName}`}retVal+=`, ${latest.replace("-","\u2013")}`;return retVal}},methods:{formatter1:val=>val.toLocaleString()}});window.soefinding.onRegionChange=function(){soefinding.state.chart1.series=this.findingContent[this.state.currentRegionName].series1;soefinding.state.chart1.options.labels=this.findingContent[this.state.currentRegionName].labels;soefinding.state.chart2.series=this.findingContent[this.state.currentRegionName].series2;soefinding.state.chart3.series=this.findingContent[this.state.currentRegionName].series3;soefinding.loadFindingHtml()}});
//# sourceMappingURL=land-clearing-impact.js.map