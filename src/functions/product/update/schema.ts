export default {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    price: { type: "string" },
    categories: { type: "string" },
  },
  require: [],
} as const;
