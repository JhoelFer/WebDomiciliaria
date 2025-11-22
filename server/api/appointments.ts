import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  // Manejar CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const backendURL = "https://ab09c429-fccd-49d5-8cac-5b4ea9caf0e9-00-3jgf16yawkg1l.riker.replit.dev";

    const response = await fetch(`${backendURL}/api/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    // Agregar headers CORS a la respuesta
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Error interno en la API" });
  }
}
