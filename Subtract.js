const express = require('express');
const app = express();
const port = process.env.PORT || 5004;

app.get("/arith/add", (req, res) => {
  res.send({
    result: parseInt(req.query['x']) - parseInt(req.query['y']),
    message: 'Substraction done successfully'
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
