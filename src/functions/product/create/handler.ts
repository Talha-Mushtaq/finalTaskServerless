import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { savDataFunc } from "@libs/dynamodb";
import schema from "./schema";

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { id, title, description, price, categories } = event.body;
    console.log(event.body);

    const query = {
      TableName: "StoreTable",
      Item: {
        id,
        title,
        description,
        price,
        categories,
      },
    };

    const response = await savDataFunc(query);
    if (response) {
      return formatJSONResponse({
        statusCode: 200,
        message: {
          message: "Product Created",
        },
      });
    } else {
      return formatJSONResponse({
        statusCode: 200,
        message: {
          message: "Product Not Created",
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

export const main = middyfy(createProduct);
