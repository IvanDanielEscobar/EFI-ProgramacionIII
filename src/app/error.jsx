"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

export default function Error({ error, reset }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Registrar el error para depuración
    console.error("Error capturado por error.jsx:", error);
  }, [error]);

  const handleClose = () => {
    setIsOpen(false);
    router.push("/");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-background min-h-[60vh]">
      {/* Contenido base atenuado de fondo */}
      <div
        aria-hidden="true"
        className="max-w-md w-full space-y-4 opacity-30 blur-[1px] pointer-events-none select-none transition-opacity"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Error en la aplicación
        </h2>
        <p className="text-xs text-muted-foreground">
          Ocurrió un problema inesperado al cargar la sección solicitada.
        </p>
      </div>

      {/* Modal de Error Accesible */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Algo no salió como esperábamos"
        description="Ocurrió un problema al procesar la información solicitada."
        size="md"
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2.5 w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              leftIcon={RefreshCw}
              onClick={() => {
                reset();
              }}
            >
              Reintentar
            </Button>
            <Link href="/">
              <Button variant="secondary" size="sm" leftIcon={Home}>
                Ir al Inicio
              </Button>
            </Link>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-left">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 dark:text-red-300 block">
                Detalle técnico del error
              </span>
              <p className="text-xs text-red-800 dark:text-red-200 font-mono break-all leading-relaxed">
                {error?.message || "Error inesperado en tiempo de ejecución."}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
            Puedes intentar recargar la acción con el botón reintentar o volver al inicio de Home & Deco.
          </p>
        </div>
      </Modal>
    </div>
  );
}