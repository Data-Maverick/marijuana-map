import * as d3 from 'd3';
var topojson = require('topojson');
var _ = require('lodash');
var $ = require('jquery');

var map = null;
var countryData = {};

const infoTemplate = _.template($("#infoTemplate").html());

const processCountryData = function (data, keys, us_states, india_states, oz_states) {
	// console.log(data);
	var fills = {};
	var countryData = {};
	var stateData = {
		us: {},
		india: {},
		oz: {}
	};
	keys.forEach(key => {
		fills[key.key] = key.colour;
	});
	data.forEach(function (o) {
		o.color = fills[o.fillKey];
		if (o.keyname === "#N/A")
			o.keyname = "Unknown";
		countryData[o.id] = o;
	});
	us_states.forEach(state => {
		state.color = fills[state.fillKey];
		stateData.us["US-" + state.id] = state;
	});
	india_states.forEach(state => {
		state.color = fills[state.fillKey];
		stateData.india[state.id] = state;
	});
	oz_states.forEach(state => {
		state.color = fills[state.fillKey];
		stateData.oz[state.id] = state;
	});
	drawmap(countryData, stateData, fills);
	drawKey(keys);
};

var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.text("a simple tooltip");

var tooltipText = d => {
	// console.log(d);
	return `<strong class="sans">${d.name}</strong><br>Status: ${d.keyname}`;
};

const drawmap = function (countryData, stateData, fills) {
	// console.log(stateData);
	var svg = d3.select("#map-container").append("svg");
	var width = $("svg").parent().width();
	var height = $("svg").parent().height();
	$("svg").attr("width", "100%");
	$("svg").attr("height", height + "px");
	// console.log(width, height);
  	var projection = d3.geoMercator()
		.scale(width / 2 / Math.PI)
		// .scale(100)
		.translate([width / 2, height / 2]);
	var path = d3.geoPath()
		.projection(projection);
	var url = "output.json";
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
				if (countryData[d.properties.iso_a3].fillKey === "mixed")
					return true;
				tooltip.html(tooltipText(countryData[d.properties.iso_a3]));
				return tooltip.style("visibility", "visible");
			})
			.on("mousemove", function(){return tooltip.style("top", (event.pageY + 20)+"px").style("left",(event.pageX - 30)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
			;
		g.select("#ATA").remove();
		var us_states = topojson.feature(world, world.objects.ne_110m_admin_1_states_provinces).features;
		g.selectAll(".state")
			.data(us_states)
			.enter().insert("path", ".graticule")
			.attr("class", "state")
			.attr("d", path)
			.attr("data-state", d => (d.properties.iso_3166_2))
			.attr("id", d => (d.properties.iso_3166_2))
			.style("fill", function(d, i) { 
				if (stateData.us[d.properties.iso_3166_2]) {
					return stateData.us[d.properties.iso_3166_2].color; 
				}
			})
			.on("mouseover", d => {
				tooltip.html(tooltipText(stateData.us[d.properties.iso_3166_2]));
				return tooltip.style("visibility", "visible");
			})
			.on("mousemove", function(){return tooltip.style("top", (event.pageY + 20)+"px").style("left",(event.pageX - 30)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
			.on("click", d=> {
				$("#info").html(infoTemplate(countryData.USA));
				$("#info-container").removeClass("hide");
			})
			;
		var india_states = topojson.feature(world, world.objects.india_states).features;
		g.selectAll(".in-state")
			.data(india_states)
			.enter().insert("path", ".graticule")
			.attr("class", "state")
			.attr("d", path)
			.attr("data-state", d => (d.properties.ST_NAME))
			.attr("id", d => (d.properties.ST_NAME))
			.style("fill", function(d, i) {
				if (stateData.india[d.id]) {
					return stateData.india[d.id].color; 
				}
			})
			.on("mouseover", d => {
				tooltip.html(tooltipText(stateData.india[d.id]));
				return tooltip.style("visibility", "visible");
			})
			.on("mousemove", function(){return tooltip.style("top", (event.pageY + 20)+"px").style("left",(event.pageX - 30)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
			.on("click", d=> {
				$("#info").html(infoTemplate(countryData.IND));
				$("#info-container").removeClass("hide");
			})
			;
		var oz_states = topojson.feature(world, world.objects["australia-states"]).features;
		// console.log(oz_states);
		// var a = console.log(oz_states.map(state => {
		// 	return `${state.properties.code}\t${state.properties.name}`;
		// }).join("\n"));
		g.selectAll(".au-state")
			.data(oz_states)
			.enter().insert("path", ".graticule")
			.attr("class", "state")
			.attr("d", path)
			.attr("data-state", d => (d.properties.code))
			.attr("id", d => (d.properties.code))
			.style("fill", function(d, i) {
				// console.log(d);
				if (stateData.oz[d.properties.code]) {
					return stateData.oz[d.properties.code].color; 
				}
			})
			.on("mouseover", d => {
				tooltip.html(tooltipText(stateData.oz[d.properties.code]));
				return tooltip.style("visibility", "visible");
			})
			.on("mousemove", function(){return tooltip.style("top", (event.pageY + 20)+"px").style("left",(event.pageX - 30)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");})
			.on("click", d=> {
				$("#info").html(infoTemplate(countryData.AUS));
				$("#info-container").removeClass("hide");
			})
			;
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
	// console.log('Initialized app');
	var data = null;
	var keys = null;
	var us_states = null;
	var india_states = null;
	var oz_states = null;
	loadCSV("cannabis-data.csv")
	.then(result => {
		data = result;
		return loadCSV("cannabis-us-states.csv");
	})
	.then(result => {
		us_states = result;
		return loadCSV("cannabis-australia-states.csv");
	})
	.then(result => {
		oz_states = result;
		return loadCSV("cannabis-india-states.csv");
	})
	.then(result => {
		india_states = result;
		return loadCSV("cannabis-keys.csv");
	})
	.then(result => {
		keys = result;
		processCountryData(data, keys, us_states, india_states, oz_states);
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