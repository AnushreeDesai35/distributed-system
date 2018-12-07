const WebService = require('./WebService')

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

const add = new WebService("ADD", port);
add.start(requesthandler);