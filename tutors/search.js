"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.search = (event, context, callback) => {
  console.log(event);
  const SEARCH_KEYWORD = {
    subjects: event.pathParameters.subjects,
  };

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: "contains(#subjects, :subjects)",
    ExpressionAttributeNames: {
      "#subjects": "subjects",
    },
    ExpressionAttributeValues: {
      ":subjects": SEARCH_KEYWORD.subjects,
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
      headers: {
        "Content-Type": "application/json",
        "x-custom-header": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
    callback(null, response);
  });
};
