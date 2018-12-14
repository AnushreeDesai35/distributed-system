const express = require('express');
const fs = require('fs');
const fetch = require("node-fetch");
const bodyParser = require('body-parser');
const port = process.env.PORT || 8081;
const FILENAME = "registry.json";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const LBEndpoints = ["http://localhost:80", "http://localhost:8088"];

serviceMapping = {};

fs.readFile(FILENAME, (error, data) => {
    if(error){
        console.log('Error while reading file', error);
    }
    else {
        serviceMapping = JSON.parse(data);
        console.log(serviceMapping);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        });
    }
});

app.get("/services", (req, res) => {
    console.log(`Request: ${req.url}`);
    res.send({
        result: serviceMapping,
        message: 'Service endpoints returned successfully'
    });
});

let updateCachedRegistry = () => {

    fs.writeFile(FILENAME, JSON.stringify(serviceMapping), 'utf8', () => {
        console.log("saved.")
    });

    LBEndpoints.forEach(lb => {
        console.log(lb + "/updateSR")
        fetch(lb + "/updateSR", {
            method: 'POST',
            body: JSON.stringify(serviceMapping),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {console.log("CSR updated.")});
    });
};

app.post("/register/:serviceName", (req, res) => {
    let serviceName = req.params.serviceName;
    let serviceRecord = serviceMapping[serviceName];
    if (serviceRecord) {
        if (serviceRecord.endpoints.indexOf(req.body.address) < 0) {
            serviceRecord.endpoints.push(req.body.address);
        }
    } else {
        serviceMapping[serviceName] = {
            endpoints: [req.body.address]
        };
    }

    console.log("updateSR")
    updateCachedRegistry();

    res.send({
        result: 1,
        message: "success"
    });
    console.log(serviceMapping);
    // init heartbeat socket
});

app.post("/unregister/:serviceName", (req, res) => {
    let serviceName = req.params.serviceName;
    let serviceRecord = serviceMapping[serviceName];
    if(serviceRecord){
        let idx = serviceRecord.endpoints.indexOf(req.body.address);
        if(idx > 0){
            serviceMapping[serviceName].endpoints.splice(idx, 1);

            console.log("updateSR")
            updateCachedRegistry();

            res.send({
                result: 1,
                message: "success"
            });
        
            console.log(serviceMapping);
            // close heartbeat socket
            return;
        }
    }

    res.send({
        result: 0,
        message: "failed"
    });
});
