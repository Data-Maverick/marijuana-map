import * as d3 from 'd3';
var topojson = require('topojson');
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
		o.color = fills[o.fillKey];
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
		// .scale(width / 2 / Math.PI)
		.scale(100)
		.translate([width / 2, height / 2]);
	var path = d3.geoPath()
		.projection(projection);
	var url = "ne_110m_admin.json";
	var g = svg.append("g");

	d3.json(url, function(err, world) {
		var countries = topojson.feature(world, world.objects.ne_110m_admin_0_countries).features;
		g.selectAll(".country")
			.data(countries)
			.enter().insert("path", ".graticule")
			.attr("class", "country")
			.attr("d", path)
			.attr("data-country", d => (d.properties.iso_a3))
			.attr("id", d => (d.properties.iso_a3))
			.style("fill", function(d, i) { 
				if (countryData[d.properties.iso_a3]) {
					return countryData[d.properties.iso_a3].color; 
				}
			})
			.on("click", d=> {
				$("#info").html(infoTemplate(countryData[d.properties.iso_a3]));
				$("#info-container").removeClass("hide");
			});
		g.select("#ATA").remove();
	});
	var zoom = d3.zoom().scaleExtent([1, 5]).on("zoom", zoomed);
	svg.call(zoom);
	function zoomed() {
		g.style("stroke-width", 1 / d3.event.transform.k + "px");
		g.attr("transform", d3.event.transform);
	}
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

$(function() {
	$("#info-close").on("click", (e) => {
		$("#info-container").addClass("hide");
	});
});