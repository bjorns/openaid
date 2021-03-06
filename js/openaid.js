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

var countrySelectInternal = function(countryId) {
	try {
		$('.alert').hide();
		var country = fetchCountry(countryId, undefined);
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

var countrySelect = function(sel) {
	var countryId = parseInt($(sel).val());
	countrySelectInternal(countryId)
}

function isInt(value) {
    return !isNaN(parseInt(value,10)) && (parseFloat(value,10) == parseInt(value,10));
}

var wash = function(x) {
	return isInt(x) ? x : 0;
}

var populateCountrySelect = function() {
	var data = fetch('/api/v1/country')
	var select = $('select#country');
	$(data).each(function(i,v){
		var c = fetchCountry(parseInt(v.id), v);
		select.append($("<option></option>").attr("value",v.id).text(c.name()));
	});
}

$(document).ready(function() {
	$('#canvas').click(function(e){
		var x = e.offsetX;
		var y = e.offsetY;
		console.log("Click at " + x + ":" + y);
	});


	var GLOBAL = 98;
	var IRAQ = 120;
	var AFGHANISTAN = 1;

	populateCountrySelect();


	countrySelectInternal(AFGHANISTAN)
})
