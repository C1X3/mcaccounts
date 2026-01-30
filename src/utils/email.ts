import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { OrderCompleteTemplate } from "@/views/emails/order-complete";
import { CodeReplacedTemplate } from "@/views/emails/code-replaced";
import { PaymentType } from "@generated/client";

// Configure the email transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.zeptomail.com",
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Base email sending function
async function sendEmail({
  from = "noreply@mccapes.net",
  to,
  subject,
  html,
}: {
  from?: string;
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendOrderCompleteEmail({
  customerName,
  customerEmail,
  orderId,
  items,
  totalPrice,
  paymentFee,
  totalWithFee,
  paymentType,
  orderDate,
}: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    codes?: string[];
    image?: string;
  }>;
  totalPrice: number;
  paymentFee: number;
  totalWithFee: number;
  paymentType: PaymentType;
  orderDate: string;
}) {
  const html = await render(
    OrderCompleteTemplate({
      customerName,
      customerEmail,
      orderId,
      items,
      totalPrice,
      paymentFee,
      totalWithFee,
      paymentType,
      orderDate,
    }),
  );

  return sendEmail({
    to: customerEmail,
    subject: `Order Complete: Your purchase is ready!`,
    html,
  });
}

export async function sendCodeReplacedEmail({
  customerName,
  customerEmail,
  orderId,
  productName,
  oldCode,
  newCode,
}: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  productName: string;
  oldCode: string;
  newCode: string;
}) {
  const html = await render(
    CodeReplacedTemplate({
      customerName,
      customerEmail,
      orderId,
      productName,
      oldCode,
      newCode,
    }),
  );

  return sendEmail({
    to: customerEmail,
    subject: `Code Replacement Notice - Order #${orderId.substring(0, 8)}`,
    html,
  });
}
