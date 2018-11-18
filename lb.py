from flask import Flask
from flask import request
from requests import get

def createLB():
    app = Flask(__name__)
    servers = ["http://localhost:5001"]
    # http://localhost:5001/service/<serviceName>
    # http://localhost:5001/addservice/<serviceName>

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def forward(path):
        #forward.current = (forward.current + 1) % len(servers)
        #server = servers[forward.current]
        #print(path, forward.current)
        #return get(server + path).content
        dicoveryRequest = servers[0]+"/service/add"
        # print("^^^^^^^^^^^^^ COMPLETE PATH ^^^^^^^^^^^^")
        # print(completePath)
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
