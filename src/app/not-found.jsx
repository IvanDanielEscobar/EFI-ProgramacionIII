import Link from "next/link";
import { Armchair, ArrowLeft, Home, Search } from "lucide-react";

export const metadata = {
  title: "Página no encontrada | Home & Deco",
  description: "La página que buscas no existe o fue movida.",
};

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-background">
      <div className="max-w-md w-full space-y-6">
        {/* Ícono */}
        <div className="w-20 h-20 rounded-3xl bg-camel/15 text-cocoa dark:text-camel mx-auto flex items-center justify-center shadow-xs">
          <Armchair className="w-10 h-10" />
        </div>

        {/* Textos */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Página no encontrada
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La articulo que estás intentando ver no existe o ha
            sido reubicado en nuestro catálogo.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold text-sm hover:opacity-90 transition-opacity min-h-[44px]"
          >
            <span>Ir al Inicio</span>
          </Link>
          <Link
            href="/catalogo"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors min-h-[44px]"
          >
            <span>Explorar Catálogo</span>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          Home & Deco
        </p>
      </div>
    </div>
  );
}

