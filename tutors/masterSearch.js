"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.masterSearch = (event, context, callback) => {
  console.log("***************************");
  console.log(event.pathParameters.lowPrice);
  console.log("***************************");
  console.log(event.pathParameters.highPrice);
  console.log("***************************");

  const SEARCH_KEYWORD = {
    subject: event.pathParameters.subject,
    experience: event.pathParameters.experience,
    lowPrice: event.pathParameters.lowPrice,
    highPrice: event.pathParameters.highPrice,
  };

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression:
      "(#price <= :highPrice and #price >= :lowPrice) AND CONTAINS(#subjects, :subjects) AND (#experience > :experience)",
    ExpressionAttributeNames: {
      "#price": "price",
      "#subject": "subject",
      "#experience": "experience",
    },
    ExpressionAttributeValues: {
      ":subject": SEARCH_KEYWORD.subject,
      ":lowPrice": Number(SEARCH_KEYWORD.lowPrice),
      ":highPrice": Number(SEARCH_KEYWORD.highPrice),
      ":experience": Number(SEARCH_KEYWORD.experience),
    },
  };
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the tutors.",
      });
      return;
    }
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
