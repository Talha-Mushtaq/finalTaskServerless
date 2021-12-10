import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { savDataFunc } from "@libs/dynamodb";
import schema from "./schema";

const createOrder: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { Orderid, products, TotalPrice, UserID, UserName } = event.body;

    const query = {
      TableName: "StoreTable",
      Item: {
        id: Orderid,
        products,
        TotalPrice,
        UserID,
        UserName,
      },
    };

    const response = await savDataFunc(query);
    if (response) {
      return formatJSONResponse({
        statusCode: 200,
        message: {
          message: "Order Placed",
        },
      });
    } else {
      return formatJSONResponse({
        statusCode: 200,
        message: {
          message: "Order Not Placed",
        },
      });
    }
  } catch (err) {
    return formatJSONResponse({
      statusCode: 400,
      message: err,
    });
  }
};

export const main = middyfy(createOrder);
