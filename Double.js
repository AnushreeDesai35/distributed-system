const fetch = require("node-fetch");
const WebService = require('./WebService')

const port = process.env.PORT || 5004;
const SLBEndpoint = "http://localhost:8082";

let requesthandler = (req, res) => {
    if (req.method == WebService.METHOD.GET) {
        handleGET(req, res);
    }
};

let handleGET = async function (req, res) {
    if (req.path == "/arith/double") {
        let x = req.query['x'];
        let product = 0;
        try {
            let serviceURL = `${SLBEndpoint}/arith/mul?x=${x}&y=2`;
            let response = await fetch(serviceURL);
            let json = await response.json();
            product = json.result;

            res.send({
                result: product,
                message: 'Double done successfully'
            });
        } catch (exception) {
            res.send({
                result: 0,
                message: 'Double failed'
            });
        }
    }
};

const double = new WebService("DOUBLE", port);
double.start(requesthandler);