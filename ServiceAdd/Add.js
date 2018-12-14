const WebService = require('../WebService');

class AddService extends WebService {
  constructor(name) {
    super(name);
  }

  get(req, res) {
    if (req.path == "/arith/add") {
      WebService.sleep(3000);
      res.send({
        result: parseInt(req.query['x']) + parseInt(req.query['y']),
        message: 'Addition done successfully'
      });
    }
  }
}

new AddService("add");

// XML schema for service
// Heart Beat
// Least Comm
// Experiments
// Graph
// Report Writing