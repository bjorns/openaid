"use strict"

function Country(countryId, json) {
	this.countryId = countryId;
	this.json = json;
}

var countryCache = {}


function fetchCountry(countryId, data) {
	if (typeof countryId != 'number') {
		throw new Error("Expected countryId " + countryId + " to be number.");
	}
	if (data != undefined) {
		var country = new Country(countryId, data);
		countryCache[countryId] = country;
		return country;
	}
	if (countryCache[countryId] != undefined) {
		console.log("Using cached country " + countryCache[countryId].name())
		return countryCache[countryId];
	}
	console.log("Warning: re-fetching country for id " + countryId)
	return new Country(countryId, fetch('/api/v1/country?id=' + countryId)[0]);
}

Country.prototype.name = function() {
	if (this.json == undefined) {
		console.log("Undefined country data for id " + this.countryId)
		return countryId;
	}
	var ret = this.json['name_swe'];
	if (ret == undefined) {
		ret = this.json['name'];
	}
	if (ret == undefined) {
		ret = this.json['name_eng'];
	}
	return ret;
};

Country.prototype.contributions = function() {
	if (this._contributions == undefined) {
		this._contributions = createContributions(this);
	}
	return this._contributions;
};
