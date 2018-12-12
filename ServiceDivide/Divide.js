const fetch = require("node-fetch");
const WebService = require('../WebService')

const port = process.env.PORT || 5004;
const SLBEndpoint = "http://localhost:8082";

let requesthandler = (req, res) => {
    if (req.method == WebService.METHOD.GET) {
        handleGET(req, res);
    }
};

let handleGET = async function (req, res) {
    if (req.path == "/arith/div") {
        let dividend = req.query['x'];
        let divisor = req.query['y'];
        let quotient = 0;
        try {
            while (dividend > 0) {
                let serviceURL = `${SLBEndpoint}/arith/sub?x=${dividend}&y=${divisor}`;
                let response = await fetch(serviceURL);
                let json = await response.json();
                dividend = json.result;
                quotient++;
            }

            res.send({
                result: quotient,
                message: 'Division done successfully'
            });
        } catch (exception) {
            res.send({
                result: 0,
                message: 'Division failed'
            });
        }
    }
};

const division = new WebService("DIV", port);
division.start(requesthandler);