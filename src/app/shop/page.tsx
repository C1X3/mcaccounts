"use server";

import { HydrateClient, prefetch, trpc } from "@/server/server";
import ShopPage from "@/views/shop/ShopPage";

const Page = async () => {
    prefetch(
        trpc.product.getAll.queryOptions()
    );

    return (
        <HydrateClient>
            <ShopPage />
        </HydrateClient>
    );
};

export default Page;