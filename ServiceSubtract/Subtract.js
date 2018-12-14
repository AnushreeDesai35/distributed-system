const WebService = require('../WebService');

class SubtractService extends WebService {
  constructor(name) {
    super(name);
  }

  get(req, res) {
    super.get(req, res);
    if (req.path == "/arith/subtract") {
      res.send({
        result: parseInt(req.query['x']) - parseInt(req.query['y']),
        message: 'Subtraction done successfully'
      });
    }
  }
}

new SubtractService("subtract");