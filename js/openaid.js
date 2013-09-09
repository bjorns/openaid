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

var renderGraph = function(labels, dataset) {
	if (graph == null) {
 		graph = new Chart(document.getElementById("canvas").getContext("2d"));
 	}
	var lineChartData = {
		labels: labels,
		datasets : dataset
	};

 	graph.Line(lineChartData);
}


var clearTable = function(table) {
	table.find("tbody").html("")
}

var addRow = function(table, year, name, outcome) {
	table.append('<tr><td>' + year + '</td><td>' + name + '</td><td>' + outcome + '</td></tr>');
}

var countrySelect = function(sel) {
	try {
		$('.alert').hide();
		var countryId = $(sel).val();
		var country = createCountry(countryId);
		$("h1").text(country.name());
		var contributions = country.contributions();
		var perYear = contributions.totalPerYear()
		renderGraph(Object.keys(perYear), [dataset(values(perYear), 100, 100, 255)]);
		contributions.renderAsTable();
	} catch (e) {
		$('.alert').text(e.message);
		$('.alert').show();
		throw e;
	}
}

function isInt(value) { 
    return !isNaN(parseInt(value,10)) && (parseFloat(value,10) == parseInt(value,10)); 
}

var wash = function(x) {
	return isInt(x) ? x : 0;
}

$(document).ready(function() {
	try {
		var GLOBAL = 98;
		var IRAQ = 120;
		var AFGHANISTAN = 1;
		var country = createCountry(AFGHANISTAN);
		$("h1").text(country.name());
		var contributions = country.contributions();
		var _totalPerYear = contributions.totalPerYear();
		renderGraph(Object.keys(_totalPerYear), [dataset(values(_totalPerYear), 100, 100, 255)]);

		contributions.renderAsTable();
	} catch (e) {
		$('.alert').text(e.message);
		$('.alert').show();
		throw e;
	}

})
