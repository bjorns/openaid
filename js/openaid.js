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

var totalPerYear = function(country, contributions) {
	var ret = {};
	$.each(country.json.extra_data.contributions_by_year, function(k,v){
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

var countryContributions = function(countryId) {
	var ret = {};
	$(fetch('http://api.openaid.se/api/v1/contribution?country=' + countryId)).each(function(i,v) {
		ret[v.id] = v
	});
	return ret;
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
		var contributions = countryContributions(countryId);
		var perYear = totalPerYear(country, contributions);
		renderGraph(Object.keys(perYear), [dataset(values(perYear), 100, 100, 255)]);
		renderContributionsTable(country, contributions);
	} catch (e) {
		$('.alert').text(e.message);
		$('.alert').show();
	}
}

function isInt(value) { 
    return !isNaN(parseInt(value,10)) && (parseFloat(value,10) == parseInt(value,10)); 
}

var wash = function(x) {
	return isInt(x) ? x : 0;
}

var renderContributionsTable = function(country, contributions) {
	var table = $("#contributions");
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

	var sorted = country.json.contributions.slice(0);
	sorted.sort(compareOutcomes);
	clearTable(table)
	$.each(sorted.slice(0,20), function(i,id) {
		var c = contributions[id];
		if (c != undefined)
			addRow(table, c.years != undefined ? c.years[0] : "", c.name, c.outcome_total);
	});
};

$(document).ready(function() {
	try {
		var GLOBAL = 98;
		var IRAQ = 120;
		var country = createCountry(IRAQ);
		$("h1").text(country.name());
		var contributions = countryContributions(IRAQ)
		var _totalPerYear = totalPerYear(country, contributions);
		renderGraph(Object.keys(_totalPerYear), [dataset(values(_totalPerYear), 100, 100, 255)]);

		renderContributionsTable(country, contributions);
	} catch (e) {
		$('.alert').text(e.message);
		$('.alert').show();
	}

})
