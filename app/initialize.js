var d3 = require('d3');
var Topojson = require('topojson');
var Datamaps = require('datamaps');
var Tabletop = require('tabletop');
var _ = require('lodash');
var $ = require('jquery');

var map = null;
var countryData = {};

const countryDataUrl = 'https://docs.google.com/spreadsheets/d/1PW_2A7786oLaSszO1wsHv-J59yn7ov7dgp9OOehSSNI/pubhtml';
const infoTemplate = _.template($("#infoTemplate").html());

const processCountryData = function (data, tabletop) {
	var sheet1 = data.Sheet1;
	console.log(data.Sheet1);
	var fills = {};
	data.Keys.elements.forEach(key => {
		fills[key.key] = key.colour;
	});
	var keys = data.Keys.elements;
	sheet1.elements.forEach(function (o) {
		countryData[o.id] = o;
	});
	console.log(countryData);
	drawmap(countryData, fills);
	drawKey(keys);
};

const drawmap = function (countryData, fills) {
	var svg = d3.select("#map-container").append("svg");
	var width = $("svg").parent().width();
	var height = $("svg").parent().height();
	$("svg").attr("width", "100%");
	$("svg").attr("height", height + "px");
	console.log(width, height);
  	var projection = d3.geoMercator()
		.scale(width / 2 / Math.PI)
		//.scale(100)
		.translate([width / 2, height / 2]);
	var path = d3.geoPath()
		.projection(projection);
	var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
	var g = svg.append("g");
	d3.json(url, function(err, geojson) {
		g.append("path")
			.attr("d", path(geojson));
	});
	var zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);
	svg.call(zoom);
		
	// 	
	function zoomed() {
		console.log("Zoom");
		g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
		// g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
		g.attr("transform", d3.event.transform); // updated for d3 v4
	}
	// map = new Datamaps({
	// element: document.getElementById('map'),
	// responsive: true,
	// fills,
	// data: countryData,
	// geographyConfig: {
	//   	popupTemplate: function (geo, data) {
	// 		return `<div class="hoverinfo"><h4>${data.name}</h4> <strong>Legality:</strong> ${data.keyname}<br> ${ (data.price) ? "<strong>Price:</strong> US$" + Number(data.price).toFixed(2) + "<br>" : '' } ${ (data.prevelance) ? "<strong>Prevalence:</strong> " + data.prevelance + "%<br>" : '' } </div>`;
	// 	}
	// },
	// done: (datamap) => {
	// 	function zoomed() {
	// 		console.log("Zoom");
	// 		// datamap.svg.select(".datamaps-subunits").attr("transform", d3.event.transform);
	// 		// gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
	// 		// gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
	// 	}
	// 	var zoom = d3.zoom()
	// 	    .scaleExtent([1, 8])
	// 	    .on("zoom", zoomed);
	// 	datamap.svg.selectAll(".datamaps-subunit").on("click", (d) => {
	// 		console.log(countryData[d.id]);
	// 		$("#info").html(infoTemplate(countryData[d.id]));
	// 	});
	// 	datamap.svg.call(zoom);
	// 	// datamap.svg.call(d3.zoom().on('zoom', redraw));
	// 	// function redraw () {
	// 	// 	datamap.svg.attr('transform', d3.event.transform);
	// 	// }
	// }
	// });
};

const drawKey = keys => {
	let template = _.template($('#legendKeyTemplate').html());
	keys.forEach(key => {
		$('#legend').append(template({key}));
	});
};

Tabletop.init({
	key: countryDataUrl,
	callback: processCountryData
});

document.addEventListener('DOMContentLoaded', function () {
	// do your setup here
	console.log('Initialized app');
});