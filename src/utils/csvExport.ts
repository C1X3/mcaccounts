import { getPaymentMethodName } from "@/utils/invoiceUtils";
import { PaymentType } from "@generated";

export interface Invoice {
  id: string;
  status: string;
  createdAt: Date;
  totalPrice: number;
  paymentType: PaymentType;
  customer?: {
    email?: string | null;
    discord?: string | null;
  } | null;
  OrderItem?: Array<{
    product: {
      name: string;
    };
    codes: string[];
    price: number;
    quantity: number;
  }>;
}

export const exportInvoicesToCSV = (invoices: Invoice[]) => {
  // Create CSV headers
  const headers = [
    "Status",
    "Product",
    "Code(s)",
    "",
    "Date Sold",
    "Payment Method",
    "Amount",
    "Discount",
    "Fees",
    "",
    "",
    "",
    "Buyer Email",
    "Buyer Discord",
    ""
  ].join(",");

  // Map invoices to CSV rows
  const rows = invoices.map(invoice => {
    // For each product in the order, create a separate row
    if (invoice.OrderItem && invoice.OrderItem.length > 0) {
      return invoice.OrderItem.map(item => [
        invoice.status,
        item.product.name,
        `"${item.codes.join(",")}"`,
        "",
        new Date(invoice.createdAt).toISOString().split("T")[0],
        getPaymentMethodName(invoice.paymentType),
        (item.price * item.quantity).toFixed(2),
        "0.00", // Placeholder for discount
        "0.00", // Placeholder for fees
        "",
        "",
        "",
        invoice.customer?.email || "N/A",
        invoice.customer?.discord || "N/A",
        ""
      ].join(",")).join("\n");
    } else {
      // Fallback for invoices without items
      return [
        invoice.status,
        "N/A",
        "",
        "",
        new Date(invoice.createdAt).toISOString().split("T")[0],
        getPaymentMethodName(invoice.paymentType),
        invoice.totalPrice.toFixed(2),
        "0.00",
        "0.00",
        "",
        "",
        "",
        invoice.customer?.email || "N/A",
        invoice.customer?.discord || "N/A",
        ""
      ].join(",");
    }
  }).join("\n");

  const csvContent = [headers, rows].join("\n");

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `invoices_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
