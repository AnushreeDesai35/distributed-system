from flask import Flask
from requests import get

def createLB():
    app = Flask(__name__)
    servers = ["http://localhost:5000/", "http://localhost:5001/"]

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def forward(path):
        forward.current = (forward.current + 1) % len(servers)
        server = servers[forward.current]
        print(path, forward.current)
        return get(server + path).content

    forward.current = 0
    app.run(host="0.0.0.0", port="80")

createLB()