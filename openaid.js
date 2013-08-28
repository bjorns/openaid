"use strict"

// var lineChartData = {
// 	labels : ["January","February","March","April","May","June","July"],
// 	datasets : [
// 		{
// 			fillColor : "rgba(220,220,220,0.5)",
// 			strokeColor : "rgba(220,220,220,1)",
// 			pointColor : "rgba(220,220,220,1)",
// 			pointStrokeColor : "#fff",
// 			data : [65,59,90,81,56,55,40]
// 		},
// 		{
// 			fillColor : "rgba(151,187,205,0.5)",
// 			strokeColor : "rgba(151,187,205,1)",
// 			pointColor : "rgba(151,187,205,1)",
// 			pointStrokeColor : "#fff",
// 			data : [28,48,40,19,96,27,100]
// 		}
// 	]
// 		
// }
// var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Line(lineChartData);

var graph = null;

var contributions = function(response) {
	return response[0].extra_data.contributions_by_year
};

var sumContributions = function(year, ids, contributions) {
	var sum = 0;
	$(ids).each(function(i,id){
		var c = contributions[id];
		if (c!=undefined) {
			var o = c.outcome[year];
			if (o === '') {
				o = '0'
			}
			if (year == "2004" && c.name == "SEN Transportsystem") {
				
				console.log("=== " + c.name + "\t\t\t\t\t\t" + o)
				
			}
			sum += parseInt(o);
		}
	});
	return sum;
}

var totalPerYear = function(info, contributions) {
	var ret = {};
	$.each(info.extra_data.contributions_by_year, function(k,v){
		ret[k] = sumContributions(k, v, contributions)
	});
	return ret;
}

var values = function(object) {
	var ret = [];
	$.each(object, function(k,v){
		ret.push(v);
	});
	return ret;
}

var dataset = function(values, r, g, b) {
	return {
 		fillColor : "rgba(" + r + "," + g + "," + b + ",0.5)",
 		strokeColor : "rgba(" + r + "," + g + "," + b + ",1)",
	 	pointColor : "rgba(" + r + "," + g + "," + b + ",1)",
 		pointStrokeColor : "#fff",
 		data : values
	 };
}

var render = function(labels, datasets) {
	if (graph == null) {
 		graph = new Chart(document.getElementById("canvas").getContext("2d"));
 	}
	var lineChartData = {
		labels: labels,
		datasets : datasets
	};

 	graph.Line(lineChartData);
}

var fetch = function(url) {
	var info = {};
	var call = $.ajax({
		url: url,
		dataType: "json",
		async: false
	}).done(function(data) { 
		info = data
	});
	return info;	
}
var countryInfo = function(countryId) {
	return fetch('http://api.openaid.se/api/v1/country?id=' + countryId)[0];
}

var countryContributions = function(countryId) {
	var ret = {};
	$(fetch('http://api.openaid.se/api/v1/contribution?country=' + countryId)).each(function(i,v) {
		ret[v.id] = v
	});
	return ret;
}

var countrySelect = function(sel) {
	var country = $(sel).val();
	var info = countryInfo(country);
	$("h1").text(info['name_swe']);
	var contributions = countryContributions(country);
	var perYear = totalPerYear(info, contributions);
	render(Object.keys(perYear), [dataset(values(perYear))]);

}

$(document).ready(function() {
	var GLOBAL = 98;
	var IRAQ = 120;
	var info = countryInfo(IRAQ);
	$("h1").text(info['name_swe']);
	var contributions = countryContributions(IRAQ)
	var perYear = totalPerYear(info, contributions);
	render(Object.keys(perYear), [dataset(values(perYear))]);
})
