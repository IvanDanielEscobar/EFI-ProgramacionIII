import { Armchair } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[50vh] bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* icono animado */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-camel/15 text-cocoa dark:text-camel flex items-center justify-center animate-pulse">
            <Armchair className="w-8 h-8" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-camel border-t-transparent animate-spin"></div>
        </div>

        {/* textos */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Cargando Home & Deco...
          </p>
          <p className="text-xs text-muted-foreground">
            Obteniendo el catálogo
          </p>
        </div>
      </div>
    </div>
  );
}

