const fetch = require('node-fetch');
const express = require("express");
const bodyParser = require('body-parser');

const PORT = 80;
const registryServer = ["http://localhost:8081"];

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let cachedSR;
let serverLoads = {};

let getOriginReqParams = (request) => {
    console.log(request.url)
    return request.url.substr(request.url.indexOf('?'));
};

let getServiceName = (request) => {
    console.log(request.path)
    return request.path.substr(request.path.lastIndexOf('/') + 1);
};

let fetchCSR = async function (request, response) {
    let dicoveryRequest = registryServer[0] + "/services";
    console.log('discovery request: ',dicoveryRequest)
    let resp = await fetch(dicoveryRequest);
    let json = await resp.json();
    let endpoints = json.result;
    return endpoints;
};

let forwardServiceRequest = (request, response) => {
    console.log("^^^^^^^^^^^^^^^^^cachedSR");
    console.log(cachedSR);
    console.log(getOriginReqParams(request));
    console.log(getServiceName(request))

    let serviceName = getServiceName(request);
    let endpoints = cachedSR[serviceName].endpoints;
    let loadStatus = serverLoads[serviceName] || 0;

    let serviceUrl = endpoints[loadStatus] + getOriginReqParams(request);
    loadStatus = (loadStatus + 1) % endpoints.length;
    serverLoads[serviceName] = loadStatus;

    console.log(`forwarded: ${serviceUrl}`);
    response.redirect(serviceUrl);
};

let requestHandler = (request, response) => {
    console.log(`Request: ${request.url}`);
    if (cachedSR) {
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        console.log(cachedSR);
        forwardServiceRequest(request, response);
    }
    else {
        fetchCSR(request, response).then((data) => {
            cachedSR = data;
            serverLoads[getServiceName(request)] = 0;
            forwardServiceRequest(request, response);
        });
    }
};

let updateCSR = (request, response) => {
    let serviceMapping = request.body;
    cachedSR = serviceMapping;
    console.log(cachedSR);
};

app.post("/updateSR", updateCSR);

app.get('/arith/*', requestHandler);

app.listen(PORT, (err) => {
    if (err) return console.log('something bad happened', err);
    console.log(`server is listening on ${PORT}`);
});


// """
// TODO:
// - x-request-forward
// - leastconn algorithm
// """
