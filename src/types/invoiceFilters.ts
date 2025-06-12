import { OrderStatus, PaymentType } from "@generated";

// Interface for invoice filter state
export interface InvoiceFilters {
  statusFilter: OrderStatus | "ALL";
  paymentFilter: PaymentType | "ALL";
  productFilter: string;
  emailFilter: string;
  discordFilter: string;
  couponFilter: string;
  codeFilter: string;
  paypalNoteFilter: string;
  invoiceIdFilter: string;
  dateProcessedFilter: string;
}

// Default filter values
export const defaultFilters: InvoiceFilters = {
  statusFilter: "ALL",
  paymentFilter: "ALL",
  productFilter: "",
  emailFilter: "",
  discordFilter: "",
  couponFilter: "",
  codeFilter: "",
  paypalNoteFilter: "",
  invoiceIdFilter: "",
  dateProcessedFilter: "",
};
