"use strict"

function Country(countryId, json) {
	this.countryId = countryId;
	this.json = json;	
}

function createCountry(countryId) {
	return new Country(countryId, fetch('http://api.openaid.se/api/v1/country?id=' + countryId)[0]);
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
