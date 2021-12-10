import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getDataFunc, updateDataFunc } from "@libs/dynamodb";
import schema from "./schema";

const updateOrder: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { id } = event.pathParameters;
    const { Orderid, products, TotalPrice, UserID, UserName } = event.body;

    const query = {
      TableName: "StoreTable",
      Key: {
        id: id,
      },
      UpdateExpression:
        "SET products = :products , TotalPrice = :TotalPrice , UserID = :UserID , UserName = :UserName",
      ExpressionAttributeValues: {
        ":products": products,
        ":TotalPrice": TotalPrice,
        ":UserID": UserID,
        ":UserName": UserName,
      },
    };
    const check = {
      TableName: "StoreTable",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    };
    const check_response = await getDataFunc(check);

    if (check_response.Count > 0) {
      const response = await updateDataFunc(query);

      if (Object.keys(response).length === 0) {
        return formatJSONResponse({
          statusCode: 200,
          message: { message: "Order updated" },
        });
      } else {
        return formatJSONResponse({
          statusCode: 400,
          message: { message: "Order not updated" },
        });
      }
    } else {
      return formatJSONResponse({
        statusCode: 400,
        message: { message: "Order Not Found" },
      });
    }
  } catch (err) {
    return formatJSONResponse({
      statusCode: 400,
      message: err,
    });
  }
};

export const main = middyfy(updateOrder);
