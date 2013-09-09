"use strict"

var fetch = function(url) {
	var info = {};
	var call = $.ajax({
		url: url,
		dataType: "json",
		async: false
	}).done(function(data) { 
		info = data
	}).fail(function(data, message, error) {
		throw new Error("Failed to fetch data on " + url + ", cause: " + data.responseText);
	});
	return info;	
}


/**
 * TODO: Make part of class?
 */
var sumContributions = function(year, ids, contributions) {
	var sum = 0;
	$(ids).each(function(i,id){
		var c = contributions[id];
		if (c!=undefined) {
			var o = c.outcome[year];
			if (o === '') {
				o = '0'
			}
			sum += parseInt(o);
		}
	});
	return sum;
}

var createContributions = function(country) {
	return new Contributions(country, fetch('http://api.openaid.se/api/v1/contribution?country=' + country.countryId));
}



function Contributions(country, json) {
	var lastYear = {};
	$(json).each(function(i,v) {
		lastYear[v.id] = v
	});
	this.lastYear = lastYear;

	var perYear = {};
	$.each(country.json.extra_data.contributions_by_year, function(k,v){
		perYear[k] = sumContributions(k, v, lastYear)
	});
	this.perYear = perYear;
}

Contributions.prototype.totalPerYear = function() {
	return this.perYear;
}

Contributions.prototype.renderAsTable = function() {
	var table = $("#contributions");
	var contributions = this.lastYear;
	var compareOutcomes = function(a, b) {
		var ca = contributions[a];
		if (ca == undefined) {
			return 1;
		}

		var cb = contributions[b];
		if (cb == undefined){
			return -1;
		}
		return wash(cb.outcome_total) - wash(ca.outcome_total);
	};

	var sorted = Object.keys(this.lastYear)
	sorted.sort(compareOutcomes);
	clearTable(table)
	$.each(sorted.slice(0,10), function(i,id) {
		var c = contributions[id];
		if (c != undefined)
			addRow(table, c.years != undefined ? c.years[0] : "", c.name, c.outcome_total);
	});
};
