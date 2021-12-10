export default {
  type: "object",
  properties: {
    Orderid: { type: "string" },
    products: { type: "array" },
    TotalPrice: { type: "string" },
    UserID: { type: "string" },
    UserName: { type: "string" },
  },
  require: [],
} as const;
