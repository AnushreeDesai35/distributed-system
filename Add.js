const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 5003;

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
      body: {
        endpoint: "127.0.0.1:5003"
      }
    })
    .then(res => res.json())
    .then(json => {
      if(json.result){
        // init heartbeat
      }
    });
});