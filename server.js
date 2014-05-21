var fs = require('fs'),
    http = require('http'),
    gjut = require('gjut'),
    template = gjut.compile('index.html', '.'),
    proxy = require('./lib/proxy.js');

function print_errors(errors) {
  for (var i = 0; i < errors.length; ++i) {
    var error = errors[i];
    console.log(error.type + ": " + error.message);
  }
}


if (template.errors.length > 0) {
  print_errors(template.errors);
  process.exit(-1);
}

function isLocal(url) {
  return url === '' || url === '/' || url.substring(0,3) === '/js' ||
    url.substring(0,4) === '/css' || url.substring(0,6) === '/fonts';
}

http.createServer(function (req, resp) {
  if (req.url === '/') {
    console.log("Serving page " + req.url);
    resp.writeHead(200, {'Content-Type': 'text/html; chartype=UTF-8'});

    gjut.render_html(template, {}, resp);
    resp.end('\n');
  } else if (isLocal(req.url)) {
    var data = fs.readFileSync('.' + req.url, {
        'encoding': 'utf-8'
      });
    resp.writeHead(200);
    resp.write(data);
    resp.end('\n');
  } else {
    console.log("Proxying request to " + req.url);
    return proxy.proxyRequest(req,resp);
  }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
