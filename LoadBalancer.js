const fetch = require('node-fetch');
const express = require("express");
const bodyParser = require('body-parser');

const PORT = 80;
const registryServer = ["http://localhost:5005"];

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let cachedSR;
let current = 0;

let getServiceParams = (request) => {
    return request.path.substr(request.path.lastIndexOf('/') + 1);
};

let fetchCSR = async function (request, response) {
    let serviceName = getServiceParams(request);
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
    console.log(current);
    console.log(request.url);
    console.log(getServiceParams(request))
    let endpoints = cachedSR[getServiceParams(request)].endpoints;
    let serviceUrl = "http://" + endpoints[current] + request.url;
    current = (current + 1) % cachedSR.length;
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
            forwardServiceRequest(request, response);
        });
    }
};

let updateCSR = function(request, response) {
    console.log(`Update CSR ${cachedSR}`);
    let serviceMapping = request.body.serviceMapping;
    cachedSR = serviceMapping;
};

app.post("/updateSR", updateCSR);

app.all('/arith/*', requestHandler);

app.listen(PORT, (err) => {
    if (err) return console.log('something bad happened', err);
    console.log(`server is listening on ${PORT}`);
});


// """
// TODO:
// - x-request-forward
// - leastconn algorithm
// """
