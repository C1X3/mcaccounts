"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    CartItem,
    Product,
    getCart,
    saveCart,
    updateCartExpiration,
    clearCart as clearLocalStorageCart
} from '@/utils/cart';
import toast from 'react-hot-toast';

type CartContextType = {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    isLoading: boolean;
    addItem: (product: Product, quantity?: number) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize cart from localStorage
    useEffect(() => {
        const loadCart = () => {
            const storedCart = getCart();
            setItems(storedCart?.items || []);
            setIsLoading(false);
        };

        loadCart();
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        // Skip during initial loading
        if (isLoading) return;

        saveCart(items);
    }, [items, isLoading]);

    // Calculate total items
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    // Calculate total price
    const totalPrice = items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    // Add item to cart
    const addItem = (product: Product, quantity = 1) => {
        const idx = items.findIndex(item => item.product.id === product.id);
        const currentQty = idx >= 0 ? items[idx].quantity : 0;

        if (currentQty + quantity > product.stock) {
            const available = product.stock - currentQty;
            toast.error(
                available > 0
                    ? `Only ${available} more "${product.name}" in stock.`
                    : `"${product.name}" is out of stock.`
            );
            return;
        }

        const newItems: CartItem[] =
            idx >= 0
                ? items.map((item, i) =>
                    i === idx ? { ...item, quantity: item.quantity + quantity } : item
                )
                : [...items, { id: `${product.id}-${Date.now()}`, product, quantity }];

        setItems(newItems);

        toast.success(`Added x${quantity} "${product.name}" to cart`);
        updateCartExpiration();
    };

    // Update item quantity (with stock check)
    const updateQuantity = (productId: string, quantity: number) => {
        // find the item index
        const idx = items.findIndex(item => item.product.id === productId);

        // nothing to do if not found
        if (idx < 0) return;

        const currentItem = items[idx];
        const maxStock = currentItem.product.stock;

        // invalid quantity or exceeding stock?
        if (quantity <= 0) {
            // you might choose to remove the item here instead:
            // return removeItem(productId);
            return;
        }
        if (quantity > maxStock) {
            const available = maxStock;
            toast.error(
                available > 0
                    ? `Only ${available} "${currentItem.product.name}" in stock.`
                    : `"${currentItem.product.name}" is out of stock.`
            );
            return;
        }

        // build the new array just once
        const newItems = items.map(item =>
            item.product.id === productId
                ? { ...item, quantity }
                : item
        );

        setItems(newItems);
        updateCartExpiration();
    };

    // Remove item from cart
    const removeItem = (productId: string) => {
        // filter out the one item
        const newItems = items.filter(item => item.product.id !== productId);

        // if length didn’t change, nothing to do
        if (newItems.length === items.length) return;

        setItems(newItems);
        updateCartExpiration();
    };

    // Clear cart
    const clearCart = () => {
        setItems([]);
        clearLocalStorageCart();
    };

    // Context value
    const value = {
        items,
        totalItems,
        totalPrice,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};