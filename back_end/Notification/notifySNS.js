'use strict';
var AWS = require("aws-sdk");
var sns = new AWS.SNS();
var topicArn = 'arn:aws:sns:us-east-1:448061383862:NewStudent';

exports.handler = (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));

        if (record.eventName == 'INSERT') {
            var student_id = JSON.stringify(record.dynamodb.NewImage.student_id.S);
            var student_name = JSON.stringify(record.dynamodb.NewImage.student_name.S);
            var student_dob = JSON.stringify(record.dynamodb.NewImage.student_dob.S);

            var message = `{"student_id": ${student_id}, "student_name": ${student_name}, "student_dob": ${student_dob}}`;
            var params = {
                Subject: 'A new stud ',
                Message: message,
                TopicArn: topicArn
            };
            sns.publish(params, function(err, data) {
                if (err) {
                    console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Results from sending message: ", JSON.stringify(data, null, 2));
                }
            });
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};