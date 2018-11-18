from flask import Flask
from flask import request
from requests import get

serviceMapping = {
    "add": {
        "endpoints":["127.0.0.1:5000","127.0.0.1:3001"],
        "route":"/arith/add"
    },
    "subtract": {
        "endpoints":["127.0.0.1:5000","127.0.0.1:3001"],
        "route":"/arith/subtract"
    }
}
app = Flask(__name__)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')

def discoverService(path):
    print("&&&&&&&&&&&&&& PATH &&&&&&&&&&&&&")
    print(request.args)
app.run(host="127.0.0.1", port="5001") 

# discoverService()
