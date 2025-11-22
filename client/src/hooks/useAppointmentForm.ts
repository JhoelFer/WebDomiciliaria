import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const BACKEND_URL = "https://ab09c429-fccd-49d5-8cac-5b4ea9caf0e9-00-3jgf16yawkg1l.riker.replit.dev";
const WHATSAPP_NUMBER = "5493814468379";

export interface FormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  message: string;
}

export interface UseAppointmentFormReturn {
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  errorMessage: string;
  successMessage: string;
  isSubmitting: boolean;
  bookedSlots: string[];
  availableHours: string[];
  isSlotBooked: (time: string) => boolean;
  clearMessages: () => void;
}

export function useAppointmentForm(): UseAppointmentFormReturn {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    date: "",
    time: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: bookedSlots = [] } = useQuery({
    queryKey: ["bookedSlots", formData.date],
    queryFn: async () => {
      if (!formData.date) return [];
      const res = await fetch(`${BACKEND_URL}/api/appointments/booked-slots?date=${formData.date}`);
      return res.json();
    },
    enabled: !!formData.date,
  });

  const availableHours = [
    "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const validateArgentinePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("54")) {
      return cleanPhone.length === 13;
    } else {
      return cleanPhone.length === 10 || cleanPhone.length === 11;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    // Validaciones en el frontend
    if (!formData.name.trim()) {
      setErrorMessage("Por favor, ingresa tu nombre.");
      setIsSubmitting(false);
      return;
    }

    if (!validateArgentinePhone(formData.phone)) {
      setErrorMessage("Número de teléfono inválido. Usa formatos como: +54 9 381 446 8379 o 3814468379");
      setIsSubmitting(false);
      return;
    }

    if (!formData.date) {
      setErrorMessage("Por favor, selecciona una fecha.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.time) {
      setErrorMessage("Por favor, selecciona una hora.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const text = `Hola Jhoel, soy ${formData.name}. Me gustaría agendar una visita para el día ${formData.date} a las ${formData.time}. 
    
Mi teléfono es: ${formData.phone}
Detalles: ${formData.message || "Sin detalles adicionales"}`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');
        
        setSuccessMessage("¡Solicitud registrada! Se abrirá WhatsApp para confirmar los detalles.");
        setFormData({ name: "", phone: "", date: "", time: "", message: "" });
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        try {
          const errorData = await response.json();
          setErrorMessage(errorData.error || "Error al guardar la solicitud. Por favor intenta de nuevo.");
        } catch {
          setErrorMessage(`Error ${response.status}: Intenta de nuevo o verifica tu conexión.`);
        }
      }
    } catch (error: any) {
      console.error("Error details:", error);
      if (error.message === "Failed to fetch") {
        setErrorMessage("No se puede conectar al servidor. Recarga la página (F5) e intenta de nuevo.");
      } else {
        setErrorMessage("Error de conexión. Verifica tu internet e intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSlotBooked = (time: string): boolean => bookedSlots.includes(time);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    errorMessage,
    successMessage,
    isSubmitting,
    bookedSlots,
    availableHours,
    isSlotBooked,
    clearMessages
  };
}
