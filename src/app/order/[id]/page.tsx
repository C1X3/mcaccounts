import OrderPage from "@/views/order/OrderPage";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    if (!id) redirect("/");

    return <OrderPage id={id} />;
};

export default Page;