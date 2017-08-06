document.addEventListener('DOMContentLoaded', function () {
  // do your setup here
  console.log('Initialized app')
})

var d3 = require('d3')
var Topojson = require('topojson')
var Datamaps = require('datamaps')
var Tabletop = require('tabletop')

var map = null

const countryDataUrl = 'https://docs.google.com/spreadsheets/d/1PW_2A7786oLaSszO1wsHv-J59yn7ov7dgp9OOehSSNI/pubhtml'

// var key = '1PW_2A7786oLaSszO1wsHv-J59yn7ov7dgp9OOehSSNI'
// //the url for jQuery and D3
// var url = "https://spreadsheets.google.com/feeds/list/" + key + "/od6/public/values?alt=json";

const processCountryData = function (data, tabletop) {
  var sheet1 = data['Sheet1']
  console.log(data['Sheet1'])
  var countryData = {}
  sheet1.elements.forEach(function (o) {
    countryData[o.id] = o
  })
  drawmap(countryData)
}

const drawmap = function (countryData) {
  map = new Datamaps({
    element: document.getElementById('container'),
    responsive: true,
    fills: {
      'decriminalised': '#e41a1c',
      'illegal': '#377eb8',
      '#N/A': '#4daf4a',
      'medical': '#984ea3',
      'tolerated': '#ff7f00',
      defaultFill: '#EDDC4E'
    },
    data: countryData,
    geographyConfig: {
      popupTemplate: function (geo, data) {
        return `<div class="hoverinfo"><strong> ${data.name} <br/> Legality: ${data.fillKey} </strong></div>`
      }
    }
  })
}

Tabletop.init({
  key: countryDataUrl,
  callback: processCountryData
})
