import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getDataFunc } from "@libs/dynamodb";
import schema from "./schema";

const getProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { id } = event.pathParameters;
    const check = {
      TableName: "StoreTable",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    };

    const check_response = await getDataFunc(check);

    if (check_response.Count > 0) {
      return formatJSONResponse({
        statusCode: 200,
        message: { message: check_response.Items },
      });
    } else {
      return formatJSONResponse({
        statusCode: 404,
        message: "Product Not Found",
      });
    }
  } catch (err) {
    return formatJSONResponse({
      statusCode: 400,
      message: err,
    });
  }
};

export const main = middyfy(getProduct);
