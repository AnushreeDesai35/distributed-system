const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5005;
const app = express();

serviceMapping = {};

app.get("/services", (req, res) => {
    console.log(`Request: ${req.url}`);
    res.send({
        result: serviceMapping,
        message: 'Service endpoints returned successfully'
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
    // init heartbeat
    // call LB/updateSR
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
