"use server";

import { prefetch, trpc } from "@/server/server";
import HomePage from "@/views/homepage";

const Page = async () => {
  prefetch(
    trpc.product.getAll.queryOptions()
  );

  return (
    <HomePage />
  );
};

export default Page;