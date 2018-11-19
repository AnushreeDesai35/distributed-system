from flask import Flask
from flask import request
from requests import get
import json

def createLB():
    app = Flask(__name__)
    servers = ["http://localhost:5001"]

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def forward(path):
        serviceName = path[path.rfind('/'):]
        print(serviceName)
        dicoveryRequest = servers[0]+"/service" + serviceName
        serviceEndpoints = json.loads(get(dicoveryRequest).content)
        server = serviceEndpoints[forward.current]
        forward.current = (forward.current + 1) % len(serviceEndpoints)
        return get(server + path).content

    forward.current = 0
    app.run(host="0.0.0.0", port="80")

createLB()

"""
TODO:
- x-request-forward
- leastconn algorithm
- round-robin algorithm
"""
