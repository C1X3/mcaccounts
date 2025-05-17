"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { formatPrice } from "@/utils/formatting";

const CartPage = () => {
    const { items, totalItems, totalPrice, isLoading, updateQuantity, removeItem } = useCart();

    if (isLoading) {
        return (
            <div className="container mx-auto py-16 px-4">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto py-16 px-4">
                <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-xl mb-4">Your cart is empty</h2>
                    <p className="mb-8 text-gray-600">Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/products">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[var(--primary)] text-white px-6 py-3 rounded-full"
                        >
                            Browse Products
                        </motion.button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-8">Your Cart ({totalItems} items)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="divide-y divide-gray-200">
                            {items.map((item) => (
                                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center">
                                    <div className="flex-shrink-0 w-24 h-24 mb-4 sm:mb-0 relative">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>

                                    <div className="flex-grow sm:ml-6">
                                        <h3 className="text-lg font-semibold">{item.product.name}</h3>
                                        <p className="text-[var(--primary)] font-semibold mt-1">
                                            {formatPrice(item.product.price)}
                                        </p>
                                    </div>

                                    <div className="flex items-center mt-4 sm:mt-0">
                                        <div className="flex items-center border border-gray-200 rounded-full">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[var(--primary)]"
                                                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                disabled={item.quantity <= 1}
                                            >
                                                <FaMinus size={12} />
                                            </motion.button>

                                            <span className="w-10 text-center">{item.quantity}</span>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[var(--primary)]"
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            >
                                                <FaPlus size={12} />
                                            </motion.button>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="ml-4 text-red-500 hover:text-red-700"
                                            onClick={() => removeItem(item.product.id)}
                                        >
                                            <FaTrash />
                                        </motion.button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span className="text-[var(--primary)]">{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full bg-[var(--primary)] text-white py-3 rounded-full font-medium"
                        >
                            Proceed to Checkout
                        </motion.button>

                        <Link href="/products">
                            <div className="text-center mt-4 text-[var(--primary)] hover:underline cursor-pointer">
                                Continue Shopping
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
