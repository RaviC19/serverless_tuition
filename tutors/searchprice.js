"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.searchprice = (event, context, callback) => {
  console.log(event.pathParameters.price);
  console.log(process.env.DYNAMODB_TABLE);
  const SEARCH_KEYWORD = {
    price: event.pathParameters.price,
  };

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: "#price = :price",
    ExpressionAttributeNames: {
      "#price": "price",
    },
    ExpressionAttributeValues: {
      ":price": Number(SEARCH_KEYWORD.price),
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
