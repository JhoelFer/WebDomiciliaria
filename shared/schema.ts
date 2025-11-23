import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Validador flexible para números argentinos
const validateArgentinePhone = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, "");
  
  // Acepta formatos como:
  // 5493814468379 (con 54 código país)
  // 93814468379 (sin 54)
  // 381 4468379 (con espacios/guiones)
  // +54 9 381 446 8379
  
  if (cleanPhone.startsWith("54")) {
    // Si empieza con 54, debe tener 13 dígitos (54 + 9 + 10)
    return cleanPhone.length === 13;
  } else {
    // Si no empieza con 54, debe tener 10 dígitos (9 + 10) o 11 dígitos (con 9)
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  }
};

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const quotations = pgTable("quotations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  serviceType: text("service_type").notNull(), // landing, corporate, ecommerce
  pages: integer("pages").notNull().default(1),
  customDesign: text("custom_design").notNull().default("no"), // yes/no
  integrations: text("integrations").notNull().default("none"), // none, mercadopago, zapier, etc
  urgency: text("urgency").notNull().default("standard"), // standard, urgent
  discount: integer("discount").notNull().default(0), // percentage
  totalPrice: integer("total_price").notNull(), // in ARS cents
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  status: true,
}).refine((data) => {
  return validateArgentinePhone(data.phone);
}, {
  message: "Número de teléfono argentino inválido. Usa formato como: +54 9 381 446 8379 o 3814468379",
  path: ["phone"],
});

export const insertQuotationSchema = createInsertSchema(quotations).omit({
  id: true,
  createdAt: true,
  status: true,
}).refine((data) => {
  return validateArgentinePhone(data.phone);
}, {
  message: "Número de teléfono argentino inválido. Usa formato como: +54 9 381 446 8379 o 3814468379",
  path: ["phone"],
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertQuotation = z.infer<typeof insertQuotationSchema>;
export type Quotation = typeof quotations.$inferSelect;
