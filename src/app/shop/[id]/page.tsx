import { prisma } from "@/utils/prisma";
import ProductPage from "@/views/product/ProductPage";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    return <ProductPage product={product || undefined} />
}

export default Page;