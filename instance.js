// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.update({region: 'us-east-2'});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});


var params = {
    DryRun: false
  };
  
  // Call EC2 to retrieve policy for selected bucket
  ec2.describeInstances(params, function(err, data) {
    if (err) {
      console.log("Error", err.stack);
    } else {
      console.log("Success", JSON.stringify(data));
    }
  });

return;

// AMI is amzn-ami-2011.09.1.x86_64-ebs
var instanceParams = {
   ImageId: 'ami-006ecc40f152fb0eb', 
   InstanceType: 't2.micro',
   KeyName: 'test2',
   MinCount: 1,
   MaxCount: 1
};

// Create a promise on an EC2 service object
var instancePromise = new AWS.EC2({apiVersion: '2016-11-15'}).runInstances(instanceParams).promise();

// Handle promise's fulfilled/rejected states
instancePromise.then(
  function(data) {
    console.log(data);
    var instanceId = data.Instances[0].InstanceId;
    console.log("Created instance", instanceId);
    // Add tags to the instance
    tagParams = {Resources: [instanceId], Tags: [
       {
          Key: 'Node instance',
          Value: 'SDK Sample'
       }
    ]};
    // Create a promise on an EC2 service object
    var tagPromise = new AWS.EC2({apiVersion: '2016-11-15'}).createTags(tagParams).promise();
    // Handle promise's fulfilled/rejected states
    tagPromise.then(
      function(data) {
        console.log("Instance tagged");
      }).catch(
        function(err) {
        console.error(err, err.stack);
      });
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });