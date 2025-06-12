import { OrderStatus, PaymentType } from "@generated";

// Utility function to get payment method display name
export const getPaymentMethodName = (method: PaymentType): string => {
  switch (method) {
    case PaymentType.STRIPE:
      return "Stripe";
    case PaymentType.PAYPAL:
      return "PayPal";
    case PaymentType.CRYPTO:
      return "Crypto";
    default:
      return method;
  }
};

// Utility function to get status badge styling
export const getStatusBadgeClass = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PAID:
      return "bg-green-100 text-green-800";
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case OrderStatus.DELIVERED:
      return "bg-green-100 text-green-800";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Utility function to format date
export const formatDate = (date: Date, format: 'short' | 'long' = 'short'): string => {
  if (format === 'long') {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
};
