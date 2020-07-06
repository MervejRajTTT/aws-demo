const express = require('express');
var app = express();
var cors = require('cors');
var port = 3600;

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.update({ region: 'us-east-2' });

// Create EC2 service object
var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

let object = {
    "instance_4": 'ec2-3-22-116-77.us-east-2.compute.amazonaws.com',
    "instance_5": 'ec2-3-20-224-18.us-east-2.compute.amazonaws.com'
};

let freeInstance = ["instance_4", "instance_5"];

app.use(cors())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/connect", function (req, res) {
    if (freeInstance.length > 0) {
        let id = freeInstance.pop();
        console.log("instance is connect ", freeInstance);
        return res.send({ success: object[id] })
    } else {
        return res.send({ error: "no instance" });
    }
});

app.get("/disconnect", function (req, res) {
    freeInstance.push(req.query.id)
    console.log("instance is disconnect ", freeInstance);
    return res.send({ success: req.query.id })
})

app.get("/createinstance", function (req, res) {
    
    var instanceParams = {
        ImageId: 'ami-006ecc40f152fb0eb',
        InstanceType: 't2.micro',
        KeyName: 'test2',
        MinCount: 1,
        MaxCount: 1
    };

    // Create a promise on an EC2 service object
    var instancePromise = new AWS.EC2({ apiVersion: '2016-11-15' }).runInstances(instanceParams).promise();

    // Handle promise's fulfilled/rejected states
    instancePromise.then(
        function (data) {
            console.log(data);
            var instanceId = data.Instances[0].InstanceId;
            console.log("Created instance", instanceId);
            // Add tags to the instance
            tagParams = {
                Resources: [instanceId], Tags: [
                    {
                        Key: 'Node instance',
                        Value: 'SDK Sample'
                    }
                ]
            };
            // Create a promise on an EC2 service object
            var tagPromise = new AWS.EC2({ apiVersion: '2016-11-15' }).createTags(tagParams).promise();
            // Handle promise's fulfilled/rejected states
            tagPromise.then(
                function (data) {
                    console.log("Instance tagged");
                }).catch(
                    function (err) {
                        console.error(err, err.stack);
                    });
        }).catch(
            function (err) {
                console.error(err, err.stack);
            });
})

app.get("/getinstancedetails", function (req, res) {
    var params = {
        DryRun: false
    };

    // Call EC2 to retrieve policy for selected bucket
    ec2.describeInstances(params, function (err, data) {
        if (err) {
            console.log("Error", err.stack);
        } else {
            console.log("Success", JSON.stringify(data));
        }
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))