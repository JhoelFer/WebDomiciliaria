import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmAppointmentButtonProps {
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  label?: string;
  onClick?: (e: React.FormEvent) => void;
}

export function ConfirmAppointmentButton({
  isSubmitting = false,
  disabled = false,
  className = "w-full rounded-lg h-12 text-sm md:text-base font-medium shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:bg-green-600 bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
  variant = "default",
  size = "default",
  showIcon = true,
  label = "Confirmar Solicitud",
  onClick
}: ConfirmAppointmentButtonProps) {
  const isDisabled = disabled || isSubmitting;

  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={isDisabled}
      variant={variant}
      size={size}
      className={className}
      data-testid="button-confirm-appointment"
    >
      {showIcon && <MessageCircle className="mr-2 h-5 w-5" />}
      {isSubmitting ? "Guardando..." : label}
    </Button>
  );
}
