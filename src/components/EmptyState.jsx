// Server Component 
import { Armchair } from "lucide-react";

export function EmptyState({
  icon: Icon = Armchair,
  title = "No se encontraron resultados",
  description = "Intenta ajustar los filtros o el término de búsqueda para ver más piezas.",
  action,
  className = "",
  ...props
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-linen/50 dark:bg-card border border-khaki/30 dark:border-border max-w-lg mx-auto ${className}`}
      {...props}
    >
      <div className="w-16 h-16 rounded-2xl bg-camel/15 text-cocoa dark:text-camel flex items-center justify-center mb-4 shadow-2xs border border-khaki/40 dark:border-border">
        <Icon className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-espresso dark:text-linen tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
        {description}
      </p>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}

export default EmptyState;
