from flask import Flask
from flask import request, jsonify
from requests import get

app = Flask(__name__)

@app.route('/arith/multiply', methods=['GET'])
def mulTwoNos():
    sum = 0
    for i in range(int(request.args['x'])):
        path = "http://10.0.0.134:80?x="+sum+"&y="+int(request.args['y'])
        product = get(path).content
    return product

app.run(host="127.0.0.1", port="5004")