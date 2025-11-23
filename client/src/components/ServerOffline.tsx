import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ServerOffline() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <div className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
              <AlertCircle className="relative text-red-500" size={64} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Servicio No Disponible</h1>
            <p className="text-slate-600 text-sm">
              El servidor está en mantenimiento o no se puede conectar en este momento.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left">
            <p className="text-xs text-slate-600 mb-2 font-medium">¿Qué puedes hacer?</p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Intenta nuevamente en unos momentos</li>
              <li>• Verifica tu conexión a internet</li>
              <li>• Si el problema persiste, contáctanos</li>
            </ul>
          </div>

          <Button
            onClick={() => window.location.reload()}
            className="w-full gap-2"
          >
            <RefreshCw size={16} />
            Reintentar
          </Button>

          <p className="text-xs text-slate-500">
            Si necesitas ayuda, contáctanos a <a href="mailto:jhoelalbornoz8989@gmail.com" className="text-primary hover:underline">jhoelalbornoz8989@gmail.com</a>
          </p>
        </div>
      </Card>
    </div>
  );
}
