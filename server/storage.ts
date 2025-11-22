import { type Appointment, type InsertAppointment, appointments } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, gte } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByDateRange(startDate: string): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined>;
  getConfirmedAppointments(): Promise<Appointment[]>;
}

export class DatabaseStorage implements IStorage {
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(insertAppointment)
      .returning();
    return appointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments).orderBy(appointments.createdAt);
  }

  async getAppointmentsByDateRange(startDate: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(gte(appointments.date, startDate))
      .orderBy(appointments.date, appointments.time);
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async getConfirmedAppointments(): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.status, "confirmed"), gte(appointments.date, today)))
      .orderBy(appointments.date, appointments.time);
  }
}

export const storage = new DatabaseStorage();
