#!/bin/sh
#
# Chrome has a cross origin resource sharing guard that prevents file:// urls
# from using the canvas image blending with local image urls.
# 
# After running, the demo is available on http://localhost:8080/demo
# 
python -m SimpleHTTPServer 8080