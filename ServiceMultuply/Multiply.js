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
    if (req.path == "/arith/mul") {
        let x = req.query['x'];
        let y = req.query['y'];
        let product = 0;
        try {
            for (let i = 0; i < y; i++) {
                let serviceURL = `${SLBEndpoint}/arith/add?x=${product}&y=${x}`;
                let response = await fetch(serviceURL);
                let json = await response.json();
                product = json.result;
            }

            res.send({
                result: product,
                message: 'Multiplication done successfully'
            });
        } catch (exception) {
            res.send({
                result: 0,
                message: 'Multiplication failed'
            });
        }
    }
};

const multiply = new WebService("MUL", port);
multiply.start(requesthandler);