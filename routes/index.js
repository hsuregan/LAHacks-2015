var express = require('express');
var router = express.Router();
var http = require("http");
var cheerio = require('cheerio');
var tabletojson = require('tabletojson');
var request = require("request")

/* GET home page. */
router.get('/', function(req, res) {
  	res.render('index', { title: 'Express' });
});

router.get ('/:from/:to', function(req, res) {
	var HOME = {
		city: req.params.from.split(', ')[0],
		state: req.params.from.split(', ')[1],
		country: req.params.from.split(', ')[2],
	}
	var DESTINATION = {
		city: req.params.to.split(', ')[0],
		state: req.params.to.split(', ')[1],
		country: req.params.to.split(', ')[2],
	}
	if (HOME.country == 'United States') {
		HOME.country = 'USA'
	}
	if (DESTINATION.country == 'United States') {
		DESTINATION.country = 'USA'
	}
	var currency;
	var currencyurl = 'http://www.science.co.il/International/Currency-codes.asp'
	tabletojson.convertUrl(currencyurl).then(function(tablesAsJson) {
		currency = tablesAsJson[1];
		for(i in currency) {
			if (HOME.country == currency[i].Country) {
				HOME.currency = currency[i].Code
			}
			if (DESTINATION.country == currency[i].Country) {
				DESTINATION.currency = currency[i].Code
			}
		}
		request({url: 'http://localhost:3000/city/info/' + DESTINATION.city, json: true}, function(err, response, json) {
			if (err) {
				throw err;
			}
			for (i in json) {
				if (json[i].Property === 'dbpedia-owl:abstract') {
					DESTINATION.abstract = json[i].Value.substring(0, 1000)
				}
				if (json[i].Property === 'dbpedia-owl:elevation') {
					DESTINATION.elevation = json[i].Value
				}
				if (json[i].Property === 'dbpedia-owl:populationDensity') {
					DESTINATION.population_density = json[i].Value
				}
				if (json[i].Property === 'dbpedia-owl:populationTotal') {
					DESTINATION.population_total = json[i].Value
				}
				if (json[i].Property === 'dbpedia-owl:thumbnail') {
					DESTINATION.photo = json[i].Value
				}
				if (json[i].Property === 'dbpprop:imageFlag') {
					DESTINATION.flag_photo = 'http://en.wikipedia.org/wiki/' + DESTINATION.city.replace(' ', '_') + '##/media/File:' json[i].Value.replace(' ', '_')
				}
				if (json[i].Property === 'dbpprop:postalCode') {
					DESTINATION.postal_code = json[i].Value
				}
				if (json[i].Property === 'dbpprop:website') {
					DESTINATION.website = json[i].Value
				}
				if (json[i].Property === 'dbpprop:timezone') {
					DESTINATION.timezone = json[i].Value
				}
				if (json[i].Property === 'geo:lat') {
					DESTINATION.latitude = json[i].Value
				}
				if (json[i].Property === 'geo:long') {
					DESTINATION.longitude = json[i].Value
				}
			}
			res.render('cards', {
				from: HOME,
				to: DESTINATION
			});
		});
	});
});

router.get('/currency', function(req, res) {
	var url = 'http://www.science.co.il/International/Currency-codes.asp'
	tabletojson.convertUrl(url).then(function(tablesAsJson) {
		var currency = tablesAsJson[1];
		res.send(currency)
	})
})

router.get('/city/info/:cityname', function(req, res) {
	city = req.params.cityname.replace(' ', '_');
	var url = 'http://dbpedia.org/page/' + city
	tabletojson.convertUrl(url).then(function(tablesAsJson) {
		var info = tablesAsJson[0];
		res.send(info)
	})
})

module.exports = router;