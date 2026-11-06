"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, type = "info", duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, title, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message, title = "Éxito", duration = 4000) =>
      addToast({ title, message, type: "success", duration }),
    error: (message, title = "Error", duration = 5000) =>
      addToast({ title, message, type: "error", duration }),
    info: (message, title = "Información", duration = 4000) =>
      addToast({ title, message, type: "info", duration }),
    remove: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Floating Container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === "success";
          const isError = t.type === "error";

          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in ${
                isSuccess
                  ? "bg-emerald-950/90 dark:bg-emerald-950/95 border-emerald-700/60 text-emerald-50"
                  : isError
                  ? "bg-red-950/90 dark:bg-red-950/95 border-red-700/60 text-red-50"
                  : "bg-espresso/90 dark:bg-[#1a1410]/95 border-khaki/30 text-linen"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-camel" />}
              </div>

              <div className="flex-1 min-w-0">
                {t.title && (
                  <p className="text-xs font-bold uppercase tracking-wider leading-none mb-1 opacity-90">
                    {t.title}
                  </p>
                )}
                <p className="text-xs leading-relaxed font-medium">{t.message}</p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Cerrar notificación"
                className="shrink-0 p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe ser utilizado dentro de un ToastProvider");
  }
  return context;
}

