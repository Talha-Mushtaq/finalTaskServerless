import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getDataFunc } from "@libs/dynamodb";
import schema from "./schema";

const getUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { userId } = event.pathParameters;
    const check = {
      TableName: "StoreTable",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": userId,
      },
    };

    const check_response = await getDataFunc(check);

    if (check_response.Count > 0) {
      let data = check_response.Items[0];
      data.emailVerified = true;
      data.signUpDate = data.createDate;
      delete data.createDate;

      return formatJSONResponse({
        statusCode: 200,
        message: data,
      });
    } else {
      return formatJSONResponse({
        statusCode: 404,
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

export const main = middyfy(getUser);
