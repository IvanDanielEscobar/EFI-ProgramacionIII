"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Armchair, Home, Search, ArrowLeft } from "lucide-react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

export default function NotFound() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

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
        <div className="w-16 h-16 rounded-2xl bg-camel/15 text-cocoa dark:text-camel mx-auto flex items-center justify-center">
          <Armchair className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          404 • Página no encontrada
        </h2>
        <p className="text-xs text-muted-foreground">
          El artículo que estás buscando no existe o fue movido.
        </p>
      </div>

      {/* Modal Interactivo de Página No Encontrada */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Página no encontrada (Error 404)"
        description="El mueble, ambiente o sección que estás intentando ver no existe o ha sido reubicada en nuestro catálogo."
        size="md"
        footer={
          <div className="flex flex-wrap items-center justify-end gap-2.5 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={ArrowLeft}
              onClick={() => router.back()}
            >
              Volver Atrás
            </Button>
            <Link href="/catalogo">
              <Button variant="outline" size="sm" leftIcon={Search}>
                Ver Catálogo
              </Button>
            </Link>
            <Link href="/">
              <Button variant="primary" size="sm" leftIcon={Home}>
                Ir al Inicio
              </Button>
            </Link>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-16 h-16 rounded-2xl bg-camel/15 text-cocoa dark:text-camel flex items-center justify-center shadow-2xs border border-khaki/40 dark:border-border">
            <Armchair className="w-8 h-8" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
            Es posible que el enlace haya cambiado o que la pieza de diseño ya no esté en exhibición. Te invitamos a explorar las colecciones activas de nuestra tienda.
          </p>
        </div>
      </Modal>
    </div>
  );
}