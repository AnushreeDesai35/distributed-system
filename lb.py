from flask import Flask
from flask import request
from requests import get

def createLB():
    app = Flask(__name__)
    servers = ["http://localhost:5001"]

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def forward(path):
        #forward.current = (forward.current + 1) % len(servers)
        #server = servers[forward.current]
        #print(path, forward.current)
        #return get(server + path).content
        completePath = servers[0]+"?serviceName="+path+"&x="+request.args['x']+"&y="+request.args['y']
        # print("^^^^^^^^^^^^^ COMPLETE PATH ^^^^^^^^^^^^")
        # print(completePath)
        return get(completePath).content

    forward.current = 0
    app.run(host="0.0.0.0", port="80")

createLB()