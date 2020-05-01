"use strict";

process.env.AWS_ACCESS_KEY_ID = "";
process.env.AWS_SECRET_ACCESS_KEY = "";

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: "eu-west-1" });
console.log("AWS and DDB loaded");

const params = {
  TableName: "tutors-table-dev",
  FilterExpression: "price <= :highprice and price >= :lowprice",
  ExpressionAttributeValues: {
    ":highprice": 50,
    ":lowprice": 5,
  },
};
console.log("Created params");
console.log("Scanning started");

dynamoDB.scan(params, (error, result) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(result);
});
