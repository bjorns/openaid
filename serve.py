#!/usr/bin/env python
#
# Chrome has a cross origin resource sharing guard that prevents file:// urls
# from using the canvas image blending with local image urls.
# 
# After running, the demo is available on http://localhost:8080/demo
# 
# coding: utf-8

#!/usr/bin/env python
import SimpleHTTPServer
import SocketServer

class MyHTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def end_headers(self):
    	print "Setting headers."
        self.send_my_headers()

        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Access-Control-Allow-Origin", "http://0.0.0.0:8000")


if __name__ == '__main__':
	PORT = 8000
	httpd = SocketServer.TCPServer(("", PORT), MyHTTPRequestHandler)
	print "serving at port", PORT
	httpd.serve_forever()