"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Registrar el error para depuración
    console.error("Error capturado por error.jsx:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-background">
      <div className="max-w-md w-full p-8 rounded-2xl bg-card border border-border shadow-sm space-y-6">
        {/* Icono de alerta */}
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Textos del error */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
            Algo no salió como esperábamos
          </span>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Error en la aplicación
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {error?.message ||
              "Ocurrió un problema inesperado al cargar la sección solicitada."}
          </p>
        </div>

        {/* acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {/* reintentar */}
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-sm transition-all cursor-pointer shadow-xs min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
          {/* volver al inicio */}
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-khaki hover:border-espresso dark:border-border dark:hover:border-camel text-espresso dark:text-linen font-semibold text-sm hover:bg-muted transition-colors min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>Ir al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

