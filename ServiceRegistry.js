const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5005;
const fs = require('fs');
const app = express();
const convert = require('xml-js');

const wsdlFile = "./AddWSDL.xml";

let xmlData = null;
var filePromise = new Promise(function (resolve, reject) {
    fs.readFile(wsdlFile, 'utf8', function (err, data) {
        if (err) {
            console.log(error);
        }
        resolve(data);
    });
});

filePromise.then((data) => {
    xmlData = data;
    var xmlToJson = convert.xml2js(xmlData, {
        compact: true,
        spaces: 4
    });
    console.log("Hi, here is json: ", xmlToJson['wsdl:description']['wsdl:service']);

    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({
    //     extended: true
    // }));

    // var serviceMapping = {};
    

    app.get("/services", (req, res) => {
        console.log(`Request: ${req.url}`);
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
        console.log(serviceMapping)
        // init heartbeat
        // call LB/updateSR
    });

    app.listen(port, () => {
        console.log(`Server listening on port ${port}...`);
    });
});
