import { createTRPCRouter } from "../init";
import { productRouter } from "./product";
import { authenticationRouter } from "./authentication";

export const appRouter = createTRPCRouter({
  product: productRouter,
  auth: authenticationRouter
});

export type AppRouter = typeof appRouter;
