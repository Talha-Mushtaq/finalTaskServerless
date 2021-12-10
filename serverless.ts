import type { AWS } from "@serverless/typescript";

import {
  createUser,
  getUser,
  deleteUser,
  updateUser,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  createOrder,
  getOrder,
  deleteOrder,
  updateOrder,
} from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "finaltaskserverless",
  frameworkVersion: "2",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-dynamodb-local",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: {
    createUser,
    getUser,
    deleteUser,
    updateUser,
    createProduct,
    getProduct,
    deleteProduct,
    updateProduct,
    createOrder,
    getOrder,
    deleteOrder,
    updateOrder,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        migrate: true,
        seed: true,
      },
    },
  },
  resources: {
    Resources: {
      DatabaseResource: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "StoreTable",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
