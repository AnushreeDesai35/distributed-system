// from flask import Flask
// from flask import request, jsonify
// from requests import get

// serviceMapping = {
//     "add": {
//         "endpoints":["127.0.0.1:5003","127.0.0.1:3001"],
//     },
//     "subtract": {
//         "endpoints":["127.0.0.1:5000","127.0.0.1:3001"],
//     },
//     "multiply": {
//         "endpoints":["127.0.0.1:5004"],
//     },
// }
// app = Flask(__name__)
// @app.route('/service/<serviceName>')
// def discoverService(serviceName):
//     serviceEndpoints = serviceMapping[serviceName]["endpoints"]
//     return jsonify(serviceEndpoints)

// app.run(host="127.0.0.1", port="5001")

const express = require('express');
const app = express();
const port = process.env.PORT || 5005;

serviceMapping = {
    "add": {
        "endpoints": ["127.0.0.1:5003", "127.0.0.1:3001"],
    },
    "subtract": {
        "endpoints": ["127.0.0.1:5000", "127.0.0.1:3001"],
    },
    "multiply": {
        "endpoints": ["127.0.0.1:5004"],
    },
}

app.get("/service/:serviceName", (req, res) => {
    res.send({
        result: serviceMapping[req.params.serviceName]["endpoints"],
        message: 'Service endpoint returned successfully'
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});