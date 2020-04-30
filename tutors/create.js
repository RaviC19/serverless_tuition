"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body);

  // if (typeof data.name !== "string") {
  //   console.error("Validation Failed");
  //   callback(null, {
  //     statusCode: 400,
  //     headers: { "Content-Type": "text/plain" },
  //     body: "Couldn't create the tutors item.",
  //   });
  //   return;
  // }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      firstName: data.firstName,
      lastName: data.lastName,
      subjects: data.subjects,
      imageURL: data.imageURL,
      videoURL: data.videoURL,
      biography: data.biography,
      teachingLevel: data.teachingLevel,
      price: data.price,
      tutorLocation: data.tutorLocation,
      experience: data.experience,
      rating: data.rating,
      student: false,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't create the tutors item.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
