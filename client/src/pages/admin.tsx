import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X, LogOut, Eye, EyeOff, Clock, User, Phone, Home, Trash2, Code2, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Appointment } from "@shared/schema";

const BACKEND_URL = "https://ab09c429-fccd-49d5-8cac-5b4ea9caf0e9-00-3jgf16yawkg1l.riker.replit.dev";
const WHATSAPP_NUMBER = "5493814468379";

const PRICING = {
  landing: 200000,
  corporate: 400000,
  ecommerce: 750000,
};

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

interface Quotation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  serviceType: string;
  pages: number;
  customDesign: string;
  integrations: string;
  urgency: string;
  discount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "jhoel2025") {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("Contraseña incorrecta");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Acceso Admin</CardTitle>
            <CardDescription>Ingresa tu contraseña para acceder</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center gap-4">
          <h1 className="font-heading font-bold text-lg md:text-xl text-slate-900">Dashboard Admin</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Inicio</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
              className="gap-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <AppointmentsAndQuotations queryClient={queryClient} />
      </div>
    </div>
  );
}

function AppointmentsAndQuotations({ queryClient }: { queryClient: any }) {
  const [activeTab, setActiveTab] = useState<"citas" | "cotizador" | "aprobaciones">("citas");
  
  const { data: appointmentsRaw = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/appointments`);
      return res.json();
    },
  });

  const appointments = Array.isArray(appointmentsRaw) ? appointmentsRaw : [];

  const { data: quotationsRaw = [], isLoading: quotationsLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/quotations`);
      return res.json();
    },
  });

  const quotations = Array.isArray(quotationsRaw) ? quotationsRaw : [];

  const appointmentsPending = appointments.filter(a => a.status === "pending").length;
  const appointmentsConfirmed = appointments.filter(a => a.status === "confirmed").length;
  const quotationsPending = quotations.filter(q => q.status === "pending").length;
  const quotationsAccepted = quotations.filter(q => q.status === "accepted").length;
  const totalValue = quotations.reduce((sum, q) => sum + (q.totalPrice || 0), 0);

  return (
    <div className="space-y-6">
      {/* Dashboard Summary - Citas y Cotizaciones */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Dashboard General</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Citas Pendientes</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{appointmentsPending}</p>
                </div>
                <Calendar className="text-blue-500 opacity-50" size={28} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Citas Confirmadas</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{appointmentsConfirmed}</p>
                </div>
                <CheckCircle2 className="text-green-500 opacity-50" size={28} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Cotizaciones Pendientes</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{quotationsPending}</p>
                </div>
                <Clock className="text-yellow-500 opacity-50" size={28} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-1">Valor Total</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">${(totalValue / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="text-primary opacity-50" size={28} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("citas")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "citas"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-testid="tab-citas"
        >
          <Calendar size={18} />
          Solicitudes de Citas
        </button>
        <button
          onClick={() => setActiveTab("cotizador")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "cotizador"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-testid="tab-cotizador"
        >
          <Code2 size={18} />
          Cotizador
        </button>
        <button
          onClick={() => setActiveTab("aprobaciones")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === "aprobaciones"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-testid="tab-aprobaciones"
        >
          <CheckCircle2 size={18} />
          Aprobación de Cotizaciones
        </button>
      </div>

      {activeTab === "citas" && <AppointmentsList />}
      {activeTab === "cotizador" && <QuotationManager queryClient={queryClient} />}
      {activeTab === "aprobaciones" && <QuotationApprovalList queryClient={queryClient} />}
    </div>
  );
}

function AppointmentsList() {
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/appointments`);
      return res.json() as Promise<Appointment[]>;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${BACKEND_URL}/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BACKEND_URL}/api/appointments/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  const pending = appointments.filter((a) => a.status === "pending");
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const cancelled = appointments.filter((a) => a.status === "cancelled");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Card className="h-24 sm:h-auto">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Solicitudes Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{pending.length}</p>
          </CardContent>
        </Card>
        <Card className="h-24 sm:h-auto">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Citas Confirmadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{confirmed.length}</p>
          </CardContent>
        </Card>
        <Card className="h-24 sm:h-auto">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total de Solicitudes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{appointments.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <AppointmentSection title="Solicitudes Pendientes" appointments={pending} updateMutation={updateMutation} deleteMutation={deleteMutation} />
        <AppointmentSection title="Citas Confirmadas" appointments={confirmed} updateMutation={updateMutation} deleteMutation={deleteMutation} />
        <AppointmentSection title="Citas Canceladas" appointments={cancelled} updateMutation={updateMutation} deleteMutation={deleteMutation} />
      </div>
    </div>
  );
}

function AppointmentSection({
  title,
  appointments,
  updateMutation,
  deleteMutation,
}: {
  title: string;
  appointments: Appointment[];
  updateMutation: any;
  deleteMutation: any;
}) {
  if (appointments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="border border-border rounded-lg p-3 sm:p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">{apt.name}</h4>
                    <Badge
                      variant={
                        apt.status === "confirmed"
                          ? "default"
                          : apt.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {apt.status === "pending"
                        ? "Pendiente"
                        : apt.status === "confirmed"
                          ? "Confirmada"
                          : "Cancelada"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <span className="break-all">{apt.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {apt.date} {apt.time}
                    </div>
                    {apt.message && <p className="text-xs mt-2 italic line-clamp-2">{apt.message}</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border">
                {apt.status !== "confirmed" && (
                  <Button
                    size="sm"
                    onClick={() => updateMutation.mutate({ id: apt.id, status: "confirmed" })}
                    disabled={updateMutation.isPending || deleteMutation.isPending}
                    className="gap-2 text-xs sm:text-sm"
                  >
                    <CheckCircle2 size={16} />
                    Confirmar
                  </Button>
                )}
                {apt.status !== "cancelled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMutation.mutate({ id: apt.id, status: "cancelled" })}
                    disabled={updateMutation.isPending || deleteMutation.isPending}
                    className="gap-2 text-xs sm:text-sm"
                  >
                    <X size={16} />
                    Cancelar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm("¿Estás seguro de que deseas eliminar esta solicitud?")) {
                      deleteMutation.mutate(apt.id);
                    }
                  }}
                  disabled={deleteMutation.isPending || updateMutation.isPending}
                  className="gap-2 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuotationManager({ queryClient }: { queryClient: any }) {
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
  const [showClientSearch, setShowClientSearch] = useState(false);

  // Fetch confirmed appointments for client search
  const { data: confirmedAppointments = [] } = useQuery({
    queryKey: ["appointmentsConfirmed"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/appointments`);
      const all = await res.json() as Appointment[];
      return all.filter((a) => a.status === "confirmed");
    },
  });

  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/quotations`);
      return res.json() as Promise<Quotation[]>;
    },
  });

  const calculatePrice = (): number => {
    let price = PRICING[formData.serviceType];

    if (formData.pages > 1) {
      price += (formData.pages - 1) * 40000;
    }

    if (formData.customDesign === "yes") {
      price += 80000;
    }

    if (formData.integrations !== "none") {
      price += 60000;
    }

    if (formData.urgency === "urgent") {
      price *= 1.2;
    }

    if (formData.discount > 0) {
      price *= (1 - formData.discount / 100);
    }

    return Math.round(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      setErrorMessage("Por favor ingresa tu nombre");
      setIsSubmitting(false);
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    
    // Validar que sea un número argentino válido (10, 11 o 13 dígitos)
    if (![10, 11, 13].includes(cleanPhone.length)) {
      setErrorMessage("Teléfono inválido. Usa un número argentino válido.");
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
          phone: cleanPhone,
          totalPrice,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear cotización");
      }

      const quotation = await response.json();
      setQuotationId(quotation.id);
      queryClient.invalidateQueries({ queryKey: ["quotations"] });

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
  const priceInARS = (totalPrice / 1000).toFixed(0);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 size={20} />
                Generador de Cotizaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="font-semibold mb-3 block">Buscar Cliente (Citas Confirmadas)</Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowClientSearch(!showClientSearch)}
                      className="w-full px-4 py-2 border rounded-lg text-left hover:bg-slate-50 transition-colors"
                      data-testid="button-search-clients"
                    >
                      {formData.name || "Seleccionar cliente..."}
                    </button>
                    {showClientSearch && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {confirmedAppointments.length === 0 ? (
                          <div className="p-4 text-muted-foreground text-sm">No hay citas confirmadas</div>
                        ) : (
                          confirmedAppointments.map((apt) => (
                            <button
                              key={apt.id}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  name: apt.name,
                                  phone: apt.phone,
                                });
                                setShowClientSearch(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b last:border-b-0 transition-colors"
                              data-testid={`option-client-${apt.id}`}
                            >
                              <div className="font-medium text-sm">{apt.name}</div>
                              <div className="text-xs text-muted-foreground">{apt.phone}</div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

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
                  <Label className="font-semibold">Email (Contacto Secundario)</Label>
                  <Input
                    type="email"
                    placeholder="jhoelalbornoz8989@gmail.com"
                    disabled
                    value="jhoelalbornoz8989@gmail.com"
                    data-testid="input-email"
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </div>

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
                            Desde ${(option.price / 1000).toFixed(0)}k
                          </div>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

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
                </div>

                <div>
                  <Label className="font-semibold mb-3 block">¿Diseño Personalizado? (+$80.000)</Label>
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
                      <SelectItem value="mercadopago">Mercado Pago (+$60.000)</SelectItem>
                      <SelectItem value="stripe">Stripe (+$60.000)</SelectItem>
                      <SelectItem value="zapier">Zapier (+$60.000)</SelectItem>
                      <SelectItem value="multiple">Múltiples (+$120.000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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

                {quotationId && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Cotización guardada. Envía desde "Aprobación de Cotizaciones"
                    </p>
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
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="text-primary" size={24} />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 pb-4 border-b text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base</span>
                  <span className="font-medium">${(PRICING[formData.serviceType] / 1000).toFixed(0)}k</span>
                </div>
                {formData.pages > 1 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Páginas Adicionales</span>
                    <span className="font-medium">+${((formData.pages - 1) * 40000 / 1000).toFixed(0)}k</span>
                  </div>
                )}
                {formData.customDesign === "yes" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diseño Personalizado</span>
                    <span className="font-medium">+$80k</span>
                  </div>
                )}
                {formData.integrations !== "none" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Integraciones</span>
                    <span className="font-medium">+$60k</span>
                  </div>
                )}
                {formData.urgency === "urgent" && (
                  <div className="flex justify-between text-orange-600">
                    <span>Urgencia</span>
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
                    <div className="text-3xl font-bold text-primary">${priceInARS}k</div>
                    <div className="text-xs text-muted-foreground">ARS</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuotationApprovalList({ queryClient }: { queryClient: any }) {
  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/quotations`);
      return res.json() as Promise<Quotation[]>;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${BACKEND_URL}/api/quotations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  const pendingQuotations = quotations.filter((q) => q.status === "pending");
  const acceptedQuotations = quotations.filter((q) => q.status === "accepted");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <Card className="h-24 sm:h-auto">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Cotizaciones Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{pendingQuotations.length}</p>
          </CardContent>
        </Card>
        <Card className="h-24 sm:h-auto">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Cotizaciones Aprobadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{acceptedQuotations.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {pendingQuotations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes Pendientes de Aprobación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingQuotations.map((quot) => (
                  <div
                    key={quot.id}
                    className="border border-border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-bold text-sm sm:text-base">{quot.name}</h4>
                          <Badge className="text-xs">{quot.serviceType === "landing" ? "Landing" : quot.serviceType === "corporate" ? "Corporativo" : "E-commerce"}</Badge>
                          <Badge variant="secondary" className="text-xs">Pendiente</Badge>
                        </div>
                        <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{quot.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign size={14} />
                            <span className="font-semibold text-primary">${(quot.totalPrice / 1000).toFixed(0)}k</span>
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Detalles:</span> {quot.pages} página{quot.pages > 1 ? "s" : ""}, {quot.customDesign === "yes" ? "Diseño personalizado" : "Diseño estándar"}, {quot.integrations !== "none" ? quot.integrations : "sin integraciones"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        onClick={() => {
                          const formattedPrice = (quot.totalPrice / 1000).toFixed(0);
                          const whatsappText = `Hola ${quot.name}, te envío tu cotización solicitada para tu proyecto web:

*Detalles de tu Cotización:*
- Tipo de sitio: ${quot.serviceType === "landing" ? "Landing Page" : quot.serviceType === "corporate" ? "Sitio Corporativo" : "E-commerce"}
- Páginas: ${quot.pages}
- Diseño personalizado: ${quot.customDesign === "yes" ? "Sí" : "No"}
- Integraciones: ${quot.integrations !== "none" ? quot.integrations : "Ninguna"}
- Urgencia: ${quot.urgency === "urgent" ? "Urgente" : "Normal"}

💰 *Precio: $${formattedPrice}k ARS*

Para confirmar o consultar más detalles, contáctame.

ID de cotización: ${quot.id}`;
                          
                          // Formatear teléfono: si tiene 10, 11 o 13 dígitos, agregamos +54 al inicio
                          let phone = quot.phone;
                          if (phone.length === 10) phone = "54" + phone;
                          else if (phone.length === 11) phone = "54" + phone.substring(1);
                          else if (phone.length === 13 && phone.startsWith("54")) phone = phone;
                          
                          const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappText)}`;
                          window.open(whatsappUrl, "_blank");
                        }}
                        className="gap-2 text-xs sm:text-sm bg-green-600 hover:bg-green-700"
                        data-testid={`button-send-whatsapp-${quot.id}`}
                      >
                        Enviar por WhatsApp
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate({ id: quot.id, status: "accepted" })}
                        disabled={approveMutation.isPending}
                        className="gap-2 text-xs sm:text-sm"
                        data-testid={`button-approve-quotation-${quot.id}`}
                      >
                        <CheckCircle2 size={16} />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveMutation.mutate({ id: quot.id, status: "rejected" })}
                        disabled={approveMutation.isPending}
                        className="gap-2 text-xs sm:text-sm"
                        data-testid={`button-reject-quotation-${quot.id}`}
                      >
                        <X size={16} />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {acceptedQuotations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones Aprobadas - Listo para Trabajar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {acceptedQuotations.map((quot) => (
                  <div
                    key={quot.id}
                    className="border border-green-200 bg-green-50 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-bold text-sm sm:text-base">{quot.name}</h4>
                          <Badge className="text-xs bg-green-600">{quot.serviceType === "landing" ? "Landing" : quot.serviceType === "corporate" ? "Corporativo" : "E-commerce"}</Badge>
                          <Badge className="text-xs bg-green-600">Aprobada</Badge>
                        </div>
                        <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{quot.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign size={14} />
                            <span className="font-semibold text-green-700">${(quot.totalPrice / 1000).toFixed(0)}k</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {pendingQuotations.length === 0 && acceptedQuotations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No hay cotizaciones aún</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
