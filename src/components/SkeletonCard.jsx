// Server Component (R2: skeleton loader para streaming y estados de carga de muebles)
export function SkeletonCard({ className = "", count = 1 }) {
  const cards = Array.from({ length: count }, (_, index) => index);

  return (
    <>
      {cards.map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`rounded-2xl overflow-hidden bg-card border border-border/60 p-4 space-y-4 animate-pulse shadow-xs ${className}`}
        >
          {/* Contenedor */}
          <div className="aspect-4/3 w-full bg-linen dark:bg-muted/70 rounded-xl" />

          {/* Informacion */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="h-4 bg-khaki/40 dark:bg-muted rounded-md w-3/5" />
              <div className="flex gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-khaki/30 dark:bg-muted" />
                <div className="w-3.5 h-3.5 rounded-full bg-khaki/30 dark:bg-muted" />
              </div>
            </div>

            <div className="h-3 bg-khaki/30 dark:bg-muted/60 rounded-md w-1/3" />

            <div className="pt-2 space-y-1">
              <div className="h-5 bg-khaki/40 dark:bg-muted rounded-md w-2/5" />
              <div className="h-3 bg-khaki/20 dark:bg-muted/40 rounded-md w-1/2" />
            </div>

            <div className="pt-2">
              <div className="h-10 bg-khaki/30 dark:bg-muted/60 rounded-xl w-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default SkeletonCard;
