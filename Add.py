from flask import Flask
from flask import request, jsonify

app = Flask(__name__)

@app.route('/arith/add', methods=['GET'])
def addTwoNos():
    return jsonify(int(request.args['x']) + int(request.args['y']))

app.run(host="127.0.0.1", port="5003")