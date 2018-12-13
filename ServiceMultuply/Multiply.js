const fetch = require("node-fetch");
const WebService = require('../WebService')

const SLBEndpoint = "http://localhost:8081";

class MultiplyService extends WebService {
  constructor(name) {
    super(name);
  }

  get(req, res) {
    if (req.path == "/arith/multiply") {
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
  }
}

new MultiplyService("multiply");