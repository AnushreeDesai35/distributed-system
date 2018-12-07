const express = require('express');
const fetch = require('node-fetch');

const app = express();
const ip = "127.0.0.1"
const port = process.env.PORT || 5003;

const self = {
  endpoint: ip + ":" + port
}

app.get("/arith/add", (req, res) => {
  res.send({
    result: parseInt(req.query['x']) + parseInt(req.query['y']),
    message: 'Addition done successfully'
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
  fetch("http://127.0.0.1:5005/register/add", {
      method: 'POST',
      body: JSON.stringify(self),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(json => {
      if(json.result){
        // init heartbeat
      }
    });
});