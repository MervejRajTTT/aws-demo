var cors = require('cors')
const express = require('express');
const app = express()
var port = 3500;

app.use(cors())

app.get('/', (req, res) => {
  return res.send('Welcome to server 2!')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))