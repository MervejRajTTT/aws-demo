const express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var cors = require('cors')
var serverOne = 'http://ec2-3-23-94-10.us-east-2.compute.amazonaws.com:3500/';
var axios = require("axios");
 
app.use(cors())

app.all("/app1/*", function(req, res) {
    console.log('redirecting to Server1', serverOne);
    return apiProxy.web(req, res, {target: serverOne});
});

app.get("/app2", function(req,res){
    return res.send('Hello!')
})

app.listen(5555);