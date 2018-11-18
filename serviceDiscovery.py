from flask import Flask
from flask import request
from requests import get

serviceMapping = {
    "add": {
        "endpoints":["127.0.0.1:5000","127.0.0.1:3001"],
    },
    "subtract": {
        "endpoints":["127.0.0.1:5000","127.0.0.1:3001"],
    }
}
app = Flask(__name__)
# @app.route('/', defaults={'path': ''})
@app.route('/service/<serviceName>')
def discoverService(serviceName):
    serviceName = request.args("serviceName")
    serviceEndpoints = serviceMapping[serviceName]["endpoints"]
    return serviceEndpoints

app.run(host="127.0.0.1", port="5001")

# discoverService()
