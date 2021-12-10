export default {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    dateOfBirth: { type: "string" },
  },
  require: [],
} as const;
