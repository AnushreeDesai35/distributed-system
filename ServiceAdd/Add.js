const WebService = require('../WebService');

const port = process.env.PORT || 5003;

let requesthandler = (req, res) => {
    if (req.method == WebService.METHOD.GET) {
        handleGET(req, res);    
    }
};

let handleGET = (req, res) => {
    if(req.path == "/arith/add"){
        res.send({
            result: parseInt(req.query['x']) + parseInt(req.query['y']),
            message: 'Addition done successfully'
        });
    }
};

const add = new WebService("Add", port);
add.start(requesthandler);

// XML schema for service
// Request Forwarding
// Handle add/register and delete/unregister in ServiceRegistry.js local json object
// Heart Beat
// Least Comm
// Experiments
// Graph
// Report Writing

