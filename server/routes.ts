import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ error: "Invalid appointment data" });
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

  const httpServer = createServer(app);

  return httpServer;
}
