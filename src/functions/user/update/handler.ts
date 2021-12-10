import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getDataFunc, updateDataFunc } from "@libs/dynamodb";
import schema from "./schema";

const updateUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { userId } = event.pathParameters;
    const { firstName } = event.body;

    const query = {
      TableName: "StoreTable",
      Key: {
        id: userId,
      },
      UpdateExpression: "SET firstName = :firstName",
      ExpressionAttributeValues: {
        ":firstName": firstName,
      },
      ReturnValues: "ALL_NEW",
    };
    const check = {
      TableName: "StoreTable",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": userId,
      },
    };
    const check_response = await getDataFunc(check);

    if (check_response.Count > 0) {
      const e = check_response.Items[0].email;

      if (e === event.body.email) {
        return formatJSONResponse({
          statusCode: 400,
          message: "Email Already Taken",
        });
      } else {
        const response = await updateDataFunc(query);
        console.log(response);

        return formatJSONResponse({
          message: response.Attributes,
        });
      }
    } else {
      return formatJSONResponse({
        statusCode: 400,
        message: "User Not Found",
      });
    }
  } catch (err) {
    return formatJSONResponse({
      statusCode: 400,
      message: err,
    });
  }
};

export const main = middyfy(updateUser);
