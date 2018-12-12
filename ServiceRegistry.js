const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5005;
const fs = require('fs');
const app = express();
const convert = require('xml-js');

const wsdlFile = "./AddWSDL.xml";

app.get("/services", (req, res) => {
    // console.log(`Request: ${req.url}`);
    res.send({
        result: xmlData,
        message: 'Service endpoint returned successfully'
    });
});

app.post("/register/:serviceName", (req, res) => {
    let serviceName = req.params.serviceName;
    let serviceRecord = serviceMapping[serviceName];
    if (serviceRecord) {
        if (serviceRecord.endpoints.indexOf(req.body.endpoint) < 0) {
            serviceRecord.endpoints.push(req.body.endpoint);
        }
    } else {
        serviceMapping[serviceName] = {
            endpoints: [req.body.endpoint]
        };
    }
    res.send({
        result: 1,
        message: "success"
    });
    // console.log(serviceMapping);
    // init heartbeat
    // call LB/updateSR
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});

let fileArray = [
    'WSDLAdd.xml',
    'WSDLSubtract.xml',
    'WSDLMultiply.xml',
    'WSDLDivide.xml',
    'WSDLDouble.xml',
    'WSDLSquare.xml'];

let filesXMLData = {};
fileArray.forEach((file) => {
    fs.readFile('./'+file, (error, data) => {
        if(error){
            console.log('Error while reading file', error);
        }
        else {
            var jsonData = convert.xml2js(data, {
                compact: true,
                spaces: 4
            });
            filesXMLData[file] = jsonData;
            console.log(filesXMLData[file]['wsdl:description']['wsdl:binding']);
        }
    });
});
