import { z } from "zod";

export const InvoiceItemSchema = z.object({
  description: z.string(),
  quantity: z.number().nonnegative().default(1),
  unitPrice: z.number().nonnegative().default(0),
  total: z.number().nonnegative().default(0),
});

export const BusinessSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postCode: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  sortCode: z.string().optional(),
  logo: z.string().url().optional(),
});

export const CustomerSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postCode: z.string().optional(),
});

export const InvoiceSchema = z.object({
  invoiceNumber: z.string().default("INV-0001"),
  date: z.date(),
  dueDate: z.date(),
  business: BusinessSchema,
  customer: CustomerSchema,
  items: z.array(InvoiceItemSchema),
  subtotal: z.number().nonnegative().default(0),
  vatRate: z.number().nonnegative().default(0).optional(),
  vatAmount: z.number().nonnegative().optional().default(0),
  total: z.number().nonnegative().default(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type Business = z.infer<typeof BusinessSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
