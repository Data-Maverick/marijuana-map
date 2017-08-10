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
  map = new Datamaps({
	element: document.getElementById('map'),
	responsive: true,
	fills,
	data: countryData,
	geographyConfig: {
	  	popupTemplate: function (geo, data) {
			return `<div class="hoverinfo"><h4>${data.name}</h4> <strong>Legality:</strong> ${data.keyname}<br> ${ (data.price) ? "<strong>Price:</strong> US$" + Number(data.price).toFixed(2) + "<br>" : '' } ${ (data.prevelance) ? "<strong>Prevalence:</strong> " + data.prevelance + "%<br>" : '' } </div>`;
		}
	},
	done: (datamap) => {
		datamap.svg.selectAll(".datamaps-subunit").on("click", (d) => {
			console.log(countryData[d.id]);
			$("#info").html(infoTemplate(countryData[d.id]));
		});
		// datamap.svg.call(d3.zoom().on('zoom', redraw));
		// function redraw () {
		// 	datamap.svg.attr('transform', d3.event.transform);
		// }
	}
  });
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