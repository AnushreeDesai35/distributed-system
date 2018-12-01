// from flask import Flask
// from flask import request, jsonify
// from requests import get

// app = Flask(__name__)

// @app.route('/arith/multiply', methods=['GET'])
// def mulTwoNos():
//     sum = 0
//     print('$$$$$$$$$$$$$$$$$$$$$$$$$$')
//     print(request.args)
//     for i in range(int(request.args['x'])):
//         print("CHECK FOR LOOP")
//         path = "http://10.0.0.134:80?x="+str(sum)+"&y="+str(request.args['y'])
//         print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
//         print(path)
//         product = get(path).content
//     return product

// app.run(host="127.0.0.1", port="5004")

const express = require('express');
const app = express();
const port = process.env.PORT || 5004;
const fetch = require("node-fetch");

app.get("/arith/multiply", async (req, res) => {
    console.log("multiply request here");
    console.log("x param: ", req.query['x']);
    console.log("y param: ", req.query['y']);
    var sum = 0
    // var loadBalancer = "http://localhost/arith/add";
    for(var i=0;i<req.query['x'];i++){
        loadBalancer = "http://localhost:80/add?x="+sum+"&y="+req.query['y']
        let resp = await fetch(loadBalancer);
        console.log("Here is the resp: ",resp)
    }
    res.send({
        result: parseInt(req.query['x']) * parseInt(req.query['y']),
        message: 'Multplication done successfully'
      });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
