const express = require('express');
var app = express();
var cors = require('cors');

let object = {
    "instance_4": 'ec2-3-17-146-252.us-east-2.compute.amazonaws.com',
    "instance_5": 'ec2-3-17-146-252.us-east-2.compute.amazonaws.com'
};

let freeInstance = ["instance_4", "instance_5"];

app.use(cors())

app.get("/connect", function(req, res) {
    if(freeInstance.length > 0){
        let id = freeInstance.pop();
        return res.send({ success : object[id] })
    }else{
        return res.send({ error : "no instance" });
    }
});

app.get("/disconnect", function(req,res){
    freeInstance.push(req.query.id)
    return res.send({ success : req.query.id })
})

app.listen(3500);