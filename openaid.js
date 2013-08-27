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


var contributions = function(response) {
	return response[0].extra_data.contributions_by_year
};

var sum = function(data) {
	var ret = 0
	$(data).each(function(i,v) {ret+=parseInt(v)})
	return ret
}

var render = function(labels, values) {
	var lineChartData = {
		labels: labels,
		datasets : [
 			{
 				fillColor : "rgba(220,220,220,0.5)",
 				strokeColor : "rgba(220,220,220,1)",
	 			pointColor : "rgba(220,220,220,1)",
 				pointStrokeColor : "#fff",
 				data : values
	 		}
 		]
 	};
 	var graph = new Chart(document.getElementById("canvas").getContext("2d")).Line(lineChartData);
}

$(document).ready(function() {
	var url = 'http://api.openaid.se/api/v1/country?id=120';

	function dataOfYear(data, year) {
		return data[0].extra_data.contributions_by_year[year]
	}


	$.ajax({
		url: url,
		dataType: "json"
	}).done(function(data) { 
		var c = contributions(data);
		var labels = Object.keys(c);
		var values = []
		$.each(c, function(k,v) {
			values.push(sum(v));
		});
		render(labels, values)

	});
})
