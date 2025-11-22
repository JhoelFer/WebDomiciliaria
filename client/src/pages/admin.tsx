import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X, LogOut, Eye, EyeOff, Clock, User, Phone, Home, Trash2 } from "lucide-react";
import type { Appointment } from "@shared/schema";

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
            <CardDescription>Ingresa tu contraseña para ver las citas</CardDescription>
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
        <AppointmentsList />
      </div>
    </div>
  );
}

function AppointmentsList() {
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments");
      return res.json() as Promise<Appointment[]>;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/appointments/${id}`, {
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
      const res = await fetch(`/api/appointments/${id}`, {
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
        <Section title="Solicitudes Pendientes" appointments={pending} updateMutation={updateMutation} deleteMutation={deleteMutation} />
        <Section title="Citas Confirmadas" appointments={confirmed} updateMutation={updateMutation} deleteMutation={deleteMutation} />
        <Section title="Citas Canceladas" appointments={cancelled} updateMutation={updateMutation} deleteMutation={deleteMutation} />
      </div>
    </div>
  );
}

function Section({
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
