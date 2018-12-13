const express = require('express');
const fetch = require("node-fetch");
const bodyParser = require('body-parser');
const port = process.env.PORT || 8081;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const LBEndpoints = ["http://localhost:80", "http://localhost:8088"];

serviceMapping = {};

app.get("/services", (req, res) => {
    console.log(`Request: ${req.url}`);
    res.send({
        result: serviceMapping,
        message: 'Service endpoints returned successfully'
    });
});

let updateCachedRegistry = () => {
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
    // init heartbeat
    // call LB/updateSR
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
