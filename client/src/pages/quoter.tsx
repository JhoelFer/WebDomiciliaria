import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, ArrowLeft, DollarSign, FileText, QrCode, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

const BACKEND_URL = "https://ab09c429-fccd-49d5-8cac-5b4ea9caf0e9-00-3jgf16yawkg1l.riker.replit.dev";
const WHATSAPP_NUMBER = "5493814468379";

interface QuotationFormData {
  name: string;
  phone: string;
  email: string;
  serviceType: "landing" | "corporate" | "ecommerce";
  pages: number;
  customDesign: "yes" | "no";
  integrations: string;
  urgency: "standard" | "urgent";
  discount: number;
}

const PRICING = {
  landing: 15000, // ARS base
  corporate: 25000,
  ecommerce: 40000,
};

const COSTS = {
  aiTools: 2000, // ChatGPT Plus, Midjourney monthly
  transportPerKm: 50, // ARS per km
  hourlyRate: 150, // USD equivalent
  margin: 0.35, // 35% margin
};

export default function Quoter() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<QuotationFormData>({
    name: "",
    phone: "",
    email: "",
    serviceType: "landing",
    pages: 1,
    customDesign: "no",
    integrations: "none",
    urgency: "standard",
    discount: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [quotationId, setQuotationId] = useState<string | null>(null);

  const calculatePrice = (): number => {
    let price = PRICING[formData.serviceType];

    // Add price for additional pages
    if (formData.pages > 1) {
      price += (formData.pages - 1) * 3000;
    }

    // Add cost for custom design
    if (formData.customDesign === "yes") {
      price += 5000;
    }

    // Add integration costs
    if (formData.integrations !== "none") {
      price += 3000;
    }

    // Add urgency surcharge
    if (formData.urgency === "urgent") {
      price *= 1.2;
    }

    // Apply discount
    if (formData.discount > 0) {
      price *= (1 - formData.discount / 100);
    }

    return Math.round(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage("Por favor ingresa tu nombre");
      setIsSubmitting(false);
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Teléfono inválido");
      setIsSubmitting(false);
      return;
    }

    try {
      const totalPrice = calculatePrice();
      const response = await fetch(`${BACKEND_URL}/api/quotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: cleanPhone.startsWith("54") ? cleanPhone : `54${cleanPhone}`,
          totalPrice,
          customDesign: formData.customDesign,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear cotización");
      }

      const quotation = await response.json();
      setQuotationId(quotation.id);

      // Send to WhatsApp
      const formattedPrice = (totalPrice / 100).toFixed(2);
      const whatsappText = `Hola Jhoel, solicité una cotización para mi proyecto de web. 

*Detalles:*
- Nombre: ${formData.name}
- Tipo: ${formData.serviceType === "landing" ? "Landing Page" : formData.serviceType === "corporate" ? "Sitio Corporativo" : "E-commerce"}
- Páginas: ${formData.pages}
- Diseño personalizado: ${formData.customDesign === "yes" ? "Sí" : "No"}
- Integraciones: ${formData.integrations !== "none" ? formData.integrations : "Ninguna"}
- Urgencia: ${formData.urgency === "urgent" ? "Urgente" : "Normal"}
- Descuento: ${formData.discount}%

*Precio cotizado: $${formattedPrice} ARS*

ID de cotización: ${quotation.id}`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, "_blank");

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        serviceType: "landing",
        pages: 1,
        customDesign: "no",
        integrations: "none",
        urgency: "standard",
        discount: 0,
      });
    } catch (error: any) {
      setErrorMessage(error.message || "Error al procesar la cotización");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = calculatePrice();
  const priceInARS = (totalPrice / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-6">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            data-testid="button-back"
          >
            <ArrowLeft size={20} />
            Volver al inicio
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <Code2 size={24} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Generador de Cotizaciones</h1>
          </div>
          <p className="text-lg text-muted-foreground">Crea tu presupuesto en minutos y recibe el QR en WhatsApp</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Detalles del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Nombre *</Label>
                      <Input
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">Teléfono *</Label>
                      <Input
                        placeholder="+54 9 381 446 8379"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        data-testid="input-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold">Email</Label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      data-testid="input-email"
                    />
                  </div>

                  {/* Service Type */}
                  <div>
                    <Label className="font-semibold mb-3 block">Tipo de Sitio Web *</Label>
                    <RadioGroup
                      value={formData.serviceType}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, serviceType: value })
                      }
                    >
                      {[
                        { value: "landing", label: "Landing Page", price: PRICING.landing },
                        { value: "corporate", label: "Sitio Corporativo", price: PRICING.corporate },
                        { value: "ecommerce", label: "E-commerce", price: PRICING.ecommerce },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50"
                          data-testid={`radio-${option.value}`}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <label htmlFor={option.value} className="flex-1 cursor-pointer">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">
                              Desde ${(option.price / 100).toFixed(0)}
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Pages */}
                  <div>
                    <Label className="font-semibold">Cantidad de Páginas</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData({ ...formData, pages: num })}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            formData.pages === num
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                          }`}
                          data-testid={`button-pages-${num}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    {formData.pages > 1 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        +${((formData.pages - 1) * 3000 / 100).toFixed(0)} por páginas adicionales
                      </p>
                    )}
                  </div>

                  {/* Custom Design */}
                  <div>
                    <Label className="font-semibold mb-3 block">¿Diseño Personalizado? (+$50)</Label>
                    <RadioGroup
                      value={formData.customDesign}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, customDesign: value })
                      }
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="yes" id="custom-yes" />
                        <label htmlFor="custom-yes" className="cursor-pointer">Sí</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="no" id="custom-no" />
                        <label htmlFor="custom-no" className="cursor-pointer">No</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Integrations */}
                  <div>
                    <Label className="font-semibold mb-3 block">Integraciones</Label>
                    <Select
                      value={formData.integrations}
                      onValueChange={(value) =>
                        setFormData({ ...formData, integrations: value })
                      }
                    >
                      <SelectTrigger data-testid="select-integrations">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Ninguna</SelectItem>
                        <SelectItem value="mercadopago">Mercado Pago (+$30)</SelectItem>
                        <SelectItem value="stripe">Stripe (+$30)</SelectItem>
                        <SelectItem value="zapier">Zapier (+$30)</SelectItem>
                        <SelectItem value="multiple">Múltiples (+$60)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Urgency */}
                  <div>
                    <Label className="font-semibold mb-3 block">¿Urgente? (+20%)</Label>
                    <RadioGroup
                      value={formData.urgency}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, urgency: value })
                      }
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="urgent-no" />
                        <label htmlFor="urgent-no" className="cursor-pointer">Normal</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="urgent" id="urgent-yes" />
                        <label htmlFor="urgent-yes" className="cursor-pointer">Urgente</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Discount */}
                  <div>
                    <Label className="font-semibold">Descuento (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({ ...formData, discount: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })
                      }
                      data-testid="input-discount"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                    data-testid="button-submit-quotation"
                  >
                    {isSubmitting ? "Generando..." : "Generar Cotización"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Price Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="shadow-xl sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="text-primary" size={24} />
                  Resumen de Cotización
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Servicio Base</span>
                    <span className="font-medium">${(PRICING[formData.serviceType] / 100).toFixed(0)}</span>
                  </div>
                  {formData.pages > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Páginas Adicionales</span>
                      <span className="font-medium">+${((formData.pages - 1) * 3000 / 100).toFixed(0)}</span>
                    </div>
                  )}
                  {formData.customDesign === "yes" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Diseño Personalizado</span>
                      <span className="font-medium">+$50</span>
                    </div>
                  )}
                  {formData.integrations !== "none" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Integraciones</span>
                      <span className="font-medium">+$30</span>
                    </div>
                  )}
                  {formData.urgency === "urgent" && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Recargo Urgencia</span>
                      <span className="font-medium">+20%</span>
                    </div>
                  )}
                </div>

                {formData.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Descuento</span>
                    <span>-{formData.discount}%</span>
                  </div>
                )}

                <div className="pt-4 border-t-2 border-primary">
                  <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Total</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">${priceInARS}</div>
                      <div className="text-xs text-muted-foreground">ARS</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="text-xs text-muted-foreground">
                    <strong>Incluye:</strong>
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Diseño responsive</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>SEO básico</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Hosting 1 año</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Soporte 30 días</span>
                    </li>
                  </ul>
                </div>

                {quotationId && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Cotización enviada a WhatsApp con QR
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
