const express = require("express");
const fetch = require("node-fetch");

const PORT = 80;
const registryServer = ["http://localhost:5005"];
const app = express();
let cachedSR;

let current = 0;

let fetchCSR = async function (request, response) {
    let path = request.path;
    let serviceName = path.substr(path.lastIndexOf('/'));
    let dicoveryRequest = registryServer[0] + "/service" + serviceName;

    let resp = await fetch(dicoveryRequest);
    let json = await resp.json();
    let endpoints = json.result;
    return endpoints;
};

let forwardServiceRequest = (request, response) => {
    let serviceUrl = "http://" + cachedSR[current] + request.url;
    current = (current + 1) % cachedSR.length;
    console.log(`forwarded: ${serviceUrl}`);
    response.redirect(serviceUrl);
};

let requestHandler = (request, response) => {
    console.log(`Request: ${request.url}`);
    if (cachedSR) {
        forwardServiceRequest(request, response);
    }
    else {
        fetchCSR(request, response).then((data) => {
            cachedSR = data;
            forwardServiceRequest(request, response);
        });
    }
};

let updateCSR = function(request, response) {
    console.log(`Update CSR ${cachedSR}`);
    let endpoints = response.result;
    cachedSR = endpoints;
};

app.get("/updateSR", updateCSR);

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
