const express = require('express');
const app = express();
const port = process.env.PORT || 5005;

serviceMapping = {
    "add": {
        "endpoints": ["127.0.0.1:5003", "127.0.0.1:3001"],
    },
    "subtract": {
        "endpoints": ["127.0.0.1:5000", "127.0.0.1:3001"],
    },
    "multiply": {
        "endpoints": ["127.0.0.1:5004"],
    },
}

app.get("/service/:serviceName", (req, res) => {
    console.log(`Request: ${req.url}`);
    res.send({
        result: serviceMapping[req.params.serviceName]["endpoints"],
        message: 'Service endpoint returned successfully'
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});