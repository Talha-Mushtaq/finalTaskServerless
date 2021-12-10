import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { deleteDataFunc } from "@libs/dynamodb";
import schema from "./schema";

const deleteUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { id } = event.pathParameters;
    const check = {
      TableName: "StoreTable",
      Key: {
        id: id,
      },
    };

    const check_response = await deleteDataFunc(check);

    if (Object.keys(check_response).length === 0) {
      return formatJSONResponse({
        statusCode: 200,
        message: { message: "Product deleted" },
      });
    } else {
      return formatJSONResponse({
        statusCode: 404,
        message: { message: "Product not deleted" },
      });
    }
  } catch (err) {
    return formatJSONResponse({
      statusCode: 400,
      message: err,
    });
  }
};

export const main = middyfy(deleteUser);
