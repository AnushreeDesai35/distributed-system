from flask import Flask
from requests import get

def createLB():
    app = Flask(__name__)
    servers = ["http://localhost:5000/", "http://localhost:3001/"]

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def forward(path):
        # server = servers[current]
        # current = (current + 1) % len(servers)
        print(path)
        return get(servers[0] + path).content

    app.run(host="0.0.0.0", port="80")

# if __name__ == '__main__':
createLB()