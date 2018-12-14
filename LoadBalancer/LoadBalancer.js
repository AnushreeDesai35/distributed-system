const fetch = require('node-fetch');
const express = require("express");
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8091;
const registryServer = process.env.REGISTRY || "http://localhost:8081";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let cachedSR;
let serverLoads = {};

let getOriginReqParams = (request) => {
    return request.url.substr(request.url.indexOf('?'));
};

let getServiceName = (request) => {
    return request.path.substr(request.path.lastIndexOf('/') + 1);
};

let fetchCSR = async function (request, response) {
    let dicoveryRequest = registryServer[0] + "/services";
    let resp = await fetch(dicoveryRequest);
    let json = await resp.json();
    let endpoints = json.result;
    return endpoints;
};

let forwardServiceRequest = (request, response) => {
    let serviceName = getServiceName(request);
    let endpoints = cachedSR[serviceName];
    let loadStatus = serverLoads[serviceName] || 0;

    let serviceUrl = endpoints[loadStatus] + getOriginReqParams(request);
    loadStatus = (loadStatus + 1) % endpoints.length;
    serverLoads[serviceName] = loadStatus;

    console.log(`forwarded: ${serviceUrl}`);
    response.redirect(serviceUrl);
};

let requestHandler = (request, response) => {
    // console.log(`Request: ${request.url}`);
    if (cachedSR) {
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
    // console.log(cachedSR);
};

app.post("/updateSR", updateCSR);

app.get('/arith/*', requestHandler);

app.listen(PORT, (err) => {
    if (err) return console.log('something bad happened', err);
    console.log(`server is listening on ${PORT}`);
});