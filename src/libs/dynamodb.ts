const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

export const savDataFunc = async (params) => {
  const response = await dynamoDB.put(params).promise();
  return response;
};
export const searchDataFunc = async (params) => {
  const response = await dynamoDB.scan(params).promise();
  return response;
};
export const getDataFunc = async (params) => {
  const response = await dynamoDB.query(params).promise();
  return response;
};
export const deleteDataFunc = async (params) => {
  const response = await dynamoDB.delete(params).promise();
  return response;
};
export const updateDataFunc = async (params) => {
  const response = await dynamoDB.update(params).promise();
  return response;
};
