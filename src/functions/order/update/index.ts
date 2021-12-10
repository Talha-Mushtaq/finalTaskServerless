import { handlerPath } from "@libs/handlerResolver";
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "put",
        path: "order/{id}",
        request: {
          schema: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
