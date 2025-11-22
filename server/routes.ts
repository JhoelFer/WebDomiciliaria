import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";

// API routes for appointment management - production verified
export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.json(appointment);
    } catch (error: any) {
      // Manejo detallado de errores de validación
      if (error.errors && Array.isArray(error.errors)) {
        const phoneError = error.errors.find((e: any) => e.path.includes("phone"));
        if (phoneError) {
          return res.status(400).json({ error: "Número de teléfono argentino inválido. Usa formatos como: +54 9 381 446 8379 o 3814468379" });
        }
        const firstError = error.errors[0]?.message || "Datos inválidos";
        return res.status(400).json({ error: firstError });
      }
      res.status(400).json({ error: "Error al procesar tu solicitud. Verifica que todos los campos sean correctos." });
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/confirmed", async (req, res) => {
    try {
      const confirmedAppointments = await storage.getConfirmedAppointments();
      res.json(confirmedAppointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch confirmed appointments" });
    }
  });

  app.get("/api/appointments/booked-slots", async (req, res) => {
    try {
      const date = req.query.date as string;
      if (!date) {
        return res.status(400).json({ error: "Date parameter required" });
      }
      const confirmedAppointments = await storage.getConfirmedAppointments();
      const bookedSlots = confirmedAppointments
        .filter(a => a.date === date)
        .map(a => a.time);
      res.json(bookedSlots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booked slots" });
    }
  });

  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const appointment = await storage.updateAppointmentStatus(id, status);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const appointment = await storage.deleteAppointment(id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
