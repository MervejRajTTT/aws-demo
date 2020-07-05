var cors = require('cors')
const express = require('express');
const app = express()
var port = 3500;

app.use(cors())

app.get('/', (req, res) => {
  console.log("inside 3400")
  return res.send('Welcome!')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))