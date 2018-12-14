const WebService = require('../WebService');
const latency = process.env.latency || 3000;
class AddService extends WebService {
  constructor(name) {
    super(name);
  }

  get(req, res) {
    if (req.path == "/arith/add") {
      WebService.sleep(latency);
      res.send({
        result: parseInt(req.query['x']) + parseInt(req.query['y']),
        message: 'Addition done successfully'
      });
    }
  }
}

new AddService("add");

// Least Comm
// Experiments
// Graph
// Report Writing