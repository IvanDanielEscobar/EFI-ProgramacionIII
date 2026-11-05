"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  className = "",
}) {
  const modalRef = useRef(null);

  // Manejo de tecla Escape y scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className={`w-full ${sizes[size] || sizes.md} rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 transition-all ${className}`}
      >
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h3
                id="modal-title"
                className="text-lg sm:text-xl font-bold text-espresso dark:text-linen tracking-tight"
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                id="modal-description"
                className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="text-sm text-foreground">{children}</div>

        {/* Acciones */}
        {footer && (
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
