
var fetch = function(url) {
	var info = {};
	var call = $.ajax({
		url: url,
		dataType: "json",
		async: false
	}).done(function(data) { 
		info = data
	}).fail(function(data, message, error) {
		throw new Error("Failed to fetch data on " + url + " because " + data.status + ": " + data.responseText);
	});
	return info;	
}

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

	ret = this.json['name_swe'];
	if (ret == undefined) {
		ret = this.json['name'];
	}
	if (ret == undefined) {
		ret = this.json['name_eng'];
	}
	return ret;
};
