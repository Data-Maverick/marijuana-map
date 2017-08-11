import * as d3 from 'd3';
var topojson = require('topojson');
var _ = require('lodash');
var $ = require('jquery');

var map = null;
var countryData = {};

const infoTemplate = _.template($("#infoTemplate").html());

const processCountryData = function (data, keys) {
	console.log(data);
	var fills = {};
	keys.forEach(key => {
		fills[key.key] = key.colour;
	});
	data.forEach(function (o) {
		o.color = fills[o.fillKey];
		countryData[o.id] = o;
	});
	console.log(countryData);
	drawmap(countryData, fills);
	drawKey(keys);
};

var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.text("a simple tooltip");

var tooltipText = d => {
	console.log(d);
	return `<strong class="sans">${d.name}</strong><br>Status: ${d.keyname}`;
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
		// .scale(100)
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
			})
			.on("mouseover", d => {
				tooltip.html(tooltipText(countryData[d.properties.iso_a3]));
				return tooltip.style("visibility", "visible");
			})
			.on("mousemove", function(){return tooltip.style("top", (event.pageY + 20)+"px").style("left",(event.pageX - 30)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
			;
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

var loadCSV = csv => {
	return new Promise((resolve, reject) => {
		d3.csv(csv, (err, data) => {
			if (err)
				return reject(err);
			resolve(data);
		});
	});
};

document.addEventListener('DOMContentLoaded', function () {
	// do your setup here
	console.log('Initialized app');
	var data = null;
	var keys = null;
	loadCSV("cannabis-data.csv")
	.then(result => {
		data = result;
		return loadCSV("cannabis-keys.csv");
	})
	.then(result => {
		keys = result;
		processCountryData(data, keys);
	})
	.catch(err => {
		console.error(err);
	});
});

$(function() {
	$("#info-close").on("click", (e) => {
		$("#info-container").addClass("hide");
	});

	$("#sources").on("click", e => {
		e.preventDefault();
		let template = _.template($("#sourceTemplate").html());
		$("#info").html(template());
		$("#info-container").removeClass("hide");
	});
});