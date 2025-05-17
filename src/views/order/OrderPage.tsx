"use client";

import React, { useEffect, useState } from "react";
import { formatPrice } from "@/utils/formatting";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCheck, FaClock, FaExclamationTriangle, FaShippingFast, FaTimesCircle } from "react-icons/fa";
import { useTRPC } from "@/server/client";
import { useQuery } from "@tanstack/react-query";

type OrderStatusType = "PENDING" | "PAID" | "DELIVERED" | "CANCELLED";

const StatusBadge = ({ status }: { status: OrderStatusType }) => {
    let color = "";
    let Icon = FaClock;
    let text = "Processing";

    switch (status) {
        case "PENDING":
            color = "bg-yellow-500";
            Icon = FaClock;
            text = "Pending Payment";
            break;
        case "PAID":
            color = "bg-green-500";
            Icon = FaCheck;
            text = "Payment Confirmed";
            break;
        case "DELIVERED":
            color = "bg-blue-500";
            Icon = FaShippingFast;
            text = "Delivered";
            break;
        case "CANCELLED":
            color = "bg-red-500";
            Icon = FaTimesCircle;
            text = "Cancelled";
            break;
    }

    return (
        <div className={`px-4 py-2 ${color} rounded-full text-white inline-flex items-center`}>
            <Icon className="mr-2" />
            {text}
        </div>
    );
};

const OrderPage = ({ id }: { id: string }) => {
    const trpc = useTRPC();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: order, isLoading: isOrderLoading, error: orderError } = useQuery(trpc.checkout.getOrderStatus.queryOptions(
        { orderId: id as string },
        {
            enabled: !!id,
            retry: 3,
            retryDelay: 1000,
        }
    ));

    useEffect(() => {
        if (orderError) {
            setError(orderError.message || "Failed to load order");
            setIsLoading(false);
        } else if (!isOrderLoading) {
            setIsLoading(false);
        }
    }, [isOrderLoading, orderError]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background)]">
                <header className="py-8">
                    <Navbar />
                </header>
                <div className="container mx-auto px-4 flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--background)]">
                <header className="py-8">
                    <Navbar />
                </header>
                <div className="container mx-auto px-4 flex-grow">
                    <div className="max-w-4xl mx-auto py-16">
                        <div className="bg-gradient-to-b from-[color-mix(in_srgb,var(--background),#333_10%)] to-[var(--background)] rounded-xl p-8 border border-[color-mix(in_srgb,var(--foreground),var(--background)_90%)] shadow-xl">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-red-500/10 text-red-500">
                                    <FaExclamationTriangle size={28} />
                                </div>
                                <h1 className="text-2xl font-bold mb-4 text-[var(--foreground)]">Order Not Found</h1>
                                <p className="text-[color-mix(in_srgb,var(--foreground),#888_40%)] mb-8">
                                    {error || "We couldn't find the order you're looking for."}
                                </p>
                                <Link href="/shop">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-lg"
                                    >
                                        Return to Shop
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Calculate order totals
    const subtotal = order.OrderItem.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.0725; // 7.25% tax
    const total = subtotal + tax;

    const customerInfo = order.CustomerInformation[0];

    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)]">
            <header className="py-8">
                <Navbar />
            </header>

            <div className="container mx-auto px-4 flex-grow">
                <div className="max-w-5xl mx-auto py-12">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">Order Details</h1>
                        <div className="h-1 w-20 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            {/* Order Status Card */}
                            <div className="bg-gradient-to-b from-[color-mix(in_srgb,var(--background),#333_10%)] to-[var(--background)] rounded-xl p-6 border border-[color-mix(in_srgb,var(--foreground),var(--background)_90%)] shadow-md backdrop-blur-sm">
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-[var(--foreground)]">Order #{order.id.substring(0, 8)}</h2>
                                        <p className="text-[color-mix(in_srgb,var(--foreground),#888_40%)] text-sm">
                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <StatusBadge status={order.status as OrderStatusType} />
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-gradient-to-b from-[color-mix(in_srgb,var(--background),#333_10%)] to-[var(--background)] rounded-xl p-6 border border-[color-mix(in_srgb,var(--foreground),var(--background)_90%)] shadow-md backdrop-blur-sm">
                                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Items</h2>
                                <div className="space-y-4">
                                    {order.OrderItem.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-[color-mix(in_srgb,var(--foreground),var(--background)_90%)] last:border-0">
                                            <div className="w-16 h-16 relative bg-gradient-to-br from-[color-mix(in_srgb,var(--primary),#fff_95%)] to-[color-mix(in_srgb,var(--secondary),#fff_95%)] rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-contain p-2"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-medium text-[var(--foreground)]">{item.product.name}</h3>
                                                <p className="text-sm text-[color-mix(in_srgb,var(--foreground),#888_40%)]">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-[var(--foreground)]">{formatPrice(item.price)}</p>
                                                <p className="text-sm text-[var(--primary)]">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            {/* Order Summary */}
                            <div className="bg-gradient-to-b from-[color-mix(in_srgb,var(--background),#333_10%)] to-[var(--background)] rounded-xl p-6 border border-[color-mix(in_srgb,var(--foreground),var(--background)_90%)] shadow-md backdrop-blur-sm sticky top-6">
                                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)] pb-2 border-b border-[color-mix(in_srgb,var(--foreground),var(--background)_90%)]">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-[color-mix(in_srgb,var(--foreground),#888_40%)]">Subtotal</span>
                                        <span className="text-[var(--foreground)]">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[color-mix(in_srgb,var(--foreground),#888_40%)]">Tax</span>
                                        <span className="text-[var(--foreground)]">{formatPrice(tax)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[color-mix(in_srgb,var(--foreground),#888_40%)]">Shipping</span>
                                        <span className="text-green-500">Free</span>
                                    </div>
                                    <div className="pt-3 mt-3 border-t border-[color-mix(in_srgb,var(--foreground),var(--background)_90%)]">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-[var(--foreground)]">Total</span>
                                            <span className="font-bold text-[var(--primary)]">{formatPrice(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="pt-3 border-t border-[color-mix(in_srgb,var(--foreground),var(--background)_90%)]">
                                    <p className="text-sm font-medium text-[var(--foreground)] mb-2">Payment Method</p>
                                    <p className="text-[color-mix(in_srgb,var(--foreground),#888_40%)]">
                                        {order.paymentType.replace('_', ' ')}
                                    </p>
                                </div>

                                {/* Customer Info */}
                                <div className="pt-3 mt-3 border-t border-[color-mix(in_srgb,var(--foreground),var(--background)_90%)]">
                                    <p className="text-sm font-medium text-[var(--foreground)] mb-2">Customer</p>
                                    <p className="text-[color-mix(in_srgb,var(--foreground),#888_40%)]">{customerInfo?.name}</p>
                                    <p className="text-[color-mix(in_srgb,var(--foreground),#888_40%)]">{customerInfo?.email}</p>
                                </div>

                                <Link href="/shop">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full mt-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-lg font-medium"
                                    >
                                        Continue Shopping
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default OrderPage; 