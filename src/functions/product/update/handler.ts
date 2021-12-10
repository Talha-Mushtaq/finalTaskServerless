import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getDataFunc, updateDataFunc } from "@libs/dynamodb";
import schema from "./schema";

const updateProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    const { id } = event.pathParameters;
    const { title, description, price, categories } = event.body;

    const query = {
      TableName: "StoreTable",
      Key: {
        id: id,
      },
      UpdateExpression:
        "SET title = :title , description = :description , price = :price , categories = :categories",
      ExpressionAttributeValues: {
        ":title": title,
        ":description": description,
        ":price": price,
        ":categories": categories,
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
          message: { message: "Product updated" },
        });
      } else {
        return formatJSONResponse({
          message: { message: "Product not updated" },
        });
      }
    } else {
      return formatJSONResponse({
        statusCode: 400,
        message: { message: "Product Not Found" },
      });
    }
  } catch (err) {
    return formatJSONResponse({
      statusCode: 400,
      message: err,
    });
  }
};

export const main = middyfy(updateProduct);
