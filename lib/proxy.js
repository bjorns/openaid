module.exports = (function () {
  "use strict";

  var http = require('http');


  function proxy(req, resp) {
    http.get("http://api.openaid.se" + req.url, function(response) {

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        resp.write(chunk);
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        resp.end('\n');
      });

      response.on('error', function (e) {
        console.log("Error: " + e);
      })
    });
  }

  return {
    proxyRequest: proxy
  };
})();
