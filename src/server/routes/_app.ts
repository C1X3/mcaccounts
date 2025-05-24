import { inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "../init";
import { analyticsRouter } from "./analytics";
import { authenticationRouter } from "./authentication";
import { checkoutRouter } from "./checkout";
import { couponRouter } from "./coupon";
import { productRouter } from "./product";
import { invoicesRouter } from "./invoices";
<<<<<<< HEAD
=======
import { articleRouter } from "./article";
>>>>>>> 4fe6dbf (All of version 2)

export const appRouter = createTRPCRouter({
  product: productRouter,
  auth: authenticationRouter,
  checkout: checkoutRouter,
  analytics: analyticsRouter,
  coupon: couponRouter,
  invoices: invoicesRouter,
<<<<<<< HEAD
=======
  article: articleRouter,
>>>>>>> 4fe6dbf (All of version 2)
});

export type AppRouter = typeof appRouter;
type RouterOutput = inferRouterOutputs<AppRouter>;
export type ProductGetAllOutput = RouterOutput["product"]["getAll"];
