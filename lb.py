from flask import Flask
from flask import request
from requests import get

def createLB():
    app = Flask(__name__)
    servers = ["http://localhost:5001"]

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def forward(path):
        completePath = servers[0]+"?serviceName="+path+"&x="+request.args['x']+"&y="+request.args['y']
        # print("^^^^^^^^^^^^^ COMPLETE PATH ^^^^^^^^^^^^")
        # print(completePath)
        return get(completePath).content

    app.run(host="0.0.0.0", port="80")

createLB()