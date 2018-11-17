from flask import Flask
from flask import request, jsonify

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/arith/add', methods=['GET'])
def addTwoNos():
    return jsonify(int(request.args['x']) + int(request.args['y']))

@app.route('/arith/subtract', methods=['GET'])
def subTwoNos():
    return jsonify(int(request.args['x']) - int(request.args['y']))

# @app.route('/arith/multiply', methods=['GET'])
# def mulTwoNos():
#     product = 1
#     for i in range(int(request.args['x'])):
#         product = addTwoNos(product, int(request.args['y']))
#     return product

# if __name__ == '__main__':
app.run(port='3001')