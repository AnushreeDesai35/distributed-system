const fetch = require("node-fetch");
const WebService = require('../WebService')

class MultiplyService extends WebService {
  constructor(name) {
    super(name);
    this.get = this.get.bind(this);
  }

  async computeResult(req, res, endpoint){
    let x = req.query['x'];
    let y = req.query['y'];
    let product = 0;
    try {
        for (let i = 0; i < y; i++) {
            let serviceURL = `${endpoint}/arith/add?x=${product}&y=${x}`;
            let response = await fetch(serviceURL);
            let json = await response.json();
            product = json.result;
        }

        res.send({
            result: product,
            message: 'Multiplication done successfully'
        });
    } catch (exception) {
        if(endpoint == WebService.Config.LBFallback){
            res.send({
               result: 0,
               message: "Multiplication Failed" 
            });
            return;
        }
        console.log("Falling Back....................")
        this.computeResult(req, res, WebService.Config.LBFallback);
    }
  }

  get(req, res) {
    if (req.path == "/arith/multiply") {
        this.computeResult(req, res, WebService.Config.SLB);
    }
  }
}

new MultiplyService("multiply");