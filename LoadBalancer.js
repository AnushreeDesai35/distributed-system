const express = require("express");
const fetch = require("node-fetch");

const PORT = 80;
const registryServer = ["http://localhost:5005"];
const app = express();

let current = 0;

let forwardServiceRequest = async function(url, req, res) {
    let response = await fetch(url);
    let json = await response.json();
    let endpoints = json.result;

    let serviceUrl = "http://" + endpoints[current] + req.url;
    current = (current + 1) % endpoints.length;
    console.log(`forwarded: ${serviceUrl}`);
    res.redirect(serviceUrl);
};

let requestHandler = (request, response) => {
    console.log(`Request: ${request.url}`);
    let path = request.path;
    let serviceName = path.substr(path.lastIndexOf('/'));
    let dicoveryRequest = registryServer[0] + "/service" + serviceName;
    forwardServiceRequest(dicoveryRequest, request, response);
};

app.all('*', requestHandler);

app.listen(PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${PORT}`);
});


// """
// TODO:
// - x-request-forward
// - leastconn algorithm
// """
