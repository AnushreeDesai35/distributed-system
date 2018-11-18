from flask import Flask
from flask import request
from requests import get

def createLB():
    app = Flask(__name__)
    servers = ["http://localhost:5001"]

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def forward(path):
        dicoveryRequest = servers[0]+"/service/add"
        serviceEndpoints = get(dicoveryRequest).content
        return serviceEndpoints

    forward.current = 0
    app.run(host="0.0.0.0", port="80")

createLB()

"""
TODO:
- x-request-forward
- leastconn algorithm
- round-robin algorithm
"""
