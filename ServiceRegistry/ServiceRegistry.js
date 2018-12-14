const express = require('express');
const fs = require('fs');
const _ = require("lodash");
const fetch = require("node-fetch");
const bodyParser = require('body-parser');
const port = process.env.PORT || 8081;
const {
    Worker
} = require('worker_threads');
const FILENAME = "registry.json";

serviceMapping = {};
registryData = {};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const LBEndpoints = ["http://localhost:80", "http://localhost:8088"];

const thread = new Worker('./ServiceRegistry/HealthCheckup.js');
thread.on('message', (threadData) => {
    console.log('healhth data arrived: ', threadData);
    registryData = _.transform(serviceMapping, (result, value, key) => {
        upServers = value.filter((item) => {
            return threadData[item];
        });
        result[key] = upServers;
    }, {});
    console.log("Registry Data:", registryData);
    updateCachedRegistry();
});


let loadSR = (exists) => {
    if(exists){
        fs.readFile(FILENAME, (error, data) => {
            if (error) {
                console.log('Error while reading file', error);
            } else {
                serviceMapping = JSON.parse(data);
                console.log(serviceMapping);
                thread.postMessage(serviceMapping);
            }
        });
    }
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}...`);
    });
}

fs.exists(FILENAME, loadSR);

app.get("/services", (req, res) => {
    console.log(`Request: ${req.url}`);
    res.send({
        result: registryData,
        message: 'Service endpoints returned successfully'
    });
});

let updateRegistryInfo = () => {
    fs.writeFile(FILENAME, JSON.stringify(serviceMapping), 'utf8', () => {
        console.log("saved.")
    });
};

let updateCachedRegistry = () => {

    LBEndpoints.forEach(lb => {
        console.log(lb + "/updateSR");
        fetch(lb + "/updateSR", {
                method: 'POST',
                body: JSON.stringify(registryData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                console.log("CSR updated.");
            });
    });
};

app.post("/register/:serviceName", (req, res) => {
    let serviceName = req.params.serviceName;
    let serviceRecord = serviceMapping[serviceName];
    if (serviceRecord) {
        if (serviceRecord.indexOf(req.body.address) < 0) {
            serviceRecord.push(req.body.address);
        }
    } else {
        serviceMapping[serviceName] = [req.body.address];
    }

    updateRegistryInfo();
    console.log('service mapping: ', serviceMapping);
    thread.postMessage(serviceMapping);

    res.send({
        result: 1,
        message: "success"
    });
});

app.post("/unregister/:serviceName", (req, res) => {
    let serviceName = req.params.serviceName;
    let serviceRecord = serviceMapping[serviceName];
    if (serviceRecord) {
        let idx = serviceRecord.indexOf(req.body.address);
        if (idx > 0) {
            serviceMapping[serviceName].splice(idx, 1);

            console.log("updateSR")
            updateRegistryInfo();
            thread.postMessage(serviceMapping);

            res.send({
                result: 1,
                message: "success"
            });

            console.log(serviceMapping);
            // kill heartbeat thread
            return;
        }
    }

    res.send({
        result: 0,
        message: "failed"
    });
});