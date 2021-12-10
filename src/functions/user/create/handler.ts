import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { searchDataFunc, savDataFunc } from "@libs/dynamodb";
import schema from "./schema";
import { v4 } from "uuid";

const createUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { firstName, lastName, email, dateOfBirth } = event.body;

    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      dateOfBirth !== ""
    ) {
      const id = "user-" + v4();
      const date = new Date().toISOString().slice(0, 10);

      const query = {
        TableName: "StoreTable",
        Item: {
          id,
          firstName,
          lastName,
          email,
          dateOfBirth,
          emailVerified: false,
          createDate: date,
        },
      };
      const check = {
        TableName: "StoreTable",
        ProjectionExpression: "email",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      };

      const check_response = await searchDataFunc(check);

      if (check_response.Count > 0) {
        return formatJSONResponse({
          statusCode: 409,
          message: "Email already Taken",
        });
      } else {
        const response = await savDataFunc(query);
        if (response) {
          return formatJSONResponse({
            statusCode: 200,
            message: query.Item,
          });
        }
      }
    } else {
      return formatJSONResponse({
        statusCode: 400,
        message: "Missing Required Information",
      });
    }
  } catch (err) {
    return formatJSONResponse({
      statusCode: 400,
      message: err,
    });
  }
};

export const main = middyfy(createUser);
