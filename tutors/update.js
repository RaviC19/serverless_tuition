"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      "#firstName": "firstName",
      "#subjects": "subjects",
      "#biography": "biography",
      "#lastName": "lastName",
      "#experience": "experience",
      "#imageURL": "imageURL",
      "#videoURL": "videoURL",
      "#student": "student",
      "#price": "price",
      "#rating": "rating",
      "#teachingLevel": "teachingLevel",
      "#tutorLocation": "tutorLocation",
    },
    ExpressionAttributeValues: {
      ":firstName": data.firstName,
      ":subjects": data.subjects,
      ":biography": data.biography,
      ":lastName": data.lastName,
      ":experience": data.experience,
      ":imageURL": data.imageURL,
      ":videoURL": data.videoURL,
      ":student": data.student,
      ":price": data.price,
      ":rating": data.rating,
      ":teachingLevel": data.teachingLevel,
      ":tutorLocation": data.tutorLocation,
    },
    UpdateExpression:
      "SET #firstName = :firstName, #subjects = :subjects, #biography = :biography, #lastName = :lastName, #experience = :experience, #imageURL = :imageURL, #videoURL = :videoURL, #student = :student, #price = :price, #rating = :rating, #tutorLocation = :tutorLocation, #teachingLevel = :teachingLevel",
    ReturnValues: "ALL_NEW",
  };

  // update the tutor in the database
  dynamoDb.update(params, (error, result) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
