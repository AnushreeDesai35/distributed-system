const express = require('express');
const app = express();
const port = process.env.PORT || 5004;
const fetch = require("node-fetch");

app.get("/arith/multiply", async (req, res) => {
    console.log("multiply request here");
    console.log("x param: ", req.query['x']);
    console.log("y param: ", req.query['y']);
    var sum = 0
    // var loadBalancer = "http://localhost/arith/add";
    for(var i=0;i<req.query['x'];i++){
        loadBalancer = "http://localhost:80/add?x="+sum+"&y="+req.query['y']
        let resp = await fetch(loadBalancer);
        console.log("Here is the resp: ",resp)
    }
    res.send({
        result: parseInt(req.query['x']) * parseInt(req.query['y']),
        message: 'Multplication done successfully'
      });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
