const WebService = require('./WebService')

const port = process.env.PORT || 5004;

let requesthandler = (req, res) => {
  if (req.method == WebService.METHOD.GET) {
    handleGET(req, res);    
  }
};

let handleGET = (req, res) => {
  if(req.path == "/arith/sub"){
    res.send({
      result: parseInt(req.query['x']) - parseInt(req.query['y']),
      message: 'Subtraction done successfully'
    });
  }
};

const add = new WebService("SUB", port);
add.start(requesthandler);