# The Daily Maverick Marijuana Map

This map shows the legality of marijuana around the world

[View it online now](https://j-norwood-young.github.io/marijuana-map/public/)

## Sources
	* [Wikipedia - Legality of Cannabis by Country](https://en.wikipedia.org/wiki/Legality_of_cannabis_by_country)
	* [UNODC Statistics Portal](https://data.unodc.org/)
	* [Natural Earth](http://www.naturalearthdata.com/)
	* [ISO-3166 Countries with Regional Codes](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes)

## Data
      [Google Sheets](https://docs.google.com/spreadsheets/d/11oRq43YWtXMlfPj459huG-0evvTd5COHpqWhpeOWPbw/edit?usp=sharing)
      
## Tech

This project was built using [D3.js](https://d3js.org/), using [Brunch](http://brunch.io/) as a build tool.

## Errata

Deciding on the legality of cannabis in every country in the world is a complicated task, and all of the maps we examined split the definitions differently, and did not always agree with one another. Despite our best efforts to research a country's legal status for cannabis, the information we examined could have been incorrect. If you disagree with one of our categorisations, please let us know [Github Issues](https://github.com/j-norwood-young/marijuana-map/issues). Any corrections we make post-publication will be noted here.

# Brunch app

This is a HTML5 application, built with [Brunch](http://brunch.io).

## Getting started
* Install (if you don't have them):
    * [Node.js](http://nodejs.org): `brew install node` on OS X
    * [Brunch](http://brunch.io): `npm install -g brunch`
    * Brunch plugins and app dependencies: `npm install`
* Run:
    * `npm start` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `npm run build` — builds minified project for production
* Learn:
    * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
    * Place static files you want to be copied from `app/assets/` to `public/`.
    * [Brunch site](http://brunch.io), [Getting started guide](https://github.com/brunch/brunch-guide#readme)
